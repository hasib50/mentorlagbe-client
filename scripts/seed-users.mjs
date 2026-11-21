// Creates the demo accounts through the real BetterAuth sign-up endpoint
// (so passwords are hashed correctly), then fixes roles directly in MongoDB.
//
// 1) Start the client:   npm run dev
// 2) In another terminal: npm run seed:users
// 3) Then in the server:  npm run seed

import fs from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";

// Minimal .env.local reader (no extra package needed)
const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

const BASE = (process.env.SEED_BASE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/$/, "");
const DB_NAME = process.env.MONGODB_DB_NAME || "mentorlagbe";

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing in client/.env.local");
  process.exit(1);
}

const avatar = (n) => `https://i.pravatar.cc/240?img=${n}`;

const accounts = [
  { name: "Admin User", email: "admin@mentorlagbe.com", password: "Admin@123", role: "admin", image: avatar(12), bio: "Platform administrator of MentorLagbe." },
  { name: "Nusrat Jahan", email: "tutor@mentorlagbe.com", password: "Tutor@123", role: "tutor", image: avatar(47), bio: "Mathematics teacher with 6 years of experience helping SSC and HSC students." },
  { name: "Rafiul Karim", email: "tutor2@mentorlagbe.com", password: "Tutor@123", role: "tutor", image: avatar(15), bio: "Software engineer and mentor. I teach Python and full-stack web development." },
  { name: "Tasnim Akter", email: "tutor3@mentorlagbe.com", password: "Tutor@123", role: "tutor", image: avatar(32), bio: "IELTS and spoken English trainer. Band 8.0 scorer." },
  { name: "Arif Hossain", email: "tutor4@mentorlagbe.com", password: "Tutor@123", role: "tutor", image: avatar(53), bio: "Chemistry and biology tutor for HSC and medical admission." },
  { name: "Sadia Rahman", email: "tutor5@mentorlagbe.com", password: "Tutor@123", role: "tutor", image: avatar(44), bio: "Accounting and business studies teacher, O Level and HSC." },
  { name: "Mahmudul Hasan", email: "tutor6@mentorlagbe.com", password: "Tutor@123", role: "tutor", image: avatar(60), bio: "Physics tutor who loves turning tough numericals into simple steps." },
  { name: "Ayesha Siddiqua", email: "student@mentorlagbe.com", password: "Student@123", role: "student", image: avatar(25), bio: "SSC candidate who loves maths and science." },
  { name: "Tanvir Ahmed", email: "student2@mentorlagbe.com", password: "Student@123", role: "student", image: avatar(8), bio: "HSC commerce student preparing for university admission." },
  { name: "Mim Chowdhury", email: "student3@mentorlagbe.com", password: "Student@123", role: "student", image: avatar(36), bio: "Preparing for IELTS and improving physics." },
];

async function signUp(account) {
  const response = await fetch(`${BASE}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE },
    // Everyone signs up as student/tutor here. Admin is promoted below.
    body: JSON.stringify({
      name: account.name,
      email: account.email,
      password: account.password,
      role: account.role === "tutor" ? "tutor" : "student",
    }),
  });

  if (response.ok) return "created";
  const body = await response.json().catch(() => ({}));
  const message = String(body.message || body.code || response.status);
  if (/exist/i.test(message)) return "exists";
  throw new Error(`${account.email}: ${message}`);
}

async function main() {
  console.log(`Using the client at ${BASE}`);
  try {
    await fetch(BASE, { method: "HEAD" });
  } catch {
    console.error(`Cannot reach ${BASE}. Start the client with "npm run dev" first.`);
    process.exit(1);
  }

  const client = await new MongoClient(process.env.MONGODB_URI).connect();
  const users = client.db(DB_NAME).collection("users");

  for (const account of accounts) {
    const status = await signUp(account);

    await users.updateOne(
      { email: account.email },
      {
        $set: {
          role: account.role,
          emailVerified: true,
          image: account.image,
          bio: account.bio,
          plan: "free",
        },
      }
    );
    console.log(`${status === "created" ? "Created" : "Updated"}  ${account.role.padEnd(7)} ${account.email}`);
  }

  await client.close();
  console.log("\nDone. Now run `npm run seed` inside the server folder.");
}

main().catch((error) => {
  console.error("Seeding users failed:", error.message);
  process.exit(1);
});
