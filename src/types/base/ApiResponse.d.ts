export interface ApiResponse<T> {
  errorMessage: string;
  errorCode: number;
  data: T;
}
