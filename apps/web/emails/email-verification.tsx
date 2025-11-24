import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components";

interface EmailVerificationProps {
  verificationUrl: string;
}

export function EmailVerificationEmail({ verificationUrl }: EmailVerificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify your email</Heading>
          <Text style={text}>Please click the link below to verify your email address.</Text>
          <Link href={verificationUrl} style={link}>
            Verify Email
          </Link>
          <Text style={text}>
            If you didn't create an account, you can safely ignore this email.
          </Text>
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
