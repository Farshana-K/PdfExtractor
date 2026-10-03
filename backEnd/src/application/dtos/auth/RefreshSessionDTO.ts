export interface RefreshSessionInputDTO {
  refreshToken: string;
}

export interface RefreshSessionOutputDTO {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}