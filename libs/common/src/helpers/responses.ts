import { HttpException, HttpStatus } from "@nestjs/common";

export function formatErrorResponse(exception: HttpException) {
  const status = exception.getStatus();
  const response = exception.getResponse();
  return {
    statusCode: status,
    message: response["message"] || response,
    timestamp: new Date().toISOString(),
  };
}
