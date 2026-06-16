/**
 * Stub SMS gateway. Replace with MSG91/Twilio integration later.
 * In dev/test we just log the OTP so it can be read from the console.
 */
export async function sendSms(mobile: string, otp: string): Promise<void> {
  console.log(`[sms] OTP for ${mobile}: ${otp}`);
}
