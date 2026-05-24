# EdgeOne Pages Deployment

This project can be deployed to Tencent Cloud EdgeOne Pages as a Next.js app.

## Build command

```bash
npm run build
```

The build script is pinned to webpack to avoid Turbopack-related build issues in CI.

## Environment variables

Reuse the existing production database to keep all users and plans intact.

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `DATABASE_URL` if your auth/database layer still expects it

## Data safety

Do not create a fresh database for the deployment. Point EdgeOne at the existing production database so the current users, plans, sessions, and answers remain unchanged.

## Deployment notes

- Connect the GitHub repository in EdgeOne Pages.
- Use the repository root as the project directory.
- Set the build command to `npm run build`.
- Keep the current production database credentials unchanged.
