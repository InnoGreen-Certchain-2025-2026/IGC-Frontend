export interface RegisterRequest {
  email: string;
  name: string;
  citizenIdNumber: string;
  phoneNumber: string;
  address: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  password: string;
}
