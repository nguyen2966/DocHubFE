import type { ReactNode } from 'react'

type TooltipPlacement = 'top' | 'bottom' | 'right' | 'left'

interface TooltipsProps {
  text?: string | null
  children: ReactNode
  open?: boolean
  placement?: TooltipPlacement
  className?: string
  contentClassName?: string
}

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const tooltipPosition: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
  right: 'left-full top-1/2 ml-3 -translate-y-1/2',
  left: 'right-full top-1/2 mr-3 -translate-y-1/2',
}

const arrowPosition: Record<TooltipPlacement, string> = {
  top: 'left-1/2 top-full -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-stone-950',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-x-[6px] border-b-[6px] border-x-transparent border-b-stone-950',
  right:
    'right-full top-1/2 -translate-y-1/2 border-y-[6px] border-r-[6px] border-y-transparent border-r-stone-950',
  left: 'left-full top-1/2 -translate-y-1/2 border-y-[6px] border-l-[6px] border-y-transparent border-l-stone-950',
}

export function Tooltips({
  text,
  children,
  open,
  placement = 'bottom',
  className,
  contentClassName,
}: TooltipsProps) {
  if (!text) return <>{children}</>

  const isControlled = typeof open === 'boolean'

  return (
    <span className={cx('group/tooltip relative inline-flex', className)}>
      {children}

      <span
        role="tooltip"
        className={cx(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-stone-950 px-2.5 py-1 text-xs font-medium leading-5 text-white shadow-lg',
          'transition duration-150',
          tooltipPosition[placement],
          isControlled
            ? open
              ? 'visible scale-100 opacity-100'
              : 'invisible scale-95 opacity-0'
            : 'invisible scale-95 opacity-0 group-hover/tooltip:visible group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100',
          contentClassName,
        )}
      >
        {text}

        <span
          className={cx(
            'absolute h-0 w-0',
            arrowPosition[placement],
          )}
        />
      </span>
    </span>
  )
}
