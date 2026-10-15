import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import { depoimentos, type Depoimento } from "../data/depoimentos";
import { isLowFxDevice } from "../hooks/use-low-fx";

function Cartao({ item, oculto = false }: { item: Depoimento; oculto?: boolean }) {
  const cartao = (
    <figure className="flex min-h-[160px] w-[300px] shrink-0 flex-col self-stretch rounded-2xl border border-navy/10 border-t-2 border-t-primary bg-[#f7f3ea] p-5 text-left sm:min-h-[170px] sm:w-[360px]">
      <blockquote className="flex-1 overflow-hidden text-sm font-light leading-relaxed text-navy">
        &ldquo;{item.texto}&rdquo;
      </blockquote>
      {(item.nome || item.tipo || item.fonte) && (
        <figcaption className="mt-5 border-t border-navy/10 pt-4">
          {item.nome && <p className="text-sm font-semibold text-navy">{item.nome}</p>}
          {item.tipo && (
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {item.tipo}
            </p>
          )}
          {item.fonte &&
            (item.link && !oculto ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[11px] uppercase tracking-[0.18em] text-primary hover:underline"
              >
                {item.fonte}
              </a>
            ) : (
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {item.fonte}
              </p>
            ))}
        </figcaption>
      )}
    </figure>
  );

  if (oculto) {
    return (
      <div aria-hidden="true" className="flex">
        {cartao}
      </div>
    );
  }
  return cartao;
}

export function Depoimentos({ whatsappUrl }: { whatsappUrl: string }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const posicao = useRef(0);
  const arrasto = useRef<{ x: number } | null>(null);
  const pausado = useRef(false);
  const visivel = useRef(false);
  const [movimentoReduzido, setMovimentoReduzido] = useState(false);

  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const calcular = () => consulta.matches || isLowFxDevice();
    setMovimentoReduzido(calcular());
    const aoMudar = () => setMovimentoReduzido(calcular());
    consulta.addEventListener("change", aoMudar);
    return () => consulta.removeEventListener("change", aoMudar);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entrada]) => {
        visivel.current = entrada.isIntersecting;
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (movimentoReduzido) return;
    let raf = 0;
    let ultimo = performance.now();
    const metade = () => (trackRef.current ? trackRef.current.scrollWidth / 2 : 0);
    const passo = (agora: number) => {
      const decorrido = Math.min(64, agora - ultimo);
      ultimo = agora;
      const h = metade();
      if (!arrasto.current && !pausado.current && visivel.current && h > 0) {
        posicao.current -= (decorrido / 1000) * 36;
        if (-posicao.current >= h) posicao.current += h;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${posicao.current}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [movimentoReduzido]);

  const aoPressionar = (event: React.PointerEvent) => {
    arrasto.current = { x: event.clientX };
  };

  const aoMover = (event: React.PointerEvent) => {
    const d = arrasto.current;
    const trilho = trackRef.current;
    if (!d || !trilho) return;
    const h = trilho.scrollWidth / 2;
    if (h <= 0) return;
    const dx = event.clientX - d.x;
    d.x = event.clientX;
    posicao.current += dx;
    while (posicao.current > 0) posicao.current -= h;
    while (-posicao.current >= h) posicao.current += h;
    trilho.style.transform = `translate3d(${posicao.current}px, 0, 0)`;
  };

  const aoSoltar = () => {
    arrasto.current = null;
  };

  return (
    <section ref={sectionRef} id="depoimentos" aria-label="Depoimentos" className="overflow-hidden bg-white py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1480px] px-5 text-center sm:px-8 lg:px-12">
        <p className="flex items-center justify-center gap-3 text-[9px] font-semibold uppercase tracking-[0.32em] text-navy/55">
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
          Depoimentos
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
        </p>
        <h2 className="mx-auto mt-5 max-w-3xl font-heading text-[clamp(1.7rem,3.5vw,3.5rem)] leading-[0.9] tracking-[-0.02em] text-navy">
          Histórias que ganham espaço
        </h2>
      </div>

      <div
        className="mt-12 touch-pan-y overflow-hidden"
        style={{ cursor: "grab" }}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onMouseEnter={() => {
          pausado.current = true;
        }}
        onMouseLeave={() => {
          pausado.current = false;
          aoSoltar();
        }}
        onFocus={() => {
          pausado.current = true;
        }}
        onBlur={() => {
          pausado.current = false;
        }}
      >
        <div ref={trackRef} className="flex w-max items-stretch will-change-transform">
          <div className="flex items-stretch gap-6 pr-6">
            {depoimentos.map((item, indice) => (
              <Cartao key={`a-${indice}`} item={item} />
            ))}
          </div>
          <div className="flex items-stretch gap-6 pr-6" aria-hidden="true">
            {depoimentos.map((item, indice) => (
              <Cartao key={`b-${indice}`} item={item} oculto />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
