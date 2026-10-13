import { useRef, useCallback } from "react";

import { useTimelineProgress } from "@/hooks/use-timeline-progress";

export type TimelineItem = {
  ano: string;
  texto: string;
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function ScrollTimeline({ items }: { items: TimelineItem[] }) {
  const lineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const onProgress = useCallback(
    (progress: number) => {
      const eased = easeOutCubic(progress);

      lineRef.current?.style.setProperty("transform", `scaleY(${eased})`);
      glowRef.current?.style.setProperty("transform", `scaleY(${eased})`);
      glowRef.current?.style.setProperty("opacity", String(0.45 + eased * 0.55));

      if (headRef.current) {
        headRef.current.style.setProperty("top", `${eased * 100}%`);
        headRef.current.style.setProperty("opacity", eased > 0.005 && eased < 0.995 ? "1" : "0");
      }

      itemRefs.current.forEach((li, i) => {
        if (!li) return;

        const threshold = (i + 0.55) / items.length;
        const local = Math.min(1, Math.max(0, (progress - threshold + 0.14) / 0.14));
        const localEased = easeOutCubic(local);

        const dot = li.querySelector("[data-timeline-dot]") as HTMLElement | null;
        const year = li.querySelector("[data-timeline-year]") as HTMLElement | null;
        const text = li.querySelector("[data-timeline-text]") as HTMLElement | null;

        dot?.style.setProperty("transform", `translate(-50%, 0) scale(${0.35 + localEased * 0.65})`);
        dot?.style.setProperty(
          "box-shadow",
          localEased > 0.35
            ? "0 0 16px color-mix(in oklab, var(--primary) 60%, transparent)"
            : "0 0 0 color-mix(in oklab, var(--primary) 0%, transparent)",
        );
        year?.style.setProperty("opacity", String(0.55 + localEased * 0.45));
        text?.style.setProperty("opacity", String(0.45 + localEased * 0.55));
        text?.style.setProperty("transform", `translateY(${(1 - localEased) * 10}px)`);
      });
    },
    [items.length],
  );

  const containerRef = useTimelineProgress<HTMLDivElement>(onProgress);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-2xl pl-10">
      {/* Coluna da linha — fica totalmente fora do fluxo do texto */}
      <div className="pointer-events-none absolute left-[3px] top-1 bottom-1 w-px" aria-hidden="true">
        {/* Trilha inativa */}
        <div className="absolute inset-0 bg-primary/15" />
        {/* Linha de progresso principal */}
        <div
          ref={lineRef}
          className="absolute inset-0 origin-top bg-gradient-to-b from-primary via-primary to-primary/30"
          style={{ transform: "scaleY(0)" }}
        />
        {/* Brilho difuso ao redor da linha ativa */}
        <div
          ref={glowRef}
          className="absolute -left-px top-0 h-full w-[3px] origin-top bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 blur-[2px]"
          style={{ transform: "scaleY(0)", opacity: 0.45 }}
        />
        {/* Cabeça viajante — ponto luminoso que acompanha o fim da linha */}
        <div
          ref={headRef}
          className="absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-opacity duration-300"
          style={{
            top: "0%",
            opacity: 0,
            boxShadow: "0 0 18px 4px color-mix(in oklab, var(--primary) 65%, transparent)",
          }}
        />
      </div>

      <ol className="space-y-8 sm:space-y-10">
        {items.map((item, i) => (
          <li
            key={item.ano}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="relative"
          >
            <span
              data-timeline-dot
              className="absolute top-[7px] h-2 w-2 rounded-full bg-primary"
              style={{ left: "-36px", transform: "translate(-50%, 0) scale(0.35)" }}
            />
            <p
              data-timeline-year
              className="text-xs uppercase tracking-[0.2em] text-primary"
              style={{ opacity: 0.55 }}
            >
              {item.ano}
            </p>
            <p
              data-timeline-text
              className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base"
              style={{ opacity: 0.45, transform: "translateY(10px)" }}
            >
              {item.texto}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
