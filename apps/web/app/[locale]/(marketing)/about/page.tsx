import { Code, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-4xl space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About Us</h1>
          <p className="text-xl text-muted-foreground">
            Building the future of productivity, one feature at a time.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            We believe that great software should be simple, powerful, and accessible to everyone.
            Our mission is to provide tools that help individuals and teams achieve their goals
            without the complexity that often comes with enterprise software.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We're committed to building products that are not only functional but also delightful to
            use, with a focus on user experience, performance, and reliability.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">What We Value</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="interactive">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Security First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your data security and privacy are our top priorities. We implement industry best
                  practices to keep your information safe.
                </p>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We optimize for speed and efficiency, ensuring our applications are fast and
                  responsive, even under heavy load.
                </p>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Open Source</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We believe in transparency and contribute to open source projects that benefit the
                  developer community.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Founded with a vision to simplify complex workflows, we've grown from a small team to a
            platform trusted by thousands of users. We continue to innovate and improve, always
            listening to our community and adapting to their needs.
          </p>
        </section>
      </div>
    </div>
  );
}
