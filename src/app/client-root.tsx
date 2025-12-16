"use client";

import { Providers } from "./providers";
import ClientLayoutShell from "../components/ClientLayoutShell";
import AuthChecker from "../components/AuthChecker";

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AuthChecker>
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </AuthChecker>
    </Providers>
  );
}
