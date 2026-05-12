import { CalendarDate, parseDate } from '@internationalized/date'

export function isoToCalendarDate(iso: string | null | undefined): CalendarDate | undefined {
  if (!iso) return undefined
  try {
    return parseDate(iso.slice(0, 10))
  } catch {
    return undefined
  }
}

export function calendarDateToIso(d: CalendarDate | undefined | null): string {
  return d ? d.toString() : ''
}

export function formatVN(d: CalendarDate | undefined | null): string {
  if (!d) return ''
  return `${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}/${d.year}`
}
