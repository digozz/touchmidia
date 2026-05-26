import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a TOUCH MIDIA trata seus dados pessoais em conformidade com a LGPD.",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface-2 py-16 md:py-24">
        <Container className="max-w-3xl">
          <p className="font-medium uppercase tracking-[0.2em] text-volt text-xs">
            Legal
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-sm text-white/50">
            Última atualização: maio de 2026
          </p>

          <div className="prose prose-neutral mt-12 max-w-none space-y-8 text-base leading-relaxed text-white/75">
            <p>
              Esta Política de Privacidade descreve como a <strong>TOUCH MIDIA</strong>{" "}
              (CNPJ 42.662.663/0001-11), aqui denominada &quot;TOUCH MIDIA&quot; ou
              &quot;nós&quot;, coleta, utiliza, armazena e protege os dados pessoais
              dos visitantes do site <strong>touchmidia.com</strong> e dos clientes
              que contratam nossos serviços, em conformidade com a Lei Geral de
              Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>

            <Section title="1. Dados que coletamos">
              <p>Coletamos dados pessoais nas seguintes situações:</p>
              <ul>
                <li>
                  <strong>Navegação no site:</strong> dados de navegação anônimos
                  via Google Analytics (GA4) e Meta Pixel para fins de medição de
                  audiência e otimização.
                </li>
                <li>
                  <strong>Contato direto:</strong> nome, email, telefone e
                  informações de evento que você nos envia voluntariamente via
                  WhatsApp ou email.
                </li>
                <li>
                  <strong>Operação de evento (clientes):</strong> dados de leads
                  capturados durante eventos por nossos clientes, processados em
                  nome deles (na qualidade de operador, conforme LGPD).
                </li>
              </ul>
            </Section>

            <Section title="2. Para que usamos seus dados">
              <ul>
                <li>Responder ao seu contato comercial.</li>
                <li>
                  Enviar propostas, orçamentos e informações sobre nossos serviços.
                </li>
                <li>Cumprir obrigações legais e contratuais.</li>
                <li>Prevenir fraudes e proteger nossos sistemas.</li>
                <li>Melhorar a experiência do site (analytics).</li>
              </ul>
            </Section>

            <Section title="3. Base legal">
              <p>
                Tratamos dados com base em: (i) seu consentimento, ao entrar em
                contato; (ii) legítimo interesse, para responder solicitações; e
                (iii) cumprimento de obrigação contratual, para clientes ativos.
              </p>
            </Section>

            <Section title="4. Compartilhamento">
              <p>
                Não vendemos seus dados. Compartilhamos apenas com fornecedores
                essenciais à operação:
              </p>
              <ul>
                <li>
                  <strong>Google (GA4):</strong> análise de tráfego (anonimizado).
                </li>
                <li>
                  <strong>Meta Platforms (Pixel):</strong> medição de campanhas de
                  marketing.
                </li>
                <li>
                  <strong>Hostinger:</strong> infraestrutura de hospedagem (VPS).
                </li>
              </ul>
            </Section>

            <Section title="5. Cookies e tecnologias similares">
              <p>
                Utilizamos cookies funcionais e de medição. Você pode desabilitar
                cookies nas configurações do seu navegador, mas algumas
                funcionalidades podem ser prejudicadas.
              </p>
            </Section>

            <Section title="6. Retenção">
              <p>
                Dados de contato são retidos enquanto for necessário para
                cumprir a finalidade da coleta ou prazo legal mínimo (5 anos
                para registros fiscais, conforme aplicável).
              </p>
            </Section>

            <Section title="7. Seus direitos (LGPD)">
              <p>Você pode, a qualquer momento, solicitar:</p>
              <ul>
                <li>Confirmação de tratamento de seus dados.</li>
                <li>Acesso aos dados que possuímos sobre você.</li>
                <li>Correção de dados incompletos ou desatualizados.</li>
                <li>Anonimização, bloqueio ou eliminação de dados.</li>
                <li>
                  Portabilidade ou eliminação de dados tratados com seu
                  consentimento.
                </li>
                <li>Revogação do consentimento.</li>
              </ul>
              <p>
                Para exercer qualquer direito, envie um email para{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-volt hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                . Respondemos em até 15 dias.
              </p>
            </Section>

            <Section title="8. Segurança">
              <p>
                Adotamos medidas técnicas e administrativas razoáveis para
                proteger seus dados (HTTPS, criptografia em repouso quando
                aplicável, controles de acesso). Nenhum sistema é 100% seguro;
                em caso de incidente relevante, comunicamos os titulares e a
                ANPD conforme exigido.
              </p>
            </Section>

            <Section title="9. Alterações nesta política">
              <p>
                Podemos atualizar esta política. A versão vigente estará sempre
                disponível nesta página, com data de última atualização no
                topo.
              </p>
            </Section>

            <Section title="10. Contato">
              <p>
                Dúvidas sobre privacidade ou exercício de direitos:{" "}
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
              <strong>Observação:</strong> esta é uma versão genérica em conformidade
              com a LGPD, sem revisão jurídica específica para o negócio.
              Recomenda-se revisão por advogado antes de uso comercial pleno.
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
