export interface User {
  id: number;
  email: string;
  username: string;
  phone: string;
  password?: string;
  refreshToken?: string;
}
