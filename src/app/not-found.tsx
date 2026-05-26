import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center bg-surface-2">
        <Container className="py-20 text-center">
          <p className="font-display text-[10rem] font-bold leading-none tracking-tight text-volt/40 sm:text-[14rem]">
            404
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Esse jogo a gente não tem.
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Mas tem 12 outros — vai conferir.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/jogos"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-volt px-6 text-base font-medium text-brand-black transition-colors hover:bg-volt-600"
            >
              Ver catálogo
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-6 text-base font-medium text-white transition-colors hover:border-volt hover:text-volt"
            >
              Voltar para a home
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
