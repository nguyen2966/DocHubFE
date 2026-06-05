import Logo from "../../assets/folio_logo.png";
import Avatar from "../../assets/avatar.png";
import { useAuthStore } from "../hooks/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignOut } from "@phosphor-icons/react";

export function Header( {showFunctions } ) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center w-full h-15 bg-white border-b border-gray-200 px-4 gap-4">
      {/* Brand — 20% */}
      <div className= "flex items-center gap-2 w-1/6 min-w-0 flex-shrink-0 border-r border-gray-200 self-stretch px-4">
        <img
          src={Logo}
          alt="Folio logo"
          className="w-10 h-10 flex-shrink-0"
        />
        <span className="text-[20px] font-medium text-gray-900 truncate">
          Folio
        </span>
      </div>

      {(user  && showFunctions) && (
        <>
          {/* Search bar */}
          <div className="flex items-center gap-2 flex-1 h-8 px-3 bg-gray-50 border border-gray-200 rounded-md ">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
            </svg>
            <span className="text-sm text-gray-400 flex-1">Search documents across all Workspaces...</span>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <kbd className="text-[11px] text-gray-400 bg-white  rounded px-1 py-0.5">⌘</kbd>
              <kbd className="text-[11px] text-gray-400 bg-white  rounded px-1 py-0.5">K</kbd>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 flex-shrink-0 border-l border-gray-200 self-stretch px-4">
            {/* Bell */}
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </button>

            {/* Help */}
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </button>

            {/* Avatar + dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-gray-300 transition-colors"
              >
                <img
                  src={Avatar}
                  alt={user.fullName ?? "Avatar"}
                  className="w-full h-full object-cover"
                />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-md py-1 z-50">
                  <button
                    onClick={async () => {
                      await logout();
                      setShowMenu(false);
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 transition-colors"
                  >
                    <SignOut />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}