export interface AccessTokenData {
  role: string;
  id: string;
  accessToken: string;
  refreshToken: string;
  expireIns: number;
}
export interface ApiResponse {
  success: boolean | string;
  data: AccessTokenData;
}
