import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { CONTACT_EMAIL } from "@/lib/contact";

const sections = [
  {
    title: "Catálogo",
    links: [
      { label: "Roleta Premiada", href: "/jogos/roleta-premiada" },
      { label: "Raspadinha", href: "/jogos/raspadinha" },
      { label: "Quiz Interativo", href: "/jogos/quiz" },
      { label: "Ver todos os jogos", href: "/jogos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Como Funciona", href: "/como-funciona" },
      { label: "Falar no WhatsApp", href: "https://wa.me/5585989761076" },
      { label: `Email: ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de Privacidade", href: "/politica-de-privacidade" },
      { label: "Termos de Uso", href: "/termos-de-uso" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-brand-black text-brand-white/80">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-white/60">
              Mais filas. Mais leads. Sem gastar com agência grande.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-brand-white">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-white/70 transition-colors hover:text-brand-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-brand-white/10 pt-8 text-xs text-brand-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            TOUCH MIDIA · CNPJ 42.662.663/0001-11 · Fortaleza/CE · {year}
          </p>
          <p>Todos os direitos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}
