import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import type { SVGProps } from "react";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export const developer = {
  name: "Jabir Siddique Talim",
  role: "Full Stack Developer \u2014 FixItNow",
  bio: "Built the board so home repairs in Dhaka come with a printed price and a vetted pro.",
  email: "jsiddiquetalim@gmail.com",
  phone: "+880 1839685304",
  github: "https://github.com/JabirSiddiqueTalim",
  linkedin: "https://www.linkedin.com/in/jabir-siddique-talim-0007192b2/",
};

const links = [
  {
    icon: Mail,
    label: "Email",
    value: developer.email,
    href: `mailto:${developer.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: developer.phone,
    href: `tel:${developer.phone.replace(/\s+/g, "")}`,
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: developer.github,
    href: developer.github,
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: developer.linkedin,
    href: developer.linkedin,
  },
];

export function Developer() {
  return (
    <section className="hero-grid border-t-2 border-dashed border-bone/15 bg-board text-bone">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety">
          {"// Built by"}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The person behind the board.
        </h2>

        <div className="group mt-10 grid gap-8 rounded-2xl border border-bone/20 bg-ink/45 p-6 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.55)] transition hover:-translate-y-0.5 hover:border-safety/40 sm:p-8 md:grid-cols-[220px_1fr]">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-sm border border-bone/25">
            <Image
              src={"/developer.jpg"}
              alt={`Portrait of ${developer.name} `}
              fill
              sizes="220px"
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  {developer.name}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/60">
                  {developer.role}
                </p>
              </div>
              <span className="animate-stamp rounded-sm border-2 border-safety px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-safety">
                {"Built \u2713"}
              </span>
            </div>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-bone/75">
              {developer.bio}
            </p>

            <ul className="mt-6 grid gap-2.5 border-t border-bone/15 pt-6 sm:grid-cols-2">
              {links.map((link) => {
                const row = (
                  <>
                    <link.icon className="size-4 shrink-0 text-safety" aria-hidden />
                    <span className="min-w-0">
                      <span className="block text-xs text-bone/50">{link.label}</span>
                      <span className="block truncate text-sm font-medium text-bone">
                        {link.value}
                      </span>
                    </span>
                  </>
                );
                const cls =
                  "flex items-center gap-3 rounded-sm border border-bone/15 px-3 py-2.5 transition-colors hover:border-safety/60 hover:bg-white/5";
                return (
                  <li key={link.label}>
                    {link.href ? (
                      <a href={link.href} className={cls} target="_blank" rel="noreferrer">
                        {row}
                      </a>
                    ) : (
                      <div className={cls}>{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}