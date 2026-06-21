import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

export function fileTimestamp(date: Date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(date.getDate())} ${MESES[date.getMonth()]} ${date.getFullYear()} - ${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}h`
}
