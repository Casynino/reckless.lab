import { shopConfig } from "./config";

/** Format a number as store currency, e.g. 148 -> "$148". */
export function formatPrice(amount: number): string {
  const { symbol, fractionDigits } = shopConfig.currency;
  const value = amount.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `${symbol}${value}`;
}
