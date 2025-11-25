export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-2">Enter your new password</p>
      </div>
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">Token: {params.token}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Password reset form will be implemented with Better Auth.
        </p>
      </div>
    </div>
  );
}
