# API Documentation

This document describes all tRPC procedures available in the application.

## Authentication

All protected procedures require authentication. Unauthenticated requests will return a `UNAUTHORIZED` error.

## Error Codes

- `UNAUTHORIZED` - User is not authenticated
- `FORBIDDEN` - User doesn't have permission
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid input
- `CONFLICT` - Resource conflict (e.g., email already in use)
- `TOO_MANY_REQUESTS` - Rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Server error

## Auth Router

### `auth.getSession`

Get the current user session.

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
  name: string;
  email: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  error?: string;
}
```

## User Router

### `user.getProfile`

Get the current user's profile.

**Type:** Query  
**Auth:** Required

**Response:**
```typescript
{
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  stripeCustomerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### `user.updateProfile`

Update the current user's profile.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  name?: string; // min 2 characters
  image?: string; // valid URL
}
```

**Response:** Updated user object

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
  limit?: number; // 1-100, default: 50
  offset?: number; // default: 0
  completed?: boolean; // filter by completion status
}
```

**Response:**
```typescript
{
  todos: Todo[];
  total: number;
  limit: number;
  offset: number;
}
```

### `todo.getById`

Get a single todo by ID.

**Type:** Query  
**Auth:** Required

**Input:**
```typescript
{
  id: string; // UUID
}
```

**Response:** Todo object

**Errors:**
- `NOT_FOUND` - Todo not found

### `todo.create`

Create a new todo.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  title: string; // min 1 character
  description?: string;
}
```

**Response:** Created todo object

**Errors:**
- `FORBIDDEN` - Free plan limit reached (10 todos)

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

Get the current user's subscription.

**Type:** Query  
**Auth:** Required

**Response:** Subscription object or null

### `billing.getPlans`

Get all available subscription plans.

**Type:** Query  
**Auth:** Not required

**Response:** Array of product/plan objects

### `billing.createCheckoutSession`

Create a Stripe Checkout session for subscription.

**Type:** Mutation  
**Auth:** Required

**Input:**
```typescript
{
  priceId: string; // Stripe price ID
}
```

**Response:**
```typescript
{
  url: string; // Checkout URL
}
```

**Errors:**
- `BAD_REQUEST` - Invalid price ID

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

Get usage statistics for the current user.

**Type:** Query  
**Auth:** Required

**Response:**
```typescript
{
  todos: number;
  // Add more usage metrics as needed
}
```

