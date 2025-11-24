export default function VerifyEmailPage({ params }: { params: { token: string } }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Verify Email</h1>
        <p className="text-muted-foreground mt-2">Verifying your email address...</p>
      </div>
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">Token: {params.token}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Email verification will be handled by Better Auth.
        </p>
      </div>
    </div>
  );
}
