import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { XIcon } from "@/components/ui/SocialIcons";

const socials = [
  { label: "X", href: "https://x.com", icon: <XIcon size={17} /> },
  { label: "Facebook", href: "https://facebook.com", icon: <Facebook size={17} /> },
  { label: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin size={17} /> },
  { label: "Instagram", href: "https://instagram.com", icon: <Instagram size={17} /> },
  { label: "YouTube", href: "https://youtube.com", icon: <Youtube size={17} /> },
];

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          {/* The logo keeps its normal colours on the dark footer */}
          <div className="[&_span.font-display]:text-white">
            <Logo />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-7 text-neutral-content/70">
            Find verified tutors by subject, class level and budget. Learn online or at home, with
            mentors who care about your results.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-primary hover:text-white"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Explore</h4>
          <ul className="mt-4 space-y-3 text-sm text-neutral-content/70">
            <li><Link className="hover:text-accent" href="/">Home</Link></li>
            <li><Link className="hover:text-accent" href="/tuitions">Browse Tuitions</Link></li>
            <li><Link className="hover:text-accent" href="/pricing">Pricing &amp; Pro Plans</Link></li>
            <li><Link className="hover:text-accent" href="/about">How It Works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Get Started</h4>
          <ul className="mt-4 space-y-3 text-sm text-neutral-content/70">
            <li><Link className="hover:text-accent" href="/sign-up">Join as a Student</Link></li>
            <li><Link className="hover:text-accent" href="/sign-up?role=tutor">Become a Tutor</Link></li>
            <li><Link className="hover:text-accent" href="/sign-in">Sign In</Link></li>
            <li><Link className="hover:text-accent" href="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-neutral-content/70">
            <li className="flex items-start gap-3"><Mail size={17} className="mt-0.5 shrink-0 text-accent" /> hello@mentorlagbe.com</li>
            <li className="flex items-start gap-3"><Phone size={17} className="mt-0.5 shrink-0 text-accent" /> +880 1700-000000</li>
            <li className="flex items-start gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-accent" /> Dhanmondi, Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-neutral-content/60 sm:flex-row">
          <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
          <p>Smart tuition &amp; mentorship platform</p>
        </div>
      </div>
    </footer>
  );
}
