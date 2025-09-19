import { format } from "date-fns"

type DateFormat =
  | 'yyyy-MM-dd'           // → 2025-09-16 (ISO-like, common in APIs)
  | 'MM/dd/yyyy'           // → 09/16/2025 (U.S. style)
  | 'dd/MM/yyyy'           // → 16/09/2025 (European style)
  | 'MMMM d, yyyy'         // → September 16, 2025 (Full month name)
  | 'MMM d, yyyy'          // → Sep 16, 2025 (Abbreviated month)
  | 'MMMM do, yyyy'        // → September 16th, 2025 (Ordinal day)
  | 'yyyy'                 // → 2025 (Year only)
  | 'yyyy-MM-dd HH:mm:ss'  // → 2025-09-16 14:30:00 (Date + 24h time)
  | 'hh:mm a'              // → 02:30 PM (12h time)
  | 'PP'                   // → Sep 16, 2025 (Localized, if using locales)
//   | string;                // Allow custom or dynamic format strings


export const getFormattedDate = (date: Date, dateFormat?: DateFormat) => {
    if (dateFormat) {
        return format(new Date(date), dateFormat);
    } else {
        return format(new Date(date), 'yyyy-MM-dd');
    }
};

export const getDaysCount = (from: Date, to: Date) => {
    const start = new Date(from.toDateString())
    const end = new Date(to.toDateString())
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
}
