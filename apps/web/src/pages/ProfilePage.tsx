import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileForm } from "@/components/profile/ProfileForm";

export function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <main className="lg:pl-20 min-h-screen bg-grid-pattern flex items-center justify-center p-4">
          <ProfileForm />
        </main>
      </AppShell>
    </ProtectedRoute>
  );
}
