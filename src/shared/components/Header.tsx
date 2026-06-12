import Logo from "../../assets/folio_logo.png";
import Avatar from "../../assets/avatar.png";
import { useAuthStore } from "../hooks/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignOut } from "@phosphor-icons/react";

export function Header({ showFunctions }) {
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
    // Đồng bộ border sang hệ màu stone để tiệp màu với Sidebar
    <header className="flex items-center w-full h-16 bg-white border-b border-stone-200 px-0">

      {/* SỬA TẠI ĐÂY: Khối chứa Logo đổi thành w-64 cố định, border-stone-200 
        và px-6 để khoảng cách thụt lề của Logo bằng đúng khoảng cách của menu Sidebar
      */}
      <div className="flex items-center gap-3 w-70 h-full flex-shrink-0 border-r border-stone-200 px-6">
        <img
          src={Logo}
          alt="Folio logo"
          className="w-10 h-10 flex-shrink-0"
        />
        <span className="text-[20px] font-bold text-stone-900 truncate tracking-tight">
          Folio
        </span>
      </div>

      {/* Phần bên phải của Header - tăng px-6 để nội dung thoáng đạt */}
      {(user && showFunctions) && (
        <div className="flex flex-1 items-center justify-between px-6 gap-4">

          {/* Search bar */}
          {/* Frame 7 - Khối bọc thanh search đúng chuẩn CSS Figma */}
          <div className="flex h-16 w-full max-w-[1008px] flex-col items-start justify-center pl-4 pr-2 py-4 gap-2 border-r border-stone-200 flex-shrink-0 flex-grow">

            {/* Thanh tìm kiếm bên trong - ĐÃ ĐỔI TỪ max-w-xl THÀNH w-full ĐỂ KÉO GIÃN RỘNG RA */}
            <div className="flex items-center gap-2 w-full h-9 px-3 bg-stone-50 border border-stone-200 rounded-md transition-all focus-within:bg-white focus-within:border-stone-400 focus-within:shadow-sm">

              {/* Kính lúp */}
              <svg className="w-4 h-4 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
              </svg>

              {/* Ô input nhập chữ */}
              <input
                type="text"
                placeholder="Search documents across all Workspaces..."
                className="text-sm text-stone-600 placeholder-stone-400 bg-transparent flex-1 outline-none border-none p-0 focus:ring-0"
              />

              {/* Phím tắt ⌘ K nằm sát rìa bên phải */}
              <div className="flex items-center gap-0.5 flex-shrink-0 select-none pr-1">
                <kbd className="text-[11px] text-stone-400 bg-white border border-stone-200 rounded px-1.5 py-0.5 shadow-sm font-sans">⌘</kbd>
                <kbd className="text-[11px] text-stone-400 bg-white border border-stone-200 rounded px-1.5 py-0.5 shadow-sm font-sans">K</kbd>
              </div>
            </div>

          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Bell */}
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-stone-100 text-stone-500 transition-colors">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </button>

            {/* Help */}
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-stone-100 text-stone-500 transition-colors">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </button>

            {/* Avatar + dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-stone-300 transition-colors flex items-center justify-center"
              >
                <img
                  src={Avatar}
                  alt={user.fullName ?? "Avatar"}
                  className="w-full h-full object-cover"
                />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-10 w-48 bg-white border border-stone-200 rounded-lg shadow-md py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={async () => {
                      await logout();
                      setShowMenu(false);
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <SignOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </header>
  );
}