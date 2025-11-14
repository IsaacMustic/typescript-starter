import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface SubscriptionCanceledProps {
  endDate: Date;
}

export function SubscriptionCanceledEmail({
  endDate,
}: SubscriptionCanceledProps) {
  return (
    <Html>
      <Head />
      <Preview>Subscription canceled</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Subscription Canceled</Heading>
          <Text style={text}>
            Your subscription has been canceled and will remain active until{" "}
            {endDate.toLocaleDateString()}.
          </Text>
          <Text style={text}>
            You can reactivate your subscription at any time before this date.
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

