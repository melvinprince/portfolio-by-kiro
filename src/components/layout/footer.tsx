import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: Github,
    label: "View GitHub profile",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: Linkedin,
    label: "Connect on LinkedIn",
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
    label: "Follow on Twitter",
  },
  {
    name: "Email",
    href: "mailto:hello@example.com",
    icon: Mail,
    label: "Send an email",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="border-t bg-background" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <nav aria-label="Social media links" role="navigation">
            <div className="flex items-center space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={link.label}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Contact Email */}
          <div className="text-center">
            <Link
              href="mailto:hello@example.com"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              hello@example.com
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} Portfolio. Built with{" "}
              <Link
                href="https://nextjs.org"
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js
              </Link>{" "}
              and{" "}
              <Link
                href="https://tailwindcss.com"
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tailwind CSS
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
