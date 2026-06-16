import * as otpService from "./otp.service";
import * as tokenService from "./token.service";

export async function requestOtp(mobile: string): Promise<void> {
  await otpService.requestOtp(mobile);
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    mobile: string;
    full_name: string | null;
    role: string;
    isNewUser: boolean;
  };
}

export async function verifyOtp(
  mobile: string,
  otp: string,
  deviceInfo?: string
): Promise<VerifyOtpResponse> {
  const { user, isNewUser } = await otpService.verifyOtpAndResolveUser(mobile, otp);
  const { accessToken, refreshToken } = await tokenService.issueTokenPair(user.id, user.role, deviceInfo);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      mobile: user.mobile,
      full_name: user.fullName,
      role: user.role,
      isNewUser,
    },
  };
}

export async function refreshTokens(refreshToken: string, deviceInfo?: string) {
  return tokenService.rotateRefreshToken(refreshToken, deviceInfo);
}

export async function logout(userId: string, refreshToken: string): Promise<void> {
  await tokenService.revokeRefreshToken(userId, refreshToken);
}
