import { Check, Code, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8 animate-in">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
            Build Your Next <span className="text-primary">SaaS Application</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            A production-ready full-stack TypeScript starter template with authentication, payments,
            and infrastructure. Ship faster with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-base">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with modern tools and best practices for rapid development
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="interactive" className="animate-in-up">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Type-Safe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  End-to-end type safety from database to frontend with TypeScript and tRPC. Catch
                  errors at compile time, not runtime.
                </p>
              </CardContent>
            </Card>

            <Card
              variant="interactive"
              className="animate-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Production Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complete infrastructure setup with AWS, monitoring, and CI/CD pipeline. Deploy
                  with confidence.
                </p>
              </CardContent>
            </Card>

            <Card
              variant="interactive"
              className="animate-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Modern Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Next.js 16, React 19, Drizzle ORM, Better Auth, and Stripe integration. Built on
                  the latest technologies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of developers building with our starter template
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "This starter template saved me weeks of setup time. Everything I needed was
                    already configured and ready to go. Highly recommend!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold">JD</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">Full Stack Developer</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "The type safety with tRPC is incredible. I caught so many bugs before they made
                    it to production. This is how modern apps should be built."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold">SM</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sarah Miller</p>
                      <p className="text-xs text-muted-foreground">CTO, Tech Startup</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Deployment was a breeze with the Pulumi infrastructure. We went from zero to
                    production in days, not weeks. Amazing work!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold">AB</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Alex Brown</p>
                      <p className="text-xs text-muted-foreground">DevOps Engineer</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="relative">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Up to 10 todos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Basic support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Community access</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full mt-6">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$19.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Unlimited todos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Export data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">API access</span>
                  </li>
                </ul>
                <Button asChild className="w-full mt-6">
                  <Link href="/dashboard/billing/plans">Upgrade to Pro</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">All Pro features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Dedicated support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">SLA guarantee</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full mt-6">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
