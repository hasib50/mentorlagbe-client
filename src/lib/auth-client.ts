import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false },
        plan: { type: "string", required: false, input: false },
        phone: { type: "string", required: false },
        bio: { type: "string", required: false },
      },
    }),
  ],
});
