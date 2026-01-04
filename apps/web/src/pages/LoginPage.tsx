import { AppShell } from "@/components/layout/AppShell";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginPage() {
  return (
    <AppShell>
      <main className="lg:pl-20 min-h-screen bg-grid-pattern flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </AppShell>
  );
}
