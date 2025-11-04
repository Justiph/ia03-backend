# Backend Authentication Flow and Code Walkthrough

This document explains the authentication flow and how the code implements it in the NestJS backend.

## Overview

- Access Token (short-lived): used to authorize API requests (in Authorization header).
- Refresh Token (long-lived): used to obtain new access tokens when they expire. Refresh tokens are rotated on each refresh.
- Token Revocation: `tokenVersion` stored on user model; incremented on logout to invalidate existing refresh tokens.

## Endpoints

- `POST /auth/login` → `{ email, password }` → `{ accessToken, refreshToken, user }`
- `POST /auth/refresh` → `{ refreshToken }` → `{ accessToken, refreshToken }`
- `POST /auth/logout` (Bearer access token) → `{ message }`
- `GET /auth/profile` (Bearer access token) → `{ id, email }`
- `POST /user/register` → `{ email, password }` → `{ message, user }`

## Key Files

- `src/auth/auth.service.ts` – signing/verification logic, login/refresh/logout.
- `src/auth/auth.controller.ts` – route handlers for the auth endpoints.
- `src/auth/jwt.strategy.ts` – Passport strategy using `ACCESS_TOKEN_SECRET`.
- `src/auth/jwt.guard.ts` – guard protecting routes with Bearer token.
- `src/user/user.service.ts` – password hashing and registration.

## Code Highlights

### Signing Tokens
```ts
// auth.service.ts
private signAccessToken(user: User) {
  return this.jwt.sign(
    { sub: user.id, email: user.email },
    { secret: process.env.ACCESS_TOKEN_SECRET!, expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' },
  );
}

private signRefreshToken(user: User) {
  return this.jwt.sign(
    { sub: user.id, tv: user.tokenVersion },
    { secret: process.env.REFRESH_TOKEN_SECRET!, expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' },
  );
}
```

### Login
```ts
async login(email: string, password: string) {
  const user = await this.userModel.findOne({ email });
  // verify password (bcrypt)
  const accessToken = this.signAccessToken(user);
  const refreshToken = this.signRefreshToken(user);
  return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
}
```

### Refresh (Rotation + Revocation)
```ts
async refresh(refreshToken: string) {
  const payload = this.jwt.verify<{ sub: string; tv: number }>(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET! });
  const user = await this.userModel.findById(payload.sub);
  if (user.tokenVersion !== payload.tv) throw new UnauthorizedException('Token revoked');

  const accessToken = this.signAccessToken(user);
  const newRefreshToken = this.signRefreshToken(user);
  return { accessToken, refreshToken: newRefreshToken };
}
```

### Logout (Revocation)
```ts
async logout(userId: string) {
  await this.userModel.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
  return { message: 'Logged out' };
}
```

## Security Notes

- Use strong, distinct secrets for access and refresh tokens.
- Enable HTTPS in production.
- Consider storing refresh tokens as HttpOnly cookies if you control the client origin and need higher security.
- Rate-limit `login` and `refresh` endpoints to mitigate abuse.

## Environment Variables

```
ACCESS_TOKEN_SECRET
ACCESS_TOKEN_EXPIRES (e.g., 15m)
REFRESH_TOKEN_SECRET
REFRESH_TOKEN_EXPIRES (e.g., 7d)
```


