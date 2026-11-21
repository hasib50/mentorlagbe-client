export type Role = "student" | "tutor" | "admin";
export type Plan = "free" | "pro";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ApplicationStatus = "pending" | "accepted" | "rejected";
export type Mode = "Online" | "Offline";

export interface TutorSummary {
  name: string;
  image: string | null;
  bio: string;
  isPro: boolean;
  joinedAt: string | null;
  tuitionCount: number;
}

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: Mode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  createdAt: string;
  tutor?: TutorSummary;
}

export type TuitionInput = Pick<
  Tuition,
  | "title"
  | "subject"
  | "classLevel"
  | "mode"
  | "location"
  | "monthlyFee"
  | "daysPerWeek"
  | "bannerImage"
  | "description"
>;

export interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  tutorName?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: ApplicationStatus;
  appliedAt: string;
  studentPlan?: Plan;
}

export interface Payment {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: Role;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}

export interface AppUser {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  plan: Plan;
  phone?: string;
  bio?: string;
  createdAt: string;
  savedTuitions?: string[];
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface PublicStats {
  tutors: number;
  students: number;
  tuitions: number;
  subjects: { subject: string; count: number }[];
}
