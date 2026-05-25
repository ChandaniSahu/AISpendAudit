"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    setIsSubmitting(true);

    try {
      // Store email in Firebase
      await addDoc(collection(db, "waitlist"), {
        email: email,
        source: "cta_section",
        createdAt: new Date().toISOString(),
      });

      setEmail("");
      setToastMessage("You'll receive future optimization updates.");
      setShowToast(true);
      router.push("/audit");
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error storing email:", error);
      setToastMessage("Something went wrong. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-6 py-24">
      {/* TOAST */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-400 to-blue-500 p-12 md:p-16">
          {/* Decorative Elements */}
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-black/10" />

          <div className="relative text-center">
            <h2 className="text-4xl font-black text-black md:text-5xl lg:text-6xl">
              Ready to Stop Overpaying?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-black/80">
              Join thousands of smart teams who are saving an average of 50% on 
              their AI subscriptions. Start your free audit today.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row sm:items-start"
            >
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  className={`w-full rounded-xl border-2 bg-white/20 px-6 py-4 text-white placeholder-white/70 backdrop-blur-sm focus:outline-none transition-all ${
                    emailError ? "border-red-500" : "border-transparent focus:border-black"
                  }`}
                />
                {emailError && <p className="text-red-600 text-sm mt-1 text-left">{emailError}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-black px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-gray-900 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Start Free Audit"}
              </button>
            </form>

            <p className="mt-4 text-sm text-black/60">
              Free forever plan available • No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}