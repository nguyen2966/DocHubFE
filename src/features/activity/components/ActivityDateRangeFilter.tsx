import {
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  X,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ActivityDateRange } from '../types/activity.type'
import {
  formatDateRangeLabel,
  isDateBetween,
  isSameDay,
  toNextDayStartIso,
  toStartOfDayIso,
} from '../util/activity-date.util'

interface ActivityDateRangeFilterProps {
  value: ActivityDateRange
  onChange: (value: ActivityDateRange) => void
}

function getMonthTitle(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function addMonths(date: Date, months: number) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getCalendarDays(month: Date) {
  const first = startOfMonth(month)
  const start = new Date(first)
  start.setDate(start.getDate() - first.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start)
    day.setDate(start.getDate() + index)
    return day
  })
}

function MonthCalendar({
  month,
  startDate,
  endDate,
  onSelect,
}: {
  month: Date
  startDate?: Date
  endDate?: Date
  onSelect: (date: Date) => void
}) {
  const days = getCalendarDays(month)

  return (
    <div className="w-[190px]">
      <div className="mb-3 text-center text-sm font-medium text-stone-950">
        {getMonthTitle(month)}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-stone-400">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-sm">
        {days.map((day) => {
          const outsideMonth = day.getMonth() !== month.getMonth()
          const selectedStart = startDate && isSameDay(day, startDate)
          const selectedEnd = endDate && isSameDay(day, endDate)
          const inRange = isDateBetween(day, startDate, endDate)

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect(day)}
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full transition ${
                selectedStart || selectedEnd
                  ? 'bg-stone-950 text-white'
                  : inRange
                    ? 'bg-stone-100 text-stone-950'
                    : outsideMonth
                      ? 'text-stone-400 hover:bg-stone-50'
                      : 'text-stone-900 hover:bg-stone-100'
              }`}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ActivityDateRangeFilter({
  value,
  onChange,
}: ActivityDateRangeFilterProps) {
  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()))
  const rootRef = useRef<HTMLDivElement | null>(null)

  const startDate = useMemo(
    () => (value.from ? new Date(value.from) : undefined),
    [value.from],
  )

  const endDate = useMemo(() => {
    if (!value.to) return undefined

    const exclusive = new Date(value.to)
    exclusive.setDate(exclusive.getDate() - 1)
    return exclusive
  }, [value.to])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return
      if (rootRef.current.contains(event.target as Node)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectDate = (date: Date) => {
    if (!startDate || endDate) {
      onChange({
        from: toStartOfDayIso(date),
        to: undefined,
      })
      return
    }

    if (date.getTime() < startDate.getTime()) {
      onChange({
        from: toStartOfDayIso(date),
        to: toNextDayStartIso(startDate),
      })
      return
    }

    onChange({
      from: toStartOfDayIso(startDate),
      to: toNextDayStartIso(date),
    })
  }

  const hasValue = Boolean(value.from && value.to)

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex h-9 min-w-[230px] items-center justify-between rounded-xl border bg-white px-3 text-sm shadow-sm transition hover:bg-stone-50 ${
          open ? 'border-stone-300 ring-2 ring-stone-300' : 'border-stone-200'
        }`}
      >
        <span className="flex min-w-0 items-center gap-2 text-stone-700">
          <CalendarBlank size={15} className="shrink-0 text-stone-600" />
          <span className="truncate">
            {formatDateRangeLabel(value.from, value.to)}
          </span>
        </span>

        <CaretDown size={14} className="shrink-0 text-stone-600" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 rounded-xl border border-stone-200 bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-100"
            >
              <CaretLeft size={16} />
            </button>

            {hasValue && (
              <button
                type="button"
                onClick={() => onChange({})}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              >
                <X size={13} />
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-stone-100"
            >
              <CaretRight size={16} />
            </button>
          </div>

          <div className="flex gap-6">
            <MonthCalendar
              month={visibleMonth}
              startDate={startDate}
              endDate={endDate}
              onSelect={selectDate}
            />

            <MonthCalendar
              month={addMonths(visibleMonth, 1)}
              startDate={startDate}
              endDate={endDate}
              onSelect={selectDate}
            />
          </div>
        </div>
      )}
    </div>
  )
}