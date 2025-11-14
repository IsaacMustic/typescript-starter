import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground mt-2">
          Create an account to get started
        </p>
      </div>
      <SignupForm />
    </div>
  );
}

