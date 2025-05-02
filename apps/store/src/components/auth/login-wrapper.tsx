import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginComponent from "./login-component";

const LoginWrapper = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <LoginComponent />
    </QueryClientProvider>
  );
};
export default LoginWrapper;
