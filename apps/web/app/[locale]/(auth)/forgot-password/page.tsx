export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email to receive a password reset link
        </p>
      </div>
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">
          Password reset functionality will be implemented with Better Auth.
        </p>
      </div>
    </div>
  );
}
