export class VerifyEmailRequest {
  email: string;
}

export class VerifyOTPRequest {
  email: string;
  otp: string;
}

export class RegisterUserRequest {
  otp: string;
  email: string;
  password: string;
}

export class LoginUserRequest {
  email: string;
  password: string;
}

export class LogoutUserRespon {
  id: number;
}

export class AuthResponse {
  id: number;
  email: string;
  username: string;
  role: string;
  status?: string;
  token?: string;
}
