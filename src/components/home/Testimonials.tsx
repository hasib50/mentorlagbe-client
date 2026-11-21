"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

const items = [
  {
    name: "Ayesha Siddiqua",
    role: "SSC student, Dhaka",
    text: "I applied to three batches in one evening and got accepted the next day. My maths marks have already improved.",
  },
  {
    name: "Rafiul Karim",
    role: "Programming mentor",
    text: "Posting my batch took five minutes. The applicant dashboard makes it easy to pick serious students.",
  },
  {
    name: "Mrs. Rahman",
    role: "Parent, Chattogram",
    text: "Verified tutors, clear fees and a simple process. We found an accounting teacher near home without any hassle.",
  },
];

export default function Testimonials() {
  return (
    <section className="container-x py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-eyebrow">Testimonials</p>
        <h2 className="section-title mt-3">Loved by students and tutors</h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.figure
            key={item.name}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="surface card-lift flex h-full flex-col p-7"
          >
            <Quote size={30} className="text-primary/70" />
            <blockquote className="mt-4 flex-1 text-[15px] leading-7">{item.text}</blockquote>
            <div className="mt-5 flex gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-current" />
              ))}
            </div>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-base-300 pt-5">
              <Avatar name={item.name} className="size-11" />
              <div>
                <p className="text-sm font-extrabold">{item.name}</p>
                <p className="text-xs text-base-content/60">{item.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
