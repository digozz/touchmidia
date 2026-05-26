import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do site da TOUCH MIDIA.",
  alternates: { canonical: "/termos-de-uso" },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-2 py-16 md:py-24">
        <Container className="max-w-3xl">
          <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
            Legal
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Termos de Uso
          </h1>
          <p className="mt-4 text-sm text-white/50">
            Última atualização: maio de 2026
          </p>

          <div className="mt-12 space-y-8 text-base leading-relaxed text-white/75">
            <p>
              Estes Termos de Uso (&quot;Termos&quot;) regulam o uso do site{" "}
              <strong>touchmidia.com</strong>, mantido pela TOUCH MIDIA, CNPJ
              42.662.663/0001-11. Ao acessar e usar o site, você concorda com
              estes Termos. Se não concorda, por favor não utilize o site.
            </p>

            <Section title="1. Aceitação">
              <p>
                O uso do site implica a aceitação integral destes Termos e da{" "}
                <a
                  href="/politica-de-privacidade"
                  className="font-medium text-volt hover:underline"
                >
                  Política de Privacidade
                </a>
                . Se você usa o site em nome de uma empresa, declara ter
                autoridade para vincular essa empresa.
              </p>
            </Section>

            <Section title="2. Conteúdo do site">
              <p>
                As informações sobre serviços, jogos e funcionalidades têm
                caráter ilustrativo. Detalhes específicos, preços e prazos são
                confirmados em proposta comercial após contato direto.
              </p>
              <p>
                Mockups e prêmios fictícios usados no site (incluindo na demo
                interativa da roleta) são apenas demonstrativos e não
                representam compromisso de produto ou prêmio real.
              </p>
            </Section>

            <Section title="3. Propriedade intelectual">
              <p>
                Todo o conteúdo do site (textos, código, ilustrações SVG,
                marca, layout) é de propriedade da TOUCH MIDIA ou licenciado
                para uso, sendo protegido por leis de propriedade intelectual.
              </p>
              <p>
                É vedado reproduzir, redistribuir ou explorar comercialmente o
                conteúdo sem autorização prévia por escrito.
              </p>
            </Section>

            <Section title="4. Uso permitido">
              <p>Você concorda em não:</p>
              <ul className="ml-5 list-disc space-y-1">
                <li>Usar o site para finalidades ilegais ou não autorizadas.</li>
                <li>
                  Tentar acessar áreas restritas, dados de terceiros ou sistemas
                  do site sem autorização.
                </li>
                <li>
                  Sobrecarregar deliberadamente a infraestrutura (testes de
                  carga, scraping massivo, ataques).
                </li>
                <li>
                  Utilizar conteúdo do site em peças concorrentes ou enganosas.
                </li>
              </ul>
            </Section>

            <Section title="5. Links externos">
              <p>
                O site pode conter links para serviços de terceiros (WhatsApp,
                Google Analytics, Meta). A TOUCH MIDIA não se responsabiliza
                pelo conteúdo, políticas ou disponibilidade desses serviços.
              </p>
            </Section>

            <Section title="6. Limitação de responsabilidade">
              <p>
                O site é fornecido &quot;como está&quot;. A TOUCH MIDIA se
                esforça para mantê-lo disponível, mas não garante operação
                ininterrupta ou ausência total de erros. Indisponibilidades
                pontuais não geram direito a indenização.
              </p>
            </Section>

            <Section title="7. Alterações nestes Termos">
              <p>
                Estes Termos podem ser atualizados a qualquer momento. A versão
                vigente estará sempre nesta página com data de última
                atualização no topo. Uso continuado após atualização implica
                aceitação dos novos termos.
              </p>
            </Section>

            <Section title="8. Foro e legislação aplicável">
              <p>
                Estes Termos são regidos pela legislação brasileira. Fica eleito
                o foro da comarca de Fortaleza/CE para dirimir eventuais
                disputas, com renúncia a qualquer outro, por mais privilegiado
                que seja.
              </p>
            </Section>

            <Section title="9. Contato">
              <p>
                Dúvidas sobre estes Termos:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-volt hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </Section>

            <p className="mt-12 rounded-xl bg-volt/\[0\.06\] p-6 text-sm text-white/70">
              <strong>Observação:</strong> esta é uma versão genérica sem revisão
              jurídica específica para o negócio. Recomenda-se revisão por
              advogado antes de uso comercial pleno.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}
