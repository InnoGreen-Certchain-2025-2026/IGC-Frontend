import { UserSessionResponse } from "./UserSessionResponse";

export interface DefaultAuthResponse {
  userSessionResponse: UserSessionResponse;
  accessToken: string;
}
