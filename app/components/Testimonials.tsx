const testimonials = [
  {
    quote:
      "We reduced our AI costs by 40% in just one week. The recommendations were spot-on and easy to implement.",
    author: "Sarah Chen",
    role: "CTO, TechVentures",
    avatar: "👩‍💼",
    rating: 5,
  },
  {
    quote:
      "AI Spend Audit found subscriptions we completely forgot about. We saved $3,000 in the first month alone.",
    author: "Marcus Johnson",
    role: "Founder, DataFlow",
    avatar: "👨‍💻",
    rating: 4,
  },
  {
    quote:
      "The platform is incredibly intuitive. We got actionable insights within minutes of connecting our tools.",
    author: "Emily Rodriguez",
    role: "Engineering Manager, ScaleUp",
    avatar: "👩‍🔧",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-24 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            What Our{" "}
            <span className="gradient-text">Users Say</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Join thousands of teams who are already saving money on their AI subscriptions.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="glass-card p-8 hover-lift"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ⭐
                  </span>
                ))}
              </div>

              <p className="leading-7 text-gray-300">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 to-blue-500/20 text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
