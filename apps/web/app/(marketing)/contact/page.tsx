import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon
            as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card variant="interactive">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Get help via email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For general inquiries, support questions, or feedback, please email us at:
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="mailto:support@example.com">support@example.com</a>
              </Button>
            </CardContent>
          </Card>

          <Card variant="interactive">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Sales Inquiries</CardTitle>
              <CardDescription>Interested in enterprise plans?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For enterprise sales, custom integrations, or partnership opportunities:
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="mailto:sales@example.com">sales@example.com</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>When can you expect to hear back?</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• General inquiries: Within 24-48 hours</li>
              <li>• Support requests: Within 12-24 hours</li>
              <li>• Sales inquiries: Within 1-2 business days</li>
              <li>• Urgent issues: Please mark as urgent in your email</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

