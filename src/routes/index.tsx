import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUp,
  Instagram,
  Mail,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import hero from "../assets/hero.webp";
import herom from "../assets/herom.jpg";
import logo from "../assets/logo.png";
import logo1 from "../assets/logo1.webp";
import cabecalhoBg from "../assets/cabecalho.webp";
import slogan from "../assets/slogan.jpg";
import sloganMobile from "../assets/sloganm.webp";
import antesImg from "../assets/ad/1.jpg";
import depoisImg from "../assets/ad/2.jpg";
import { galeria } from "../data/galeria";
import { ProjectsShowcase } from "../components/projects-showcase";
import { Depoimentos } from "../components/depoimentos";
import { BeforeAfter } from "../components/before-after";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const WHATSAPP_URL =
  "https://wa.me/5516997513357?text=" +
  encodeURIComponent("Olá, Studio Uma! Quero conversar sobre um projeto.");

// ============================================================
// DADOS DO RODAPÉ (campos editáveis)
// ============================================================
const EMAIL_CONTATO = "Contato@umastudio.com.br";
const TELEFONE_EXIBICAO = "(16) 99751-3357";
const INSTAGRAM_URL = "https://www.instagram.com/_studiouma/";
const CIDADE_ATENDIMENTO = "Ribeirão Preto · atendimento em todo o Brasil";

// ============================================================
// FOTOGRAFIAS (espaços substituíveis)
// Para trocar uma foto, cole entre as aspas o caminho do
// arquivo dentro de src/assets. Ex:
//   "../assets/projetos/Equipe/laura.jpg"
// Enquanto estiver vazio (""), aparece um círculo elegante
// com as iniciais no lugar da foto.
// ============================================================
import fotoFundadoras from "../assets/nos_empresa.png";
import fotoLaura from "../assets/eumura.jpg?url";
import fotoMarina from "../assets/mendes.jpg?url";

const FOTO_FUNDADORAS: string = fotoFundadoras;
const FOTO_LAURA: string = fotoLaura;
const FOTO_MARINA: string = fotoMarina;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio UMA — Arquitetura e Interiores" },
      {
        name: "description",
        content:
          "Arquitetura e interiores com identidade, sensibilidade e intenção. Projetos residenciais e comerciais em Ribeirão Preto e em todo o Brasil.",
      },
      { property: "og:title", content: "Studio UMA — Arquitetura e Interiores" },
      { property: "og:description", content: "Espaços que acolhem, inspiram e contam histórias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const faqs = [
  {
    question: "Como começa um projeto com o Studio UMA?",
    answer: "Começa com uma conversa para entendermos seu espaço, sua rotina e o que você deseja transformar.",
  },
  {
    question: "Preciso saber exatamente o que quero antes de entrar em contato?",
    answer: "Não. Você pode chegar com referências, dúvidas ou apenas uma ideia inicial. A conversa ajuda a dar forma às possibilidades.",
  },
  {
    question: "Vocês atendem em quais lugares?",
    answer: "Atendemos em todo o Brasil.",
  },
  {
    question: "Vocês fazem projetos de arquitetura e de interiores?",
    answer: "Sim. O Studio UMA atua com arquitetura e interiores. Conversamos sobre o seu espaço para entender qual tipo de projeto faz sentido para você.",
  },
  {
    question: "Como posso saber o valor e o prazo de entrega do meu projeto?",
    answer: "Esses detalhes dependem do que você precisa. Chame o Studio UMA no WhatsApp para conversar sobre o espaço e receber as informações adequadas ao seu projeto.",
  },
];

function BrandWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex flex-col leading-none" aria-label="Studio UMA">
      <span
        className={`${compact ? "text-[1.55rem]" : "text-[2rem]"} font-heading tracking-[0.12em]`}
      >
        UMA
      </span>
      <span className="mt-1 text-[7px] font-semibold uppercase tracking-[0.42em]">
        arquitetura + interiores
      </span>
    </span>
  );
}

function ArrowUpRightIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return <ArrowRight className={`${className} -rotate-45`} />;
}

function TextoDigitado({ texto, className = "" }: { texto: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [visivel, setVisivel] = useState(false);
  const [n, setN] = useState(0);
  const reduzido =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduzido) {
      setN(texto.length);
      return;
    }
    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [texto, reduzido]);

  useEffect(() => {
    if (!visivel || reduzido || n >= texto.length) return;
    const t = window.setTimeout(() => setN((v) => Math.min(texto.length, v + 2)), n === 0 ? 500 : 45);
    return () => window.clearTimeout(t);
  }, [visivel, n, texto, reduzido]);

  return (
    <span ref={ref} aria-label={texto} className={className}>
      <span aria-hidden="true">
        {texto.slice(0, n)}
        {n < texto.length && (
          <span aria-hidden="true" className="typing-caret ml-[2px] inline-block h-[1em] w-[2px] bg-current align-[-0.15em]" />
        )}
      </span>
    </span>
  );
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("inicio");
      const threshold = hero ? hero.offsetHeight - 80 : window.innerHeight - 80;
      setPastHero(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
      <header
        className={`fixed inset-x-0 top-0 z-30 px-5 pt-5 transition-all duration-300 sm:px-8 lg:px-12 ${
          pastHero
            ? "translate-y-0 bg-navy-deep/95 opacity-100 shadow-lg backdrop-blur"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-[1480px] items-center justify-between border-b border-white/25 pb-4 text-white">
          <a href="#inicio" className="transition-opacity hover:opacity-70">
            <img src={logo} alt="Studio UMA" decoding="async" className="h-8 w-auto object-contain sm:h-10" />
          </a>
          <nav className="hidden items-center gap-9 text-[9px] font-semibold uppercase tracking-[0.28em] lg:flex">
            <a href="#projetos" className="hover:text-primary">
              Projetos
            </a>
            <a href="#empresa" className="hover:text-primary">
              Empresa
            </a>
            <a href="#quem-somos" className="hover:text-primary">
              Quem somos
            </a>
            <a href="#depoimentos" className="hover:text-primary">
              Depoimentos
            </a>
            <a href="#duvidas" className="hover:text-primary">
              Dúvidas
            </a>
            <a href="#contato" className="hover:text-primary">
              Contato
            </a>
          </nav>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-3 border border-white/40 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.24em] transition-colors hover:border-primary hover:bg-primary hover:text-navy-deep sm:flex"
          >
            Iniciar um projeto <ArrowUpRightIcon />
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center border border-white/30 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mx-auto mt-2 flex max-w-[1480px] flex-col bg-navy-deep p-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-white lg:hidden">
            {[
              ["Projetos", "#projetos"],
              ["Empresa", "#empresa"],
              ["Quem somos", "#quem-somos"],
              ["Depoimentos", "#depoimentos"],
              ["Dúvidas", "#duvidas"],
              ["Contato", "#contato"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-4 hover:text-primary"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section
          id="inicio"
          aria-label="Studio UMA"
          className="relative min-h-[100svh] bg-[#074970] text-white lg:min-h-screen"
        >
          <div aria-hidden="true" className="parallax-clip">
            <div
              className="parallax-fixed-bg lg:hidden"
              style={{ backgroundImage: `url(${herom})` }}
            />
            <div
              className="parallax-fixed-bg hidden lg:block"
              style={{ backgroundImage: `url(${hero})` }}
            />
          </div>
        </section>

        <section id="projetos" className="overflow-hidden pb-20 pt-10 sm:pb-28 sm:pt-14 lg:pb-36 lg:pt-16">
          <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
            <div className="pb-8 text-center">
              <h2 className="mx-auto max-w-4xl font-heading text-[clamp(1.7rem,3.5vw,3.5rem)] leading-[0.82] tracking-[-0.04em] text-primary">
                Nossos Projetos
              </h2>
            </div>
          </div>
          <ProjectsShowcase />
        </section>

        <section className="mx-auto grid max-w-[1480px] grid-cols-2 gap-3 px-5 pb-20 sm:px-8 lg:grid-cols-3 lg:px-12 lg:pb-36">
          {galeria.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setLightbox({ src: item.image, title: item.title })}
              aria-label={`Ampliar foto ${item.title}`}
              className={`group relative aspect-[4/3] cursor-zoom-in overflow-hidden bg-navy p-0 text-left ${
                index % 3 === 1 ? "lg:mt-12" : ""
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                decoding="async" loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035] group-hover:opacity-80"
              />
            </button>
          ))}
        </section>

        <section className="bg-white py-10 sm:py-14 lg:py-18">
          <div className="mx-auto max-w-[740px] px-5 sm:px-8 lg:px-12">
            <div className="mb-7 text-center">
              <h2 className="font-heading text-[clamp(1.7rem,3.5vw,3.5rem)] leading-[0.82] tracking-[-0.04em] text-primary">
                Do traço ao espaço
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-relaxed text-muted-foreground">
                Acompanhe a transformação: do esboço inicial ao projeto finalizado.
              </p>
            </div>
            <BeforeAfter before={antesImg} after={depoisImg} />
          </div>
        </section>

        <section
          aria-label="Uma ideia que se transforma"
          className="relative bg-[#eed7b6] text-white"
        >
          <h2 className="sr-only">Uma ideia que se transforma!</h2>
          <div aria-hidden="true" className="parallax-clip">
            <div
              className="parallax-fixed-bg lg:hidden"
              style={{
                backgroundImage: `url(${sloganMobile})`,
                backgroundPosition: "center center",
              }}
            />
            <div
              className="parallax-fixed-bg hidden lg:block"
              style={{
                backgroundImage: `url(${slogan})`,
                backgroundPosition: "center center",
              }}
            />
          </div>
          <div className="relative min-h-[60svh] lg:min-h-[80vh]" />
        </section>

        <section id="empresa" className="bg-white py-20 sm:py-28 lg:py-36">
          <div className="mx-auto grid max-w-[1480px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:px-12">
            <div className="text-center lg:text-left">
              <h2 className="font-heading text-[clamp(2rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.02em] text-primary lg:text-left">
                Nossa empresa
              </h2>
              <p className="mx-auto mt-6 max-w-xl font-heading text-xl font-normal leading-snug text-navy sm:text-[1.35rem] lg:mx-0">
                Duas amigas de infância. Um olhar em comum para a arquitetura.
              </p>
              <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-muted-foreground lg:mx-0">
                O Studio UMA nasceu da amizade entre Laura Uemura e Marina Mendes e do desejo de
                criar espaços que acolhem, inspiram e contam histórias. Cada projeto parte de uma
                escuta atenta para transformar necessidades, afetos e detalhes em ambientes únicos.
              </p>
              <p className="mt-8 flex items-center justify-center gap-4 whitespace-nowrap font-heading text-xl text-primary lg:justify-start lg:whitespace-normal">
                <span className="hidden h-px w-10 bg-primary lg:block" aria-hidden="true" />
                UMA ideia que se transforma.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              {/* Para trocar a foto, preencha FOTO_FUNDADORAS no topo do arquivo */}
              <div className="relative aspect-square w-full max-w-[400px] lg:max-w-[460px]">
                {FOTO_FUNDADORAS ? (
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox({
                        src: FOTO_FUNDADORAS,
                        title: "Laura Uemura e Marina Mendes, fundadoras do Studio UMA",
                      })
                    }
                    aria-label="Ampliar foto das fundadoras"
                    className="h-full w-full cursor-zoom-in rounded-full p-0"
                  >
                    <img
                      src={FOTO_FUNDADORAS}
                      alt="Laura Uemura e Marina Mendes, fundadoras do Studio UMA"
                      decoding="async" loading="lazy"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </button>
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid h-full w-full place-items-center rounded-full bg-navy/5 font-heading text-6xl tracking-[0.2em] text-primary"
                  >
                    LM
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Por que Studio UMA"
          className="bg-[#e6dac8] pt-[52px] text-navy-deep sm:pt-[84px] lg:pt-[116px]"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-6 sm:divide-x sm:divide-navy-deep/25 lg:gap-10">
              {[
                { letra: "U", significado: "Uemura" },
                { letra: "M", significado: "Mendes" },
                { letra: "A", significado: "Arquitetura" },
              ].map((item) => (
                <div
                  key={item.letra}
                  aria-label={`${item.letra} — ${item.significado}`}
                  className="flex items-center gap-5 sm:flex-col sm:gap-4 sm:px-6 sm:text-center"
                >
                  <span
                    aria-hidden="true"
                    className="font-heading text-[clamp(4.5rem,9vw,8rem)] leading-none text-navy-deep"
                  >
                    {item.letra}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-deep">
                    {item.significado}
                  </span>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-16 max-w-2xl text-center text-base font-light leading-relaxed text-navy-deep/80">
              <TextoDigitado texto="UMA representa unidade, singularidade e o início de cada nova história." />
            </p>
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="mb-[-1px] mt-16 block h-[70px] w-full sm:h-[110px] lg:mt-20 lg:h-[140px]"
          >
            <path
              d="M0,64 C240,110 480,20 720,55 C960,90 1200,30 1440,65 L1440,120 L0,120 Z"
              fill="#ffffff"
            />
          </svg>
        </section>

        <section aria-label="Studio UMA" className="bg-white pb-7 pt-14 sm:pb-10 sm:pt-20">
          <div className="mx-auto flex max-w-[1200px] justify-center px-5 sm:px-8 lg:px-12">
            <img
              src={logo1}
              alt="Studio UMA"
              decoding="async" loading="lazy"
              className="h-auto w-44 object-contain sm:w-56 lg:w-64"
            />
          </div>
        </section>

        <section aria-label="Quem somos" id="quem-somos" className="bg-white pb-20 pt-10 sm:pb-28 sm:pt-14 lg:pb-36 lg:pt-[4.5rem]">
          <div className="mx-auto max-w-[1200px] px-5 text-center sm:px-8 lg:px-12">
            <h2 className="mx-auto max-w-3xl font-heading text-[clamp(1.7rem,3.5vw,3.5rem)] leading-[0.9] tracking-[-0.02em] text-navy">
              Quem somos
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-relaxed text-muted-foreground">
              Amigas desde a infância em Guaíra, Laura e Marina seguiram seus caminhos na
              arquitetura e voltaram a se encontrar para criar o Studio UMA.
            </p>
            <div className="mt-14 grid gap-12 sm:gap-16 lg:grid-cols-2 lg:gap-20">
              <div>
                {/* Para trocar a foto, preencha FOTO_LAURA no topo do arquivo */}
                <div className="mx-auto aspect-square w-44 sm:w-52">
                {FOTO_LAURA ? (
                  <button
                    type="button"
                    onClick={() => setLightbox({ src: FOTO_LAURA, title: "Laura Uemura" })}
                    aria-label="Ampliar foto de Laura Uemura"
                    className="h-full w-full cursor-zoom-in rounded-full p-0"
                  >
                    <img
                      src={FOTO_LAURA}
                      alt="Laura Uemura"
                      decoding="async" loading="lazy"
                      className="h-full w-full rounded-full object-cover object-[50%_25%]"
                    />
                  </button>
                ) : (
                    <span
                      aria-hidden="true"
                      className="grid h-full w-full place-items-center rounded-full bg-navy/5 font-heading text-5xl text-primary"
                    >
                      L
                    </span>
                  )}
                </div>
                <p className="mt-6 font-heading text-2xl text-navy sm:text-3xl">Laura Uemura</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/55">
                  Arquiteta e urbanista · Mackenzie, 2024
                </p>
                <p className="mx-auto mt-4 max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
                  Pós-graduanda em Design de Interiores e em Design de Mobiliário. Gosta de
                  explorar novos lugares, trabalhos manuais e pequenos detalhes.
                </p>
              </div>
              <div>
                {/* Para trocar a foto, preencha FOTO_MARINA no topo do arquivo */}
                <div className="mx-auto aspect-square w-44 sm:w-52">
                  {FOTO_MARINA ? (
                    <button
                      type="button"
                      onClick={() => setLightbox({ src: FOTO_MARINA, title: "Marina Mendes" })}
                      aria-label="Ampliar foto de Marina Mendes"
                      className="h-full w-full cursor-zoom-in rounded-full p-0"
                    >
                      <img
                        src={FOTO_MARINA}
                        alt="Marina Mendes"
                        decoding="async" loading="lazy"
                        className="h-full w-full rounded-full object-cover object-[50%_25%]"
                      />
                    </button>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid h-full w-full place-items-center rounded-full bg-navy/5 font-heading text-5xl text-primary"
                    >
                      M
                    </span>
                  )}
                </div>
                <p className="mt-6 font-heading text-2xl text-navy sm:text-3xl">Marina Mendes</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/55">
                  Arquiteta e urbanista · Barão de Mauá
                </p>
                <p className="mx-auto mt-4 max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
                  Pós-graduanda em Planejamento e Gestão de Obras. Gosta de animais, natureza e
                  viagens, com afinidade por arquitetura colonial e interiores.
                </p>
              </div>
            </div>

          </div>
        </section>
        <Depoimentos whatsappUrl={WHATSAPP_URL} />

        <section id="duvidas" aria-label="Dúvidas" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[800px] px-5 sm:px-8">
            <h2 className="mb-12 text-center font-heading text-3xl leading-[0.9] text-navy sm:text-4xl">
              Dúvidas?
            </h2>
            <Accordion type="single" collapsible className="w-full border-t border-navy/15">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="py-6 text-left font-sans text-base font-medium text-primary hover:no-underline sm:text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-sm font-light leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-14 text-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center rounded-full bg-navy px-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-transform hover:scale-105"
              >
                Converse com o Studio UMA
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="contato"
        className="relative overflow-hidden bg-[#084a70] text-white"
        style={{
          backgroundImage: `url(${cabecalhoBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Camada de leitura sobre a imagem de fundo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#084a70]/72" />
        <div className="relative mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_.7fr_.7fr] lg:px-12 lg:py-20">
          <div>
            <BrandWordmark />
            <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-white/70">
              Arquitetura e interiores com identidade, funcionalidade e
              sensibilidade. Espaços que acolhem, inspiram e contam histórias.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram do Studio UMA"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-primary hover:bg-primary hover:text-navy-deep"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp do Studio UMA"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-primary hover:bg-primary hover:text-navy-deep"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
              <a
                href={`mailto:${EMAIL_CONTATO}`}
                aria-label="E-mail do Studio UMA"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-primary hover:bg-primary hover:text-navy-deep"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
              Contato
            </h3>
            <ul className="mt-5 space-y-4 text-sm font-light leading-relaxed text-white/80">
              <li className="text-xs text-white/55">{CIDADE_ATENDIMENTO}</li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  {TELEFONE_EXIBICAO} · WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL_CONTATO}`} className="flex items-center gap-3 transition-colors hover:text-primary">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  {EMAIL_CONTATO}
                </a>
              </li>
            </ul>
          </div>
          <nav aria-label="Links rápidos" className="hidden lg:block">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
              Links rápidos
            </h3>
            <ul className="mt-5 space-y-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              {[
                ["Início", "#inicio"],
                ["Projetos", "#projetos"],
                ["Empresa", "#empresa"],
                ["Quem somos", "#quem-somos"],
                ["Depoimentos", "#depoimentos"],
                ["Dúvidas", "#duvidas"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-primary">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
              Navegação
            </h3>
            <p className="mt-5 text-sm font-light leading-relaxed text-white/70">
              Volte ao topo ou inicie uma conversa sobre o seu projeto.
            </p>
            <div className="mt-5 flex flex-col items-start gap-3">
              <a
                href="#inicio"
                className="inline-flex items-center gap-3 border border-white/30 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:border-primary hover:bg-primary hover:text-navy-deep"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                Voltar ao topo
              </a>
            </div>
          </div>
        </div>
        <div className="relative mx-auto flex max-w-[1480px] flex-col gap-2 border-t border-white/15 px-5 py-5 text-[9px] uppercase tracking-[0.2em] text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>© {new Date().getFullYear()} Studio UMA. Todos os direitos reservados.</span>
          <span>{CIDADE_ATENDIMENTO}</span>
        </div>
      </footer>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada: ${lightbox.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/80 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Fechar foto ampliada"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.title}
            decoding="async"
            className="max-h-[90dvh] w-auto max-w-full rounded-sm object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center transition-transform hover:scale-110 sm:bottom-8 sm:right-8 sm:h-12 sm:w-12"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="h-8 w-8 text-navy transition-colors duration-300 group-hover:text-[#25D366] sm:h-7 sm:w-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}
