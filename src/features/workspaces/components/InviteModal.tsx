import { useState, useRef, useEffect, useCallback } from "react";
import { UserSearchResult, InviteResult } from "../types/workspace.type";
import { workspaceService } from '../services/workspace.service';
import { EmailTag } from "./EmailTags";
import { useWorkspaceDetail } from "../hooks/useWorkspaceDetail";
import { getWorkspaceAvatar } from "../../../helper/avatar-random";
import { UserAvatar } from "../../../shared/components/UserAvatar";

export function InviteModal({
  workspaceId,
  onClose,
  onInvited,
}: {
  workspaceId: string
  onClose: () => void
  onInvited: () => void
}) {
  const { workspace } = useWorkspaceDetail(workspaceId);
  const [input, setInput] = useState('')
  const [emails, setEmails] = useState<string[]>([])
  const [role, setRole] = useState<'admin' | 'member'>('member')
  const [suggestions, setSuggestions] = useState<UserSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [results, setResults] = useState<InviteResult[] | null>(null)
  const [roleOpen, setRoleOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const isDone = results !== null;

  // Search logic với Debounce
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (input.length < 1) { setSuggestions([]); return }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await workspaceService.searchUsers(input, workspaceId);
        // Loại trừ các email đã được add tag
        setSuggestions(res.filter(u => !emails.includes(u.email)));
      } catch {
        setSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [input, workspaceId, emails])

  const addEmail = useCallback((email: string) => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || emails.includes(trimmed)) return
    setEmails(prev => [...prev, trimmed])
    setInput('')
    setSuggestions([])
    inputRef.current?.focus()
  }, [emails])

  const removeEmail = (email: string) => setEmails(prev => prev.filter(e => e !== email))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addEmail(input)
    }
    if (e.key === 'Backspace' && !input && emails.length) {
      removeEmail(emails[emails.length - 1])
    }
  }

  const handleInvite = async () => {
    if (!emails.length) return
    setIsInviting(true)
    try {
      const res = await workspaceService.inviteMembers(workspaceId, emails, role);
      setResults(res);
      if (res.some(r => r.status === 'invited')) onInvited();
    } catch { } finally { setIsInviting(false) }
  }

  // Kiểm tra xem input hiện tại đã khớp hoàn toàn với user nào trong danh sách search chưa
  const cleanInput = input.trim().toLowerCase();
  const hasExactMatch = suggestions.some(s => s.email.toLowerCase() === cleanInput);
  const showUnregistered = cleanInput.length > 0 && !hasExactMatch && cleanInput.includes('@');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-[460px] mx-4 overflow-visible border border-stone-100">

        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <h2 className="text-[19px] font-medium text-stone-900 tracking-tight">Invite member</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors p-1 mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Workspace Info Card */}
          <div className="flex items-center gap-3.5 p-3.5 border border-stone-200/60 rounded-[14px] bg-white">
            <img
              src={getWorkspaceAvatar(workspaceId, workspace?.name)}
              alt={workspace?.name || 'Workspace'}
              className="w-10 h-10 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-[14px] font-medium text-stone-900 truncate">{workspace?.name || 'Workspace Name'}</h3>
              <p className="text-xs text-stone-400 font-normal truncate mt-0.5">The central hub for design collaboration.</p>
            </div>
          </div>

          {!isDone ? (
            <>
              {/* Email Input */}
              <div className="relative">
                <label className="text-[13px] font-medium text-stone-800 block mb-1.5">Email addresses</label>
                <div
                  className="min-h-[44px] w-full border border-stone-200 rounded-xl px-3 py-1.5 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-stone-900/5 focus-within:border-stone-400/80 transition-all cursor-text bg-white"
                  onClick={() => inputRef.current?.focus()}
                >
                  {emails.map(email => (
                    <EmailTag key={email} email={email} onRemove={() => removeEmail(email)} />
                  ))}
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. abc@lumin.com"
                    className="flex-1 min-w-[120px] outline-none text-[13.5px] text-stone-800 placeholder:text-stone-400 bg-transparent py-0.5"
                  />
                </div>

                {/* Suggestions Dropdown (Bao gồm cả Unregistered User) */}
                {(suggestions.length > 0 || isSearching || showUnregistered) && (
                  <div className="absolute z-[70] top-full left-0 right-0 mt-1.5 max-h-[248px] overflow-y-auto rounded-xl border border-stone-200/80 bg-white shadow-lg">
                    {isSearching && <div className="px-4 py-3 text-xs text-stone-400 font-normal animate-pulse">Searching...</div>}

                    {/* Render Registered Users */}
                    {suggestions.map(u => {
                      const isJoined = u.isMember;
                      return (
                        <button
                          key={u.email}
                          disabled={isJoined}
                          onClick={() => addEmail(u.email)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isJoined ? 'opacity-50 cursor-not-allowed bg-stone-50/20' : 'hover:bg-stone-50'
                            }`}
                        >
                          <UserAvatar
                            src={u.avatarUrl}
                            name={u.fullName ?? u.email}
                            size="sm"
                            className="h-8 w-8 shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[13.5px] font-medium text-stone-800 truncate">{u.fullName || u.email.split('@')[0]}</p>
                              {isJoined && (
                                <span className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] font-normal text-stone-500">Joined</span>
                              )}
                            </div>
                            <p className="text-xs text-stone-400 font-normal truncate mt-0.5">{u.email}</p>
                          </div>
                        </button>
                      );
                    })}

                    {/* Render Unregistered User Case (Khi không tìm thấy bản ghi trùng khớp trên hệ thống) */}
                    {showUnregistered && (
                      <button
                        onClick={() => addEmail(input)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 transition-colors text-left border-t border-stone-100"
                      >
                        <UserAvatar
                            name={input.trim()}
                            size="sm"
                            className="h-8 w-8 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] font-medium text-red-500">Unregistered user</p>
                          <p className="text-xs text-stone-400 font-normal truncate mt-0.5">{input.trim()}</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Role Selector */}
              <div className="relative">
                <label className="text-[13px] font-medium text-stone-800 block mb-1.5">Role</label>
                <button
                  onClick={() => setRoleOpen(!roleOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-stone-200 rounded-xl text-[13.5px] text-stone-700 hover:bg-stone-50 transition-all bg-white"
                >
                  <span className="capitalize font-normal">{role}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-stone-500 transition-transform ${roleOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {roleOpen && (
                  <div className="absolute z-[70] top-full mt-1.5 w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
                    {(['member', 'admin'] as const).map(r => (
                      <button
                        key={r}
                        onClick={() => { setRole(r); setRoleOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-stone-50 transition-colors ${role === r ? 'bg-stone-50' : ''}`}
                      >
                        <p className="text-[13.5px] font-medium text-stone-800 capitalize">{r}</p>
                        <p className="text-xs text-stone-400 font-normal mt-0.5">{r === 'member' ? 'Can create & edit documents' : 'Full access to settings'}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Results View */
            <div className="space-y-2">
              <p className="text-[13px] font-medium text-stone-800">Results</p>
              <div className="flex flex-wrap gap-1.5">
                {results.map(r => <EmailTag key={r.email} email={r.email} result={r} onRemove={() => { }} />)}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 -mx-6 px-6 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13.5px] font-medium text-stone-600 hover:bg-stone-50 rounded-xl border border-stone-200/60 transition-colors"
            >
              {isDone ? 'Close' : 'Cancel'}
            </button>
            {!isDone && (
              <button
                onClick={handleInvite}
                disabled={!emails.length || isInviting}
                className="px-5 py-2 text-[13.5px] font-medium bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isInviting ? 'Inviting...' : 'Invite'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
