import { AppShell } from "@/components/layout/AppShell";
import { SignupForm } from "@/components/auth/SignupForm";

export function SignupPage() {
  return (
    <AppShell>
      <main className="lg:pl-20 min-h-screen bg-grid-pattern flex items-center justify-center pt-24 pb-4 px-4 lg:pt-4">
        <SignupForm />
      </main>
    </AppShell>
  );
}
