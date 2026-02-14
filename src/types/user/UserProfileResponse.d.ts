export interface UserProfileResponse {
  name: string;
  phoneNumber: string;
  address: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
}
