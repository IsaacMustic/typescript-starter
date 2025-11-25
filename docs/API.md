# API Documentation

This document describes all tRPC procedures available in the application. The API uses [tRPC](https://trpc.io/) for end-to-end type safety.

## Table of Contents

- [Authentication](#authentication)
- [Error Codes](#error-codes)
- [Auth Router](#auth-router)
- [User Router](#user-router)
- [Todo Router](#todo-router)
- [Billing Router](#billing-router)
- [Usage Examples](#usage-examples)

## Authentication

All protected procedures require authentication. Unauthenticated requests will return a `UNAUTHORIZED` error.

### Client Setup

```typescript
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/trpc/root";

export const trpc = createTRPCReact<AppRouter>();

// In your component or provider
const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});
```

### Using in Components

```typescript
import { trpc } from "@/lib/trpc";

function MyComponent() {
  const { data, isLoading } = trpc.user.getProfile.useQuery();
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{data?.name}</div>;
}
```

## Error Codes

The API uses standard HTTP status codes and custom error codes:

| Code | HTTP Status | Description |
|------|------------|-------------|
| `UNAUTHORIZED` | 401 | User is not authenticated |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid input or validation error |
| `CONFLICT` | 409 | Resource conflict (e.g., email already in use) |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

### Error Response Format

```typescript
{
  error: {
    code: "BAD_REQUEST",
    message: "Invalid email address",
    // Additional error details may be included
  }
}
```

## Auth Router

### `auth.getSession`

Get the current user session and user information.

**Type:** Query  
**Auth:** Required

**Response:**
```typescript
{
  user: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: boolean;
  } | null;
  session: Session | null;
}
```

**Example:**
```typescript
const { data } = trpc.auth.getSession.useQuery();
if (data?.user) {
  console.log(`Logged in as ${data.user.email}`);
}
```

### `auth.signOut`

Sign out the current user.

**Type:** Mutation  
**Auth:** Required

**Response:**
```typescript
{
  success: boolean;
}
```

### `auth.sendWelcomeEmail`

Send welcome email to a newly signed up user.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  name: string;  // User's display name
  email: string; // User's email address
}
```

**Response:**
```typescript
{
  success: boolean;
  error?: string; // Error message if sending failed
}
```

**Example:**
```typescript
const sendWelcome = trpc.auth.sendWelcomeEmail.useMutation();

await sendWelcome.mutateAsync({
  name: "John Doe",
  email: "john@example.com",
});
```

**Errors:**
- `BAD_REQUEST` - Invalid email address or name
- `INTERNAL_SERVER_ERROR` - Email service unavailable

## User Router

### `user.getProfile`

Get the current user's profile information.

**Type:** Query  
**Auth:** Required

**Response:**
```typescript
{
  id: string;
  email: string;
  name: string | null;
  image: string | null; // Profile image URL
  emailVerified: boolean;
  stripeCustomerId: string | null; // Stripe customer ID if exists
  createdAt: Date;
  updatedAt: Date;
}
```

**Example:**
```typescript
const { data: profile } = trpc.user.getProfile.useQuery();
// profile contains full user information
```

### `user.updateProfile`

Update the current user's profile information.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  name?: string;  // Display name (min 2 characters)
  image?: string; // Profile image URL (must be valid URL)
}
```

**Response:** Updated user object (same format as `getProfile`)

**Example:**
```typescript
const updateProfile = trpc.user.updateProfile.useMutation();

await updateProfile.mutateAsync({
  name: "Jane Doe",
  image: "https://example.com/avatar.jpg",
});
```

**Errors:**
- `BAD_REQUEST` - Invalid name length or invalid URL format

### `user.changeEmail`

Request an email change. Sends a verification email to the new address.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  email: string; // valid email address
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Errors:**
- `CONFLICT` - Email is already in use
- `BAD_REQUEST` - New email is same as current email

### `user.verifyEmailChange`

Verify and complete email change using verification token.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  token: string;
  email: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  user: User;
  message: string;
}
```

**Errors:**
- `NOT_FOUND` - Invalid verification token
- `BAD_REQUEST` - Token expired or invalid
- `CONFLICT` - Email is already in use

### `user.deleteAccount`

Delete the current user's account.

**Type:** Mutation  
**Auth:** Required

**Response:**
```typescript
{
  success: boolean;
}
```

## Todo Router

### `todo.getAll`

Get all todos for the current user with pagination and filtering.

**Type:** Query  
**Auth:** Required

**Input:**
```typescript
{
  limit?: number;      // 1-100, default: 50
  offset?: number;     // default: 0
  completed?: boolean; // filter by completion status
}
```

**Response:**
```typescript
{
  todos: Array<{
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;    // Total number of todos matching filter
  limit: number;    // Applied limit
  offset: number;   // Applied offset
}
```

**Example:**
```typescript
// Get all incomplete todos
const { data } = trpc.todo.getAll.useQuery({
  completed: false,
  limit: 20,
});

// Get completed todos with pagination
const { data: completed } = trpc.todo.getAll.useQuery({
  completed: true,
  limit: 10,
  offset: 0,
});
```

**Errors:**
- `BAD_REQUEST` - Invalid limit (must be 1-100) or offset

### `todo.getById`

Get a single todo by ID. Users can only access their own todos.

**Type:** Query  
**Auth:** Required

**Input:**
```typescript
{
  id: string; // UUID of the todo
}
```

**Response:** Todo object (same format as in `getAll`)

**Example:**
```typescript
const { data: todo } = trpc.todo.getById.useQuery({
  id: "123e4567-e89b-12d3-a456-426614174000",
});
```

**Errors:**
- `NOT_FOUND` - Todo not found or doesn't belong to user
- `BAD_REQUEST` - Invalid UUID format

### `todo.create`

Create a new todo. Free plan users are limited to 10 todos.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  title: string;        // Todo title (min 1 character, required)
  description?: string; // Optional description
}
```

**Response:** Created todo object

**Example:**
```typescript
const createTodo = trpc.todo.create.useMutation();

const newTodo = await createTodo.mutateAsync({
  title: "Complete project documentation",
  description: "Update README and API docs",
});
```

**Errors:**
- `BAD_REQUEST` - Title is empty or too long
- `FORBIDDEN` - Free plan limit reached (10 todos). Upgrade to create more.

### `todo.update`

Update an existing todo.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  id: string; // UUID
  title?: string;
  description?: string;
}
```

**Response:** Updated todo object

**Errors:**
- `NOT_FOUND` - Todo not found

### `todo.delete`

Delete a todo.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  id: string; // UUID
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

**Errors:**
- `NOT_FOUND` - Todo not found

### `todo.toggleComplete`

Toggle the completion status of a todo.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  id: string; // UUID
}
```

**Response:** Updated todo object

**Errors:**
- `NOT_FOUND` - Todo not found

### `todo.deleteCompleted`

Delete all completed todos for the current user.

**Type:** Mutation  
**Auth:** Required

**Response:**
```typescript
{
  success: boolean;
  deletedCount: number;
}
```

## Billing Router

### `billing.getSubscription`

Get the current user's subscription information.

**Type:** Query  
**Auth:** Required

**Response:**
```typescript
{
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  planId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
} | null
```

**Example:**
```typescript
const { data: subscription } = trpc.billing.getSubscription.useQuery();

if (subscription?.status === "active") {
  console.log("User has active subscription");
}
```

### `billing.getPlans`

Get all available subscription plans. This endpoint is public and doesn't require authentication.

**Type:** Query  
**Auth:** Not required

**Response:**
```typescript
Array<{
  id: string;
  name: string;
  description: string | null;
  price: number;        // Price in cents
  currency: string;     // e.g., "usd"
  interval: "month" | "year";
  features: string[];  // List of plan features
  stripePriceId: string;
  stripeProductId: string;
}>
```

**Example:**
```typescript
const { data: plans } = trpc.billing.getPlans.useQuery();

plans?.forEach(plan => {
  console.log(`${plan.name}: $${plan.price / 100}/${plan.interval}`);
});
```

### `billing.createCheckoutSession`

Create a Stripe Checkout session for subscription. Redirects user to Stripe checkout.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  priceId: string; // Stripe price ID (e.g., "price_1234567890")
}
```

**Response:**
```typescript
{
  url: string; // Stripe Checkout URL - redirect user here
}
```

**Example:**
```typescript
const createCheckout = trpc.billing.createCheckoutSession.useMutation();

const { url } = await createCheckout.mutateAsync({
  priceId: "price_1234567890",
});

// Redirect user to Stripe checkout
window.location.href = url;
```

**Errors:**
- `BAD_REQUEST` - Invalid price ID or price not found
- `CONFLICT` - User already has an active subscription

### `billing.createPortalSession`

Create a Stripe Customer Portal session.

**Type:** Mutation  
**Auth:** Required

**Response:**
```typescript
{
  url: string; // Portal URL
}
```

**Errors:**
- `BAD_REQUEST` - No Stripe customer found

### `billing.getInvoices`

Get invoice history for the current user.

**Type:** Query  
**Auth:** Required

**Response:** Array of invoice objects

### `billing.getUsage`

Get usage statistics for the current user. Useful for displaying plan limits and current usage.

**Type:** Query  
**Auth:** Required

**Response:**
```typescript
{
  todos: number;        // Current number of todos
  todosLimit: number;   // Maximum todos allowed (based on plan)
  // Additional usage metrics can be added here
}
```

**Example:**
```typescript
const { data: usage } = trpc.billing.getUsage.useQuery();

if (usage) {
  console.log(`Using ${usage.todos} of ${usage.todosLimit} todos`);
  const percentage = (usage.todos / usage.todosLimit) * 100;
}
```

---

## Usage Examples

### Complete Authentication Flow

```typescript
// 1. Check if user is authenticated
const { data: session } = trpc.auth.getSession.useQuery();

if (!session?.user) {
  // Redirect to login
  return <LoginPage />;
}

// 2. Get user profile
const { data: profile } = trpc.user.getProfile.useQuery();

// 3. Sign out
const signOut = trpc.auth.signOut.useMutation();
await signOut.mutateAsync();
```

### Todo Management Flow

```typescript
// Get all todos
const { data, refetch } = trpc.todo.getAll.useQuery({
  completed: false,
});

// Create todo
const createTodo = trpc.todo.create.useMutation({
  onSuccess: () => {
    refetch(); // Refresh list
  },
});

// Toggle completion
const toggleTodo = trpc.todo.toggleComplete.useMutation({
  onSuccess: () => {
    refetch();
  },
});

// Delete todo
const deleteTodo = trpc.todo.delete.useMutation({
  onSuccess: () => {
    refetch();
  },
});
```

### Subscription Flow

```typescript
// 1. Get available plans
const { data: plans } = trpc.billing.getPlans.useQuery();

// 2. Get current subscription
const { data: subscription } = trpc.billing.getSubscription.useQuery();

// 3. Create checkout session
const createCheckout = trpc.billing.createCheckoutSession.useMutation();

const handleSubscribe = async (priceId: string) => {
  const { url } = await createCheckout.mutateAsync({ priceId });
  window.location.href = url;
};

// 4. Manage subscription (via Stripe Customer Portal)
const createPortal = trpc.billing.createPortalSession.useMutation();

const handleManageSubscription = async () => {
  const { url } = await createPortal.mutateAsync();
  window.location.href = url;
};
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse. Rate limits are applied per user/IP address:

- **Authentication endpoints**: 5 requests per minute
- **User endpoints**: 30 requests per minute
- **Todo endpoints**: 60 requests per minute
- **Billing endpoints**: 10 requests per minute

Rate limit exceeded errors return `TOO_MANY_REQUESTS` with a `Retry-After` header indicating when to retry.

---

## Type Safety

All tRPC procedures are fully type-safe. TypeScript will autocomplete and validate:

- Procedure names
- Input parameters
- Response types
- Error types

Import types from your tRPC router:

```typescript
import type { AppRouter } from "@/server/trpc/root";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

// Use types
type TodoInput = RouterInputs["todo"]["create"];
type TodoOutput = RouterOutputs["todo"]["getAll"];
```

