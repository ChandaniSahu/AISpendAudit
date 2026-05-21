import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Product: ["Features", "Pricing", "Integration", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "API", "Support", "Status"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

import {
  FaLinkedin,
  FaGithub,
  FaDiscord,
  FaXTwitter,
} from "react-icons/fa6";

const socialLinks = [
  {
    name: "Twitter",
    icon: FaXTwitter,
    href: "#",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    href: "#",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    href: "#",
  },
  {
    name: "Discord",
    icon: FaDiscord,
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0F1E]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-6">
          {/* Company Info */}
          <div className="md:col-span-2">
                <Image
                  src="/logo1.png"
                  alt="AI Spend Audit Logo"
                  width={40}
                  height={40}
                  className="h-20 w-40 object-cover"
                  priority
                />
            <p className="mt-6 leading-7 text-gray-400">
              Helping teams optimize their AI spending and save thousands on 
              subscriptions. Smart auditing for smarter spending.
            </p>
            <div className="flex items-center gap-4">
  {socialLinks.map((social) => {
    const Icon = social.icon;

    return (
      <a
        key={social.name}
        href={social.href}
        className="rounded-lg p-2 hover:bg-white/10"
      >
        <Icon className="text-2xl" />
      </a>
    );
  })}
</div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white">{category}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} AI Spend Audit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
