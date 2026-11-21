import type { Plan, Role } from "@/types";

export const CLASS_LEVELS = [
  "Class 1-5",
  "Class 6-8",
  "Class 9-10",
  "SSC",
  "HSC",
  "O Level",
  "A Level",
  "Admission Prep",
  "University",
  "Professional",
];

export const MODES = ["Online", "Offline"] as const;
export const FREE_TUITION_LIMIT = 2;

export const SUBJECT_SUGGESTIONS = [
  "Mathematics",
  "Higher Math",
  "Physics",
  "Chemistry",
  "Biology",
  "Programming",
  "ICT",
  "IELTS",
  "English",
  "Accounting",
  "Business",
  "Economics",
];

export const PRICING: Record<
  Exclude<Role, "admin">,
  Record<Plan, { name: string; price: number; tagline: string; features: string[] }>
> = {
  student: {
    free: {
      name: "Free",
      price: 0,
      tagline: "Everything you need to find a tutor",
      features: [
        "Search and filter all approved tuitions",
        "Apply to any tuition batch",
        "Track application status live",
        "Save favourite tuitions",
      ],
    },
    pro: {
      name: "Pro Student",
      price: 10,
      tagline: "Get noticed first by tutors",
      features: [
        "Everything in Free",
        "Priority booking: Pro badge on every application",
        "Your applications appear first for tutors",
        "Priority support",
      ],
    },
  },
  tutor: {
    free: {
      name: "Free",
      price: 0,
      tagline: "Start teaching on MentorLagbe",
      features: [
        "Post up to 2 tuition batches",
        "Manage student applicants",
        "Tutor profile page",
        "Edit, close or delete posts anytime",
      ],
    },
    pro: {
      name: "Pro Tutor",
      price: 15,
      tagline: "Grow without limits",
      features: [
        "Everything in Free",
        "Unlimited tuition posts",
        "Verified tutor badge on your profile",
        "Priority support",
      ],
    },
  },
};
