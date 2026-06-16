import * as smsService from "../src/services/sms.service";

export function captureOtp() {
  const spy = jest.spyOn(smsService, "sendSms").mockImplementation(async () => {});

  return {
    spy,
    latest(): string {
      const calls = spy.mock.calls;
      const lastCall = calls[calls.length - 1];
      if (!lastCall) {
        throw new Error("sendSms was never called");
      }
      return lastCall[1];
    },
  };
}
