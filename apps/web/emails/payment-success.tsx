import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components";

interface PaymentSuccessProps {
  amount: number;
  currency: string;
  invoiceUrl?: string;
}

export function PaymentSuccessEmail({ amount, currency, invoiceUrl }: PaymentSuccessProps) {
  return (
    <Html>
      <Head />
      <Preview>Payment successful</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Successful</Heading>
          <Text style={text}>
            Thank you for your payment of ${(amount / 100).toFixed(2)} {currency.toUpperCase()}.
          </Text>
          {invoiceUrl && (
            <Link href={invoiceUrl} style={link}>
              View Invoice
            </Link>
          )}
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
