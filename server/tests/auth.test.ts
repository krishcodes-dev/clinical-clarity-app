import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/utils/prisma";
import { captureOtp } from "./helpers";

const MOBILE = "9876543210";

describe("POST /auth/otp/request + /auth/otp/verify", () => {
  it("1. new mobile -> request OTP -> verify -> creates patient/self_signup/active, returns tokens, isNewUser=true", async () => {
    const otpCapture = captureOtp();

    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);

    const otp = otpCapture.latest();

    const res = await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user).toMatchObject({
      mobile: MOBILE,
      role: "patient",
      isNewUser: true,
    });

    const user = await prisma.user.findUnique({ where: { mobile: MOBILE } });
    expect(user).toMatchObject({
      role: "patient",
      source: "self_signup",
      status: "active",
    });
    expect(user?.mobileVerifiedAt).not.toBeNull();
  });

  it("2. seeded pending hospital patient -> verify -> status flips to active, isNewUser=false", async () => {
    await prisma.user.create({
      data: {
        mobile: MOBILE,
        role: "patient",
        source: "hospital",
        status: "pending",
      },
    });

    const otpCapture = captureOtp();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    const otp = otpCapture.latest();

    const res = await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp })
      .expect(200);

    expect(res.body.user.isNewUser).toBe(false);

    const user = await prisma.user.findUnique({ where: { mobile: MOBILE } });
    expect(user?.status).toBe("active");
    expect(user?.mobileVerifiedAt).not.toBeNull();
  });

  it("3. wrong OTP 5 times invalidates the OTP", async () => {
    const otpCapture = captureOtp();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    const correctOtp = otpCapture.latest();
    const wrongOtp = correctOtp === "000000" ? "111111" : "000000";

    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/auth/otp/verify")
        .send({ mobile: MOBILE, otp: wrongOtp })
        .expect(400);
    }

    // Even the correct OTP should now be rejected since attempts are exhausted.
    await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp: correctOtp })
      .expect(400);
  });

  it("4. expired OTP is rejected", async () => {
    const otpCapture = captureOtp();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    const otp = otpCapture.latest();

    await prisma.otpVerification.updateMany({
      where: { mobile: MOBILE },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    await request(app).post("/auth/otp/verify").send({ mobile: MOBILE, otp }).expect(400);
  });

  it("5. 4th OTP request within 15 minutes returns 429", async () => {
    const otpCapture = captureOtp();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(429);
    otpCapture.spy.mockRestore();
  });

  it("6. blocked user verify returns 403", async () => {
    await prisma.user.create({
      data: {
        mobile: MOBILE,
        role: "patient",
        source: "self_signup",
        status: "blocked",
        mobileVerifiedAt: new Date(),
      },
    });

    const otpCapture = captureOtp();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    const otp = otpCapture.latest();

    await request(app).post("/auth/otp/verify").send({ mobile: MOBILE, otp }).expect(403);
  });
});

describe("POST /auth/token/refresh", () => {
  async function signUpAndLogin() {
    const otpCapture = captureOtp();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    const otp = otpCapture.latest();
    const res = await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp })
      .expect(200);
    return res.body as { accessToken: string; refreshToken: string };
  }

  it("7. rotation works, and reusing a revoked refresh token is rejected", async () => {
    const { refreshToken: firstRefreshToken } = await signUpAndLogin();

    const refreshRes = await request(app)
      .post("/auth/token/refresh")
      .send({ refreshToken: firstRefreshToken })
      .expect(200);

    expect(refreshRes.body.accessToken).toBeDefined();
    expect(refreshRes.body.refreshToken).toBeDefined();
    expect(refreshRes.body.refreshToken).not.toBe(firstRefreshToken);

    // Reusing the now-revoked original refresh token must be rejected.
    await request(app)
      .post("/auth/token/refresh")
      .send({ refreshToken: firstRefreshToken })
      .expect(401);
  });
});

describe("POST /auth/logout", () => {
  it("revokes the refresh token", async () => {
    const otpCapture = captureOtp();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    const otp = otpCapture.latest();
    const { body } = await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp })
      .expect(200);

    await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${body.accessToken}`)
      .send({ refreshToken: body.refreshToken })
      .expect(200);

    await request(app)
      .post("/auth/token/refresh")
      .send({ refreshToken: body.refreshToken })
      .expect(401);
  });
});
