import { MagnifyingGlass, SignOut } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '../../assets/folio_logo.png'
import { GlobalSearchModal, useGlobalSearchShortcut } from '../../features/search'
import { useAuthStore } from '../hooks/useAuthStore'
import { UserAvatar } from './UserAvatar'

interface HeaderProps {
  showFunctions?: boolean
}

export function Header({ showFunctions }: HeaderProps) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [showMenu, setShowMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useGlobalSearchShortcut({
    open: searchOpen,
    onOpen: () => {
      if (user && showFunctions) setSearchOpen(true)
    },
    onClose: () => setSearchOpen(false),
  })

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex h-16 w-full items-center border-b border-stone-200 bg-white px-0">
      <div className="flex h-full w-70 shrink-0 items-center gap-3 border-r border-stone-200 px-6">
        <img src={Logo} alt="Folio logo" className="h-10 w-10 shrink-0" />
        <span className="truncate text-[20px] font-bold tracking-tight text-stone-900">
          Folio
        </span>
      </div>

      {user && showFunctions && (
        <div className="flex flex-1 items-center justify-between gap-4 px-6">
          <div className="flex h-16 w-full max-w-[1008px] grow shrink-0 flex-col items-start justify-center gap-2 border-r border-stone-200 py-4 pl-4 pr-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-full items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 text-left transition-all hover:bg-white hover:border-stone-300 hover:shadow-sm"
            >
              <MagnifyingGlass
                size={16}
                className="shrink-0 text-stone-400"
              />
              <span className="min-w-0 flex-1 truncate text-sm text-stone-400">
                Search documents across all workspaces...
              </span>
              <span className="flex shrink-0 items-center gap-0.5 pr-1">
                <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-sans text-[11px] text-stone-400 shadow-sm">
                  Ctrl
                </kbd>
                <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-sans text-[11px] text-stone-400 shadow-sm">
                  K
                </kbd>
              </span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100">
              <svg
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100">
              <svg
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((value) => !value)}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-transparent transition-colors hover:border-stone-300"
              >
                <UserAvatar
                  src={user.avatarUrl}
                  name={user.fullName}
                  size="sm"
                  className="h-full w-full"
                />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-10 z-50 w-48 rounded-lg border border-stone-200 bg-white py-1 shadow-md">
                  <button
                    onClick={async () => {
                      await logout()
                      setShowMenu(false)
                      navigate('/login')
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <SignOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

          <GlobalSearchModal
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
        </div>
      )}
    </header>
  )
}
