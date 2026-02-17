export const getConfig = () => ({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  isMock: import.meta.env.VITE_MOCK_API === "true",
  paymentEmailAddress: import.meta.env.VITE_PAYMENT_ADDRESS || "kyryl.shekhanin@outlook.com",
});
