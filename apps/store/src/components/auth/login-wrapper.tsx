import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import LoginComponent from "./login-component";

const LoginWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginComponent />
    </QueryClientProvider>
  );
};

export default LoginWrapper;
