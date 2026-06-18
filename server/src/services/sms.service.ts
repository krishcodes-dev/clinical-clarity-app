import { AppError } from "../errors/AppError";

const OTP_API_BASE = "https://abhayainformation.com/api/otp";


function toE164(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return mobile;
}

export async function sendOtpSms(mobile: string): Promise<void> {
  const res = await fetch(`${OTP_API_BASE}/sendotp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobileNo: toE164(mobile) }),
  });

  if (!res.ok) {
    throw new AppError(502, "OTP_SEND_FAILED", "Failed to send OTP. Please try again.");
  }
}

export async function verifyOtpExternal(mobile: string, otp: string): Promise<boolean> {
  const res = await fetch(`${OTP_API_BASE}/verifyOtp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobileNo: toE164(mobile), code: otp }),
  });

  if (!res.ok) return false;
  const data = await res.json().catch(() => ({})) as { status?: unknown };
  return data.status === true;
}
