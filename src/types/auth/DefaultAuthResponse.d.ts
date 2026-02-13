import { UserSessionResponse } from "../user/UserSessionResponse";

export interface DefaultAuthResponse {
  userSessionResponse: UserSessionResponse;
  accessToken: string;
}
