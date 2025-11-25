import {
  ConfigurationSetDoesNotExistException,
  MailFromDomainNotVerifiedException,
  MessageRejected,
  SESClient,
  SendEmailCommand,
} from "@aws-sdk/client-ses";
import { render } from "@react-email/render";
import { EmailVerificationEmail } from "@/emails/email-verification";
import { PasswordResetEmail } from "@/emails/password-reset";
import { PaymentFailedEmail } from "@/emails/payment-failed";
import { PaymentSuccessEmail } from "@/emails/payment-success";
import { SubscriptionCanceledEmail } from "@/emails/subscription-canceled";
import { WelcomeEmail } from "@/emails/welcome";
import { env } from "@/env";
import { logger } from "@/lib/logger";

const sesClient =
  env.AWS_SES_REGION && env.AWS_SES_FROM_EMAIL
    ? new SESClient({
        region: env.AWS_SES_REGION,
      })
    : null;

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send email with retry logic and improved error handling
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - Email HTML content
 * @param isCritical - Whether email failure should throw (default: false)
 * @returns Promise that resolves when email is sent or fails
 */
async function sendEmail({
  to,
  subject,
  html,
  isCritical = false,
}: {
  to: string;
  subject: string;
  html: string;
  isCritical?: boolean;
}): Promise<void> {
  if (!sesClient || !env.AWS_SES_FROM_EMAIL) {
    // Fallback to console in development
    logger.info({
      message: "Email (dev mode)",
      to,
      subject,
      htmlLength: html.length,
    });
    return;
  }

  const maxRetries = 3;
  const retryDelays = [1000, 2000, 4000]; // Exponential backoff: 1s, 2s, 4s

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
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

      logger.info({
        message: "Email sent successfully",
        to,
        subject,
        attempt: attempt + 1,
      });

      return; // Success, exit retry loop
    } catch (error) {
      const errorName = error instanceof Error ? error.name : "Unknown";
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Log error with context
      logger.error({
        message: "Error sending email",
        to,
        subject,
        attempt: attempt + 1,
        errorName,
        errorMessage,
      });

      // Handle specific AWS SES errors
      if (error instanceof MessageRejected) {
        // Permanent failure - don't retry
        logger.error({
          message: "Email rejected by SES (permanent failure)",
          to,
          subject,
          reason: errorMessage,
        });
        if (isCritical) {
          throw new Error(`Email rejected: ${errorMessage}`);
        }
        return; // Don't retry permanent failures
      }

      if (
        error instanceof MailFromDomainNotVerifiedException ||
        error instanceof ConfigurationSetDoesNotExistException
      ) {
        // Configuration error - don't retry
        logger.error({
          message: "SES configuration error",
          to,
          subject,
          error: errorMessage,
        });
        if (isCritical) {
          throw new Error(`SES configuration error: ${errorMessage}`);
        }
        return;
      }

      // For other errors, retry if we have attempts left
      if (attempt < maxRetries) {
        const delay = retryDelays[attempt] ?? 4000;
        logger.warn({
          message: "Retrying email send",
          to,
          subject,
          attempt: attempt + 1,
          maxRetries,
          delayMs: delay,
        });
        await sleep(delay);
        continue;
      }

      // Final attempt failed
      logger.error({
        message: "Email send failed after all retries",
        to,
        subject,
        totalAttempts: maxRetries + 1,
        errorName,
        errorMessage,
      });

      if (isCritical) {
        throw new Error(`Failed to send email after ${maxRetries + 1} attempts: ${errorMessage}`);
      }

      // For non-critical emails, log but don't throw
      return;
    }
  }
}

/**
 * Send welcome email to new user
 * Non-critical - failures won't block signup
 */
export async function sendWelcomeEmail(name: string, email: string): Promise<void> {
  const html = await render(WelcomeEmail({ name }));
  await sendEmail({
    to: email,
    subject: "Welcome to TypeScript Starter!",
    html,
    isCritical: false,
  });
}

/**
 * Send email verification link
 * Critical - user needs this to verify their email
 */
export async function sendVerificationEmail(email: string, verificationUrl: string): Promise<void> {
  const html = await render(EmailVerificationEmail({ verificationUrl }));
  await sendEmail({
    to: email,
    subject: "Verify your email address",
    html,
    isCritical: true,
  });
}

/**
 * Send password reset link
 * Critical - user needs this to reset their password
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const html = await render(PasswordResetEmail({ resetUrl }));
  await sendEmail({
    to: email,
    subject: "Reset your password",
    html,
    isCritical: true,
  });
}

/**
 * Send payment success notification
 * Non-critical - payment already succeeded
 */
export async function sendPaymentSuccessEmail(
  email: string,
  amount: number,
  currency: string,
  invoiceUrl?: string
): Promise<void> {
  const html = await render(PaymentSuccessEmail({ amount, currency, invoiceUrl }));
  await sendEmail({
    to: email,
    subject: "Payment successful",
    html,
    isCritical: false,
  });
}

/**
 * Send payment failed notification
 * Important - user should be notified, but not critical
 */
export async function sendPaymentFailedEmail(email: string, retryUrl: string): Promise<void> {
  const html = await render(PaymentFailedEmail({ retryUrl }));
  await sendEmail({
    to: email,
    subject: "Payment failed",
    html,
    isCritical: false,
  });
}

/**
 * Send subscription canceled notification
 * Non-critical - cancellation already processed
 */
export async function sendSubscriptionCanceledEmail(email: string, endDate: Date): Promise<void> {
  const html = await render(SubscriptionCanceledEmail({ endDate }));
  await sendEmail({
    to: email,
    subject: "Subscription canceled",
    html,
    isCritical: false,
  });
}
