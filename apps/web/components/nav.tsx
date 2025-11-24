import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          TypeScript Starter
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium">
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
