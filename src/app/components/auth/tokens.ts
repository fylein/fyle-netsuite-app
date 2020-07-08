export interface User {
  email: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  user: User;
}
