export interface MiddlewareConfig {
  logRequests?: boolean;
  logResponses?: boolean;
  excludePaths?: string[];
}

export interface CustomResponse {
  status: number;
  message: string;
  data?: any;
}
