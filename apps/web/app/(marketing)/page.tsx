import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="container py-24">
      <section className="text-center space-y-8 mb-24">
        <h1 className="text-5xl font-bold tracking-tight">
          Build Your Next SaaS Application
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A production-ready full-stack TypeScript starter template with
          authentication, payments, and infrastructure.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium"
          >
            Get Started
          </Link>
          <Link
            href="/pricing"
            className="border border-input px-8 py-3 rounded-md font-medium"
          >
            View Pricing
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-24">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Type-Safe</h3>
          <p className="text-muted-foreground">
            End-to-end type safety from database to frontend with TypeScript
            and tRPC.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Production Ready</h3>
          <p className="text-muted-foreground">
            Complete infrastructure setup with AWS, monitoring, and CI/CD
            pipeline.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Modern Stack</h3>
          <p className="text-muted-foreground">
            Next.js 16, React 19, Drizzle ORM, Better Auth, and Stripe
            integration.
          </p>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-8">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-8 border rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-4xl font-bold mb-4">$0</p>
            <ul className="space-y-2 text-left mb-6">
              <li>Up to 10 todos</li>
              <li>Basic support</li>
              <li>Community access</li>
            </ul>
            <Link
              href="/signup"
              className="block w-full border border-input px-4 py-2 rounded-md text-center"
            >
              Get Started
            </Link>
          </div>
          <div className="p-8 border rounded-lg border-primary">
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-4xl font-bold mb-4">$19.99</p>
            <p className="text-sm text-muted-foreground mb-4">per month</p>
            <ul className="space-y-2 text-left mb-6">
              <li>Unlimited todos</li>
              <li>Priority support</li>
              <li>Advanced analytics</li>
              <li>Export data</li>
              <li>API access</li>
            </ul>
            <Link
              href="/dashboard/billing/plans"
              className="block w-full bg-primary text-primary-foreground px-4 py-2 rounded-md text-center"
            >
              Upgrade to Pro
            </Link>
          </div>
          <div className="p-8 border rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-4xl font-bold mb-4">Custom</p>
            <ul className="space-y-2 text-left mb-6">
              <li>All Pro features</li>
              <li>Dedicated support</li>
              <li>Custom integrations</li>
              <li>SLA guarantee</li>
            </ul>
            <Link
              href="/contact"
              className="block w-full border border-input px-4 py-2 rounded-md text-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

