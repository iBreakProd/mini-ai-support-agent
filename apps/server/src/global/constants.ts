export const RATE_LIMITS = {
  createOrder: { windowSeconds: 24 * 60 * 60, max: 5 },
  createProduct: { windowSeconds: 24 * 60 * 60, max: 5 },
  userQuery: { windowSeconds: 60, max: 10 },
};
