import AuthForm from "@/components/Auth/AuthForm";
import { LoaderProvider } from "@/contexts/LoaderContext";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login",
};

export default function SignIn() {
  return (
    <LoaderProvider>
      <AuthForm type="login" />
    </LoaderProvider>
  );
}
