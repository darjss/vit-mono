import { api } from "./trpc";

export const auth = async () => {
  const session = await api.customer.me.query();
  return session;
};