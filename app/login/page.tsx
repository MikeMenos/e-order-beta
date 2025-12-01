import { LoginCard } from "@/components/login-card";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center dark:bg-black px-4">
      <main className="w-full max-w-md">
        <LoginCard />
      </main>
    </div>
  );
}
