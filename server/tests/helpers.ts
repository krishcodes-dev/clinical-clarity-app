import * as smsService from "../src/services/sms.service";

/**
 * Stubs both SMS functions for integration tests:
 *  - sendOtpSms  → no-op (prevents real HTTP calls)
 *  - verifyOtpExternal → returns true only for the supplied test OTP
 *
 * Usage:
 *   const { setOtp } = stubSms();
 *   setOtp("123456");
 *   // POST /auth/otp/verify with { otp: "123456" } will now succeed
 */
export function stubSms() {
  let expectedOtp = "";

  jest.spyOn(smsService, "sendOtpSms").mockImplementation(async () => {});
  jest.spyOn(smsService, "verifyOtpExternal").mockImplementation(
    async (_mobile, otp) => otp === expectedOtp
  );

  return {
    setOtp(otp: string) {
      expectedOtp = otp;
    },
  };
}
