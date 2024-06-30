export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: any;
}

export function successResponse<T>(data: T, message = "Request successful"): BaseResponse<T> {
  return {
    statusCode: 200,
    message,
    data,
  };
}

export function errorResponse(message: string, error: any = null, statusCode = 400): BaseResponse<null> {
  return {
    statusCode,
    message,
    error,
  };
}
