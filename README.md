# MentorLagbe - Smart Tuition & Mentorship Platform

MentorLagbe is a full-stack, role-based tuition platform. **Students** find verified tutors by subject,
class level, mode and budget. **Tutors** post tuition batches and manage applicants. **Admins** moderate
tuition posts and users and track Stripe revenue. Students and tutors can upgrade to a **Pro plan** with Stripe.

**Purpose:** students and parents struggle to find trusted tutors, and good tutors lack a simple place to
showcase their batches. MentorLagbe solves both problems in one place.

## Live links

| | Link |
|---|---|
| Live site | https://mentorlagbe-client-azure.vercel.app |
| Live API | https://mentorlagbe-server-beta.vercel.app |
| Client repository | https://github.com/hasib50/mentorlagbe-client |
| Server repository | https://github.com/hasib50/mentorlagbe-server |

## Admin and demo credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@mentorlagbe.com | Admin@123 |
| **Tutor** | tutor@mentorlagbe.com | Tutor@123 |
| **Student** | student@mentorlagbe.com | Student@123 |

**Stripe test card:** `4242 4242 4242 4242`, any future expiry date, any CVC.

## Key features

- **Three roles** (Student, Tutor, Admin), each with its own responsive dashboard and a collapsible sidebar.
- **Authentication** with BetterAuth and the MongoDB adapter. Users choose Student or Tutor at sign up, and a JWT is sent to every protected API request.
- **Browse Tuitions** with server-side search (title or subject), filters (subject, class level, mode), sorting and pagination.
- **Tuition details and apply flow.** Only students can apply, duplicate applications are blocked, and a pending application can be cancelled.
- **Tutor tools:** post tuitions with a banner uploaded to ImgBB, edit, delete, open or close a post, and accept or reject applicants. Free tutors can post 2 tuitions, Pro tutors unlimited.
- **Admin tools:** approve or reject tuition posts, change user roles, and view all Stripe transactions and revenue.
- **Stripe Checkout** for the Pro plan (Tutor $15, Student $10). The plan upgrades automatically and the payment is saved in the database.
- **Saved tuitions** (bookmarks) for students.
- **Dark and light theme**, skeleton loaders, custom 404 and error pages, toast notifications on every action.
- **Fully responsive** on mobile, tablet and desktop.

## Tech stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, daisyUI 5, BetterAuth, MongoDB,
Express.js (separate server repository), JWT, Stripe, ImgBB.

## npm packages used

| Package | Purpose |
|---|---|
| `next`, `react`, `react-dom` | Framework |
| `typescript`, `eslint`, `eslint-config-next` | Type checking and linting |
| `tailwindcss`, `@tailwindcss/postcss`, `daisyui` | Styling and UI components |
| `better-auth` | Authentication with the MongoDB adapter |
| `mongodb` | Database driver used by BetterAuth |
| `jose` | Creates the JWT sent to the API |
| `axios` | API requests with an automatic JWT header |
| `framer-motion` | Animations |
| `react-hot-toast` | Toast notifications |
| `lucide-react` | Icons |

## Run locally

```bash
git clone https://github.com/hasib50/mentorlagbe-client.git
cd mentorlagbe-client
npm install
cp .env.example .env.local   # fill in the values below
npm run dev                  # http://localhost:3000
```

The API must also be running. See the server repository for its setup.

## Environment variables (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the Express server |
| `BETTER_AUTH_URL` | URL of this client |
| `BETTER_AUTH_SECRET` | Long random string |
| `MONGODB_URI`, `MONGODB_DB_NAME` | MongoDB connection (same database as the server) |
| `JWT_SECRET` | Must be identical to the server's `JWT_SECRET` |
| `IMGBB_API_KEY` | ImgBB API key, used only on the server side |

## Folder structure

```
src/app/(site)      public pages: home, tuitions, pricing, about, sign-in, sign-up, payment
src/app/dashboard   student, tutor and admin dashboards and the profile page
src/app/api         BetterAuth, JWT token and ImgBB upload routes
src/components      UI, home sections, tuition components and the dashboard shell
src/lib             auth, API client and helpers
```