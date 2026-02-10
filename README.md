# EST Connect — Local Setup

Minimal instructions to run the frontend (Next.js) and the PHP backend used by this project.

Prerequisites
- Node.js (16+), `pnpm` or `npm`
- PHP + Apache (XAMPP, MAMP, or native)
- MySQL / MariaDB

Quick start

1. Import database schema

   - Open phpMyAdmin or use the `mysql` CLI and run the `schema.sql` file in the project root.

2. Configure PHP environment

   - Set a `JWT_SECRET` environment variable for your Apache/PHP environment (recommended).
   - Example using `.env.example` (not loaded by PHP automatically) — see your server docs for how to set env vars.

3. Serve the `api/` folder from your webserver

   - If using XAMPP, place the project (or `api/`) inside your `htdocs` folder so the auth endpoints are reachable.
   - The project expects the API base path to be reachable at the URL you set as `NEXT_PUBLIC_API_URL`.

4. Configure frontend env

   - Copy `.env.example` and edit if needed. In particular set:

     - `NEXT_PUBLIC_API_URL` — e.g. `http://localhost/est-connect/api`

5. Start the Next.js frontend

```bash
pnpm install
pnpm dev
# or
npm install
npm run dev
```

Notes on auth and security

- The PHP endpoints now issue a JWT which is set as an httpOnly cookie named `est_connect_token`. The frontend no longer stores tokens in `localStorage` and instead sends credentials with requests (`fetch(..., { credentials: 'include' })`).
- A `POST /api/auth/logout.php` endpoint is provided to clear the cookie.
  - Use HTTPS and store tokens in secure, httpOnly cookies instead of localStorage.
  - Provide a proper secrets management solution (do not commit secrets).
  - Use a stronger JWT secret and rotate it as needed.

Files added
- `schema.sql` — SQL to create the minimal schema used by the app
- `.env.example` — example environment variables

If you'd like, I can:
- Create a `docker-compose.yml` to run PHP+MySQL and the Next frontend locally.
- Convert token storage to httpOnly cookies and update PHP to set the cookie on login/register.
