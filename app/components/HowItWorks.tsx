const steps = [
  {
    step: "01",
    title: "Connect Your AI Tools",
    description:
      "Link your AI subscriptions and API keys. We support 50+ AI tools and platforms securely.",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    step: "02",
    title: "Get Instant Analysis",
    description:
      "Our AI analyzes your usage patterns, costs, and finds optimization opportunities in seconds.",
    color: "from-blue-400 to-blue-600",
  },
  {
    step: "03",
    title: "Save Money Automatically",
    description:
      "Implement our recommendations. Watch your AI costs decrease by up to 50%.",
    color: "from-purple-400 to-purple-600",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            How It{" "}
            <span className="gradient-text">Works</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Getting started is easy. Connect your tools, get insights, and start saving 
            in less than 5 minutes.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-white/10 to-transparent md:block" />
              )}
              <div className="relative glass-card p-8 text-center hover-lift">
                <div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-2xl font-bold text-white shadow-lg`}
                >
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="mt-4 leading-7 text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
