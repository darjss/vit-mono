import { auth } from "./auth";

// Explicitly construct the server object to ensure proper bundling
const server = {
  auth,
};

export { server };
export default server;
