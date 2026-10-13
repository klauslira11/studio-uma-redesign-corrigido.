import { useEffect, useRef, type RefObject } from "react";

/**
 * Observa a posição de um elemento na viewport e reporta progresso
 * entre 0 (topo do elemento ainda não entrou) e 1 (base do elemento passou).
 * Usa IntersectionObserver + requestAnimationFrame para máxima fluidez.
 */
export function useTimelineProgress<T extends HTMLElement>(
  onProgress: (progress: number) => void,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const callbackRef = useRef(onProgress);

  // Mantém a referência mais recente do callback sem reatachar listeners.
  useEffect(() => {
    callbackRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let listening = false;

    const updateProgress = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Começa quando o topo do elemento entra pela base da viewport
      // e termina quando a base do elemento sai pelo topo da viewport.
      const start = rect.top - windowHeight;
      const end = rect.bottom;
      const range = end - start;
      const value = range > 0 ? -start / range : 0;
      callbackRef.current(Math.max(0, Math.min(1, value)));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateProgress();
        rafId = 0;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!listening) {
              window.addEventListener("scroll", onScroll, { passive: true });
              listening = true;
            }
            updateProgress();
          } else if (listening) {
            window.removeEventListener("scroll", onScroll);
            listening = false;
          }
        });
      },
      { threshold: 0, rootMargin: "120px 0px 120px 0px" },
    );

    observer.observe(el);
    updateProgress();

    return () => {
      observer.disconnect();
      if (listening) window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}
