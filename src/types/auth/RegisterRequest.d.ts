export interface RegisterRequest {
  email: string;
  name: string;
  phoneNumber: string;
  address: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  password: string;
}
