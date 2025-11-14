import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface PaymentFailedProps {
  retryUrl: string;
}

export function PaymentFailedEmail({ retryUrl }: PaymentFailedProps) {
  return (
    <Html>
      <Head />
      <Preview>Payment failed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Failed</Heading>
          <Text style={text}>
            We were unable to process your payment. Please update your payment
            method to continue your subscription.
          </Text>
          <Link href={retryUrl} style={link}>
            Update Payment Method
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#2754C5",
  fontSize: "16px",
  textDecoration: "underline",
};

