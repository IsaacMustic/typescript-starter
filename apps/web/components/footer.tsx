export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container py-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TypeScript Starter. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
