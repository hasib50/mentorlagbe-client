import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "@/lib/mongodb";

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB_NAME || "mentorlagbe");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

    socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // BetterAuth stores its user documents in the "users" collection
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "student", input: true },
      plan: { type: "string", required: false, defaultValue: "free", input: false },
      phone: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
    },
  },
  session: { modelName: "sessions" },
  account: { modelName: "accounts" },
  verification: { modelName: "verifications" },

  databaseHooks: {
    user: {
      create: {
        // Nobody can sign up as admin: only "student" or "tutor" is accepted,
        // and every new account starts on the free plan.
        before: async (user) => ({
          data: {
            ...user,
            role: user.role === "tutor" ? "tutor" : "student",
            plan: "free",
          },
        }),
      },
    },
  },

  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
});
