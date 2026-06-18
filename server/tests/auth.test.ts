import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/utils/prisma";
import { stubSms } from "./helpers";

const MOBILE = "9876543210";
const TEST_OTP = "123456";

describe("POST /auth/otp/request + /auth/otp/verify", () => {
  it("1. new mobile -> request OTP -> verify -> creates patient/self_signup/active, returns tokens, isNewUser=true", async () => {
    const { setOtp } = stubSms();

    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);

    setOtp(TEST_OTP);

    const res = await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp: TEST_OTP })
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

    const { setOtp } = stubSms();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);

    setOtp(TEST_OTP);

    const res = await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp: TEST_OTP })
      .expect(200);

    expect(res.body.user.isNewUser).toBe(false);

    const user = await prisma.user.findUnique({ where: { mobile: MOBILE } });
    expect(user?.status).toBe("active");
    expect(user?.mobileVerifiedAt).not.toBeNull();
  });

  it("3. wrong OTP is rejected with 400", async () => {
    // The external provider returns false for any OTP that doesn't match TEST_OTP.
    const { setOtp } = stubSms();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);

    setOtp(TEST_OTP);

    await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp: "000000" })
      .expect(400);
  });

  it("4. requesting a new OTP expires the previous audit record", async () => {
    const { setOtp } = stubSms();

    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);

    const first = await prisma.otpVerification.findFirst({
      where: { mobile: MOBILE },
      orderBy: { createdAt: "desc" },
    });
    expect(first?.verifiedAt).toBeNull();
    expect(first?.expiresAt.getTime()).toBeGreaterThan(Date.now());

    // Second request should expire the first record.
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);

    const firstRefreshed = await prisma.otpVerification.findUnique({
      where: { id: first!.id },
    });
    expect(firstRefreshed?.expiresAt.getTime()).toBeLessThanOrEqual(Date.now());

    // Verify still succeeds because the external provider is the authority on expiry.
    setOtp(TEST_OTP);
    await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp: TEST_OTP })
      .expect(200);
  });

  it("5. 8th OTP request within 15 minutes returns 429", async () => {
    stubSms();
    for (let i = 0; i < 7; i++) {
      await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    }
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(429);
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

    const { setOtp } = stubSms();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);

    setOtp(TEST_OTP);

    await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp: TEST_OTP })
      .expect(403);
  });
});

describe("POST /auth/token/refresh", () => {
  async function signUpAndLogin() {
    const { setOtp } = stubSms();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    setOtp(TEST_OTP);
    const res = await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp: TEST_OTP })
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
    const { setOtp } = stubSms();
    await request(app).post("/auth/otp/request").send({ mobile: MOBILE }).expect(200);
    setOtp(TEST_OTP);
    const { body } = await request(app)
      .post("/auth/otp/verify")
      .send({ mobile: MOBILE, otp: TEST_OTP })
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
