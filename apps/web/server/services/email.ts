import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";
import { EmailVerificationEmail } from "@/emails/email-verification";
import { PasswordResetEmail } from "@/emails/password-reset";
import { PaymentFailedEmail } from "@/emails/payment-failed";
import { PaymentSuccessEmail } from "@/emails/payment-success";
import { SubscriptionCanceledEmail } from "@/emails/subscription-canceled";
import { WelcomeEmail } from "@/emails/welcome";
import { env } from "@/env";

const sesClient =
  env.AWS_SES_REGION && env.AWS_SES_FROM_EMAIL
    ? new SESClient({
        region: env.AWS_SES_REGION,
      })
    : null;

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!sesClient || !env.AWS_SES_FROM_EMAIL) {
    // Fallback to console in development
    console.log("Email (dev mode):", { to, subject, html });
    return;
  }

  try {
    const command = new SendEmailCommand({
      Source: env.AWS_SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        },
      },
    });

    await sesClient.send(command);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendWelcomeEmail(name: string, email: string) {
  const html = await render(WelcomeEmail({ name }));
  await sendEmail({
    to: email,
    subject: "Welcome to TypeScript Starter!",
    html,
  });
}

export async function sendVerificationEmail(email: string, verificationUrl: string) {
  const html = await render(EmailVerificationEmail({ verificationUrl }));
  await sendEmail({
    to: email,
    subject: "Verify your email address",
    html,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const html = await render(PasswordResetEmail({ resetUrl }));
  await sendEmail({
    to: email,
    subject: "Reset your password",
    html,
  });
}

export async function sendPaymentSuccessEmail(
  email: string,
  amount: number,
  currency: string,
  invoiceUrl?: string
) {
  const html = await render(PaymentSuccessEmail({ amount, currency, invoiceUrl }));
  await sendEmail({
    to: email,
    subject: "Payment successful",
    html,
  });
}

export async function sendPaymentFailedEmail(email: string, retryUrl: string) {
  const html = await render(PaymentFailedEmail({ retryUrl }));
  await sendEmail({
    to: email,
    subject: "Payment failed",
    html,
  });
}

export async function sendSubscriptionCanceledEmail(email: string, endDate: Date) {
  const html = await render(SubscriptionCanceledEmail({ endDate }));
  await sendEmail({
    to: email,
    subject: "Subscription canceled",
    html,
  });
}
