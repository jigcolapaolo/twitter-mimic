import { useEffect, useState } from "react";
import { formatDate } from "./useDateTimeFormat";

const isRelativeTimeFormatSupported =
  typeof Intl !== "undefined" && Intl.RelativeTimeFormat;

const DATE_UNITS: [string, number][] = [
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

const getDateDiffs = (timestamp: number) => {
  const now = Date.now();
  // Dividir para quitar milisegundos
  // Se pone al reves para obtener el negativo y que el RelativeTimeFormat detecte que fue hace
  // tiempo pasado
  const elapsed = (timestamp - now) / 1000;

  for (const [unit, secondsInUnit] of DATE_UNITS) {
    if (Math.abs(elapsed) > secondsInUnit || unit === "second") {
      const value = Math.round(elapsed / secondsInUnit);
      return { value, unit };
    }
  }
  return { value: 0, unit: "second" };
};

// También se puede usar una estrategia similar para controlar la inactividad del usuario
export default function useTimeAgo(timestamp: number) {
  const [timeago, setTimeago] = useState(() => getDateDiffs(timestamp));

  useEffect(() => {
    if (isRelativeTimeFormatSupported) {
      const interval = setInterval(() => {
        const newTimeAgo = getDateDiffs(timestamp);
        setTimeago(newTimeAgo);
      }, 5000);

      return () => clearTimeout(interval);
    }
  }, [timestamp]);

  if (!isRelativeTimeFormatSupported) {
    return formatDate(timestamp);
  }

  const rtf = new Intl.RelativeTimeFormat("es", { style: "long" });
  const { value, unit } = timeago;
  return rtf.format(value, unit as Intl.RelativeTimeFormatUnit);
}
