export class AppError extends Error {
  status: number;
  retryAfterSeconds?: number;
  constructor(message: string, status = 500, retryAfterSeconds?: number) {
    super(message);
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
