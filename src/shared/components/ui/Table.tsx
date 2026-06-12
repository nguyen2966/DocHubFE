import { Trash } from '@phosphor-icons/react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MembersTableColumn<T> {
  key: string
  header: string
  width?: string
  render: (row: T, index: number) => React.ReactNode
}

export interface MembersTableProps<T> {
  rows: T[]
  columns: MembersTableColumn<T>[]
  getRowKey: (row: T) => string
  empty?: React.ReactNode
}

// ─── Generic Table ────────────────────────────────────────────────────────────

export function MembersTable<T>({
  rows,
  columns,
  getRowKey,
  empty = <span>No data</span>,
}: MembersTableProps<T>) {
  // Thay thế colTemplate bằng tỷ lệ chính xác từ Figma: 681px : 163px : 308px
  // Điều này tương đương với tỷ lệ: 2.2fr 0.5fr 1fr để đảm bảo co giãn responsive tốt
  const colTemplate = 'minmax(0, 2.2fr) minmax(0, 0.5fr) minmax(0, 1fr)'

  return (
    <div className="w-full min-w-[356px] bg-white">
      {/* Head */}
      <div
        className="grid px-2 py-3 border-b border-stone-200"
        style={{ gridTemplateColumns: colTemplate }}
      >
        {columns.map(col => (
          <span
            key={col.key}
            className={`text-sm font-medium text-stone-500 ${col.key === 'actions' ? 'text-right pr-2' : ''
              }`}
          >
            {col.header}
          </span>
        ))}
      </div>

      {/* Body */}
      {/* Body */}
      {rows.length === 0 ? (
        <div className="py-16 text-center text-sm text-stone-400">{empty}</div>
      ) : (
        <div className="flex flex-col">
          {rows.map((row, i) => {
            // Xác định dòng cuối cùng để nếu muốn, có thể bỏ border dưới cùng đi cho sạch
            const isLast = i === rows.length - 1

            return (
              <div
                key={getRowKey(row)}
                // CHỈNH SỬA TẠI ĐÂY: Thêm border-b border-stone-100 (hoặc border-stone-200/60 tùy độ đậm nhạt bạn muốn)
                className={`grid px-2 py-4 items-center hover:bg-stone-50/40 transition-colors ${!isLast ? 'border-b border-stone-200' : ''
                  }`}
                style={{ gridTemplateColumns: colTemplate }}
              >
                {columns.map(col => (
                  <div
                    key={col.key}
                    className={col.key === 'actions' ? 'flex justify-end' : ''}
                  >
                    {col.render(row, i)}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Member-specific pieces (exported for use in the page) ────────────────────

interface RoleCellProps {
  role: string | undefined
  memberId: string
  userId: string
  canChange: boolean
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onSelect: (role: 'member' | 'admin') => void
}

export function RoleCell({
  role,
  memberId,
  userId,
  canChange,
  isOpen,
  onToggle,
  onClose,
  onSelect,
}: RoleCellProps) {
  const isAdmin = role === 'admin'

  if (!canChange || isAdmin) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-100/80 rounded-md capitalize">
        {role === 'admin' ? 'Admin' : role}
      </span>
    )
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-50 border border-stone-200/60 rounded-md hover:bg-stone-100 transition-colors"
      >
        <span className="capitalize">{role}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          className={`text-stone-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 top-full left-0 mt-1 w-48 bg-white border border-stone-100 rounded-lg shadow-lg overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {(['member', 'admin'] as const).map(r => (
            <button
              key={r}
              onClick={() => { onSelect(r); onClose() }}
              className={`w-full text-left px-3 py-2 hover:bg-stone-50 transition-colors ${role === r ? 'bg-stone-50/80' : ''}`}
            >
              <p className="text-xs font-medium text-stone-800 capitalize">{r}</p>
              <p className="text-[10px] text-stone-400 mt-0.5 leading-normal">
                {r === 'member' ? 'Can create & edit documents' : 'Can manage settings & members'}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface RemoveButtonProps {
  show: boolean
  onClick: () => void
}

export function RemoveButton({ show, onClick }: RemoveButtonProps) {
  if (!show) return null
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100/60 transition-colors mr-2"
    >
      <Trash size={16} weight="regular" />
    </button>
  )
}