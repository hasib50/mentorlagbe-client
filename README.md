# MentorLagbe - Smart Tuition & Mentorship Platform (Client)

MentorLagbe connects **students** with verified **tutors** for online and home tuition.
Tutors post tuition batches, admins review them, and students search, apply and track their
applications. Both students and tutors can upgrade to a **Pro plan** with Stripe.

- **Live site:** https://your-client.vercel.app  <!-- TODO: replace after deployment -->
- **Server repository:** https://github.com/your-username/mentorlagbe-server  <!-- TODO -->
- **API (live):** https://your-server.onrender.com  <!-- TODO -->

## Demo accounts

| Role    | Email                     | Password     |
|---------|---------------------------|--------------|
| Admin   | admin@mentorlagbe.com     | Admin@123    |
| Tutor   | tutor@mentorlagbe.com     | Tutor@123    |
| Student | student@mentorlagbe.com   | Student@123  |

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Key features

- **Role based platform:** Student, Tutor and Admin each get their own dashboard.
- **BetterAuth + MongoDB** email/password authentication with role selection at sign up and a JWT sent to the API.
- **Browse Tuitions** with server-side search, filters (subject, class level, mode), sorting and **pagination**.
- **Apply flow** for students only, with duplicate-application protection and cancel while pending.
- **Tutor tools:** post tuitions (ImgBB banner upload), edit, delete, open/close, manage applicants. Free tutors can post 2 tuitions, Pro tutors unlimited.
- **Admin tools:** approve or reject tuitions, manage user roles, view Stripe revenue and transactions.
- **Stripe Checkout** for the Pro plan (Tutor $15, Student $10). The user's plan updates automatically and the payment is saved.
- **Bookmarks:** students can save favourite tuitions.
- **Dark / light theme**, responsive layout, skeleton loaders, custom 404 and error pages, toast notifications.

## Tech stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, daisyUI 5, BetterAuth,
MongoDB, Framer Motion, Axios, jose, react-hot-toast, lucide-react.

## npm packages used

| Package | Why |
|---|---|
| `next`, `react`, `react-dom` | Framework |
| `tailwindcss`, `@tailwindcss/postcss`, `daisyui` | Styling and UI components |
| `better-auth` | Authentication (MongoDB adapter) |
| `mongodb` | Database driver used by BetterAuth |
| `jose` | Signs the JWT sent to the Express API |
| `axios` | API requests with the JWT interceptor |
| `framer-motion` | Animations |
| `react-hot-toast` | Toast notifications |
| `lucide-react` | Icons |

## Run locally

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
```

Create the demo accounts (client must be running):

```bash
npm run seed:users
```

Then run `npm run seed` in the **server** project to add tuitions, applications and payments.

## Environment variables (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the Express server |
| `BETTER_AUTH_URL` | URL of this client |
| `BETTER_AUTH_SECRET` | Long random string |
| `MONGODB_URI`, `MONGODB_DB_NAME` | MongoDB connection (same database as the server) |
| `JWT_SECRET` | Must match the server's `JWT_SECRET` |
| `IMGBB_API_KEY` | ImgBB key (used only on the server side by `/api/upload`) |

## Project structure

```
src/app/(site)      public pages: home, tuitions, pricing, about, sign-in, sign-up, payment
src/app/dashboard   role based dashboards (student, tutor, admin) and profile
src/app/api         BetterAuth, /api/token (JWT) and /api/upload (ImgBB)
src/components      UI, home sections, tuition components, dashboard shell
src/lib             auth, api client, helpers
```
