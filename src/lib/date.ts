import { format } from "date-fns"

export const getFormattedDate = (date:Date) => {
   return format(new Date(date), 'yyyy-MM-dd')
}

export const getDaysCount = (from: Date, to: Date) => {
    const start = new Date(from.toDateString())
    const end = new Date(to.toDateString())
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
}
