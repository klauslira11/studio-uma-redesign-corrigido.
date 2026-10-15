import { useEffect, useState } from "react";

type NavigatorComHints = Navigator & {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

/**
 * Detecta aparelho fraco ou rede limitada para ativar o "modo leve".
 * Critérios (qualquer um basta):
 * - Data Saver ativado ou rede 2g/3g
 * - Pouca RAM (deviceMemory <= 4 GB, quando o navegador informa)
 * - Poucos núcleos de CPU (<= 4)
 *
 * Só afeta quem realmente precisa: desktop e celular capaz nunca ativam.
 */
export function isLowFxDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const nav = navigator as NavigatorComHints;
  const conn = nav.connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
  if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4)
    return true;
  return false;
}

/** Aplica a classe `low-fx` no <html> quando o aparelho é fraco. */
export function useLowFx(): boolean {
  const [low, setLow] = useState(false);

  useEffect(() => {
    const value = isLowFxDevice();
    setLow(value);
    if (value) document.documentElement.classList.add("low-fx");
    return () => {
      document.documentElement.classList.remove("low-fx");
    };
  }, []);

  return low;
}
