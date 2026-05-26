import { Container } from "@/components/layout/Container";
import { WhatsappButton } from "@/components/ui/WhatsappButton";
import { WHATSAPP_MESSAGES, buildMailtoUrl, CONTACT_EMAIL } from "@/lib/contact";
import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="bg-brand-black py-24 md:py-32">
      <Container className="text-center">
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-brand-white sm:text-5xl">
          O jogo começa aqui.
          <br />
          <span className="bg-volt text-brand-black px-2 text-3xl sm:text-4xl whitespace-nowrap">Sua primeira jogada é nos mandar um &ldquo;Oi&rdquo;!</span>
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <WhatsappButton
            message={WHATSAPP_MESSAGES.ctaFinal}
            variant="primary"
            size="lg"
            className="w-52"
          >
            WhatsApp →
          </WhatsappButton>
          <Link
            href={buildMailtoUrl(
              "Contato pelo site TOUCH MIDIA",
              "Olá! Quero saber mais sobre os jogos da TOUCH MIDIA para um evento.",
            )}
            className="inline-flex h-14 w-52 items-center justify-center gap-2 rounded-full border border-brand-white/20 text-xl font-display font-bold text-brand-white transition-colors hover:border-brand-white/50"
          >
            Email →
          </Link>
        </div>
      </Container>
    </section>
  );
}
