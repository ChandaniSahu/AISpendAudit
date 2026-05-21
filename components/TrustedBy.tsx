import {
  SiOpenai,
  SiAnthropic,
  SiNotion,
  SiGithubcopilot,
} from "react-icons/si";

const companies = [
  { name: "OpenAI", logo: SiOpenai },
  { name: "Anthropic", logo: SiAnthropic },
  { name: "Notion", logo: SiNotion },
  { name: "GitHub Copilot", logo: SiGithubcopilot },
];

export default function TrustedBy() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
          Trusted by teams using
        </p>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          {companies.map((company) => {
            const Icon = company.logo;

            return (
              <div
                key={company.name}
                className="flex items-center gap-3 rounded-xl border p-4 shadow-sm"
              >
                <Icon className="text-3xl" />
                <span className="font-medium">{company.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
