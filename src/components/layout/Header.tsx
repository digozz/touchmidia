import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { WHATSAPP_MESSAGES } from "@/lib/contact";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Jogos", href: "/jogos" },
  { label: "Como Funciona", href: "/como-funciona" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-brand-black/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <WhatsappButton
          message={WHATSAPP_MESSAGES.generic}
          variant="primary"
          size="sm"
        >
          Falar no WhatsApp
        </WhatsappButton>
      </Container>
    </header>
  );
}
