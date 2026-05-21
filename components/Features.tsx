import { 
  ChartBarIcon, 
  LightBulbIcon, 
  CurrencyDollarIcon,
  ShieldCheckIcon,
  BoltIcon,
  UserGroupIcon 
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "AI Spend Analysis",
    description:
      "Get a comprehensive breakdown of your AI subscription costs, API usage, and identify where money is being wasted.",
    icon: ChartBarIcon,
    color: "emerald",
  },
  {
    title: "Smart Recommendations",
    description:
      "Receive AI-powered suggestions for cheaper alternatives, plan optimizations, and consolidation opportunities.",
    icon: LightBulbIcon,
    color: "blue",
  },
  {
    title: "Savings Calculator",
    description:
      "Visualize your potential savings with our interactive calculator. See monthly and yearly projections instantly.",
    icon: CurrencyDollarIcon,
    color: "purple",
  },
  
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            Everything You Need to{" "}
            <span className="gradient-text">Optimize AI Costs</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Our platform provides all the tools you need to understand, manage, 
            and optimize your AI spending across your entire organization.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group glass-card p-8 hover-lift cursor-pointer"
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${
                  feature.color === "emerald"
                    ? "from-emerald-400/20 to-emerald-500/20"
                    : feature.color === "blue"
                    ? "from-blue-400/20 to-blue-500/20"
                    : "from-purple-400/20 to-purple-500/20"
                }`}
              >
                <feature.icon className={`h-7 w-7 ${
                  feature.color === "emerald"
                    ? "text-emerald-400"
                    : feature.color === "blue"
                    ? "text-blue-400"
                    : "text-purple-400"
                }`} />
              </div>
              <h3 className="text-2xl font-bold group-hover:text-emerald-400 transition-colors">
                {feature.title}
              </h3>
              <p className="mt-4 leading-7 text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
