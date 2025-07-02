# Authentication System Documentation

## Overview

The authentication system is built for Next.js applications using a cookie-based approach for secure token storage. It consists of three main modules:

1. `auth-client.ts` - Client-side authentication utilities
2. `auth-server.ts` - Server-side authentication utilities
3. `use-auth.ts` - React hook for authentication state management

## Core Features

- Secure cookie-based token storage
- JWT token validation
- Automatic token expiration handling
- Server-side authentication checks
- Protected route handling
- Type-safe authentication state

## Usage Guide

### Client-Side Authentication (`auth-client.ts`)

```typescript
import { getToken, setToken, removeToken, isAuthenticated } from "@/lib/auth-client";

// Check if user is authenticated
const isAuthed = isAuthenticated();

// Get the current token
const token = getToken();

// Set a new token
setToken("your.jwt.token");

// Remove token (logout)
removeToken();
```

### Server-Side Authentication (`auth-server.ts`)

```typescript
import { 
  getServerToken, 
  isServerAuthenticated, 
  requireAuth, 
  redirectIfAuthenticated 
} from "@/lib/auth-server";

// In server components or API routes:

// Get token on server side
const token = await getServerToken();

// Check authentication status
const isAuthed = await isServerAuthenticated();

// Protect routes (redirects to /sign-in if not authenticated)
await requireAuth();

// Redirect authenticated users (e.g., from login page)
await redirectIfAuthenticated();
```

### Authentication Hook (`use-auth.ts`)

```typescript
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { isAuthed, isLoading, user, logout, checkAuth } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthed) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## API Reference

### `auth-client.ts`

| Function | Description | Parameters | Return Type |
|----------|-------------|------------|-------------|
| `getToken()` | Gets the authentication token from cookie | None | `string \| null` |
| `setToken(token)` | Sets the authentication token in cookie | `token: string` | `void` |
| `removeToken()` | Removes the authentication token | None | `void` |
| `isAuthenticated()` | Checks if user is authenticated | None | `boolean` |

### `auth-server.ts`

| Function | Description | Parameters | Return Type |
|----------|-------------|------------|-------------|
| `getServerToken()` | Gets token on server-side | None | `Promise<string \| null>` |
| `isServerAuthenticated()` | Checks auth status on server | None | `Promise<boolean>` |
| `requireAuth()` | Protects routes | None | `Promise<void>` |
| `redirectIfAuthenticated()` | Redirects authed users | None | `Promise<void>` |

### `use-auth.ts`

| Property/Method | Type | Description |
|----------------|------|-------------|
| `isAuthed` | `boolean` | Current authentication status |
| `isLoading` | `boolean` | Loading state of auth check |
| `user` | `User \| null` | Current user data |
| `logout` | `() => Promise<void>` | Logout function |
| `checkAuth` | `() => Promise<void>` | Manually check auth status |

## Security Considerations

1. Cookies are set with:
   - `secure: true` - Only sent over HTTPS
   - `sameSite: strict` - Prevents CSRF attacks
   - `expires: 7 days` - Automatic expiration

2. JWT tokens are validated for:
   - Token presence
   - Token format
   - Expiration time

3. Server-side validation ensures:
   - Protected routes are secure
   - Authenticated users are redirected appropriately
   - Tokens are validated on every request

## Integration with API Layer

The authentication system integrates with the API layer (`api-client.ts`) through:

1. Automatic token injection in requests
2. Error handling for authentication failures
3. Type-safe responses
4. Proper error propagation

## Best Practices

1. Always use `useAuth` hook for client-side auth state
2. Use server-side functions in Server Components
3. Implement proper error handling
4. Keep token validation consistent
5. Use type-safe interfaces throughout
