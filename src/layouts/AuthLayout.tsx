import { ReactNode } from "react";
import Logo from '../assets/folio_logo.png';
import CoverImage from "../assets/auth_page.png";

function CoverPanel() {
  return (
    <div className="relative hidden lg:block w-[600px] shrink-0 overflow-hidden rounded-xl">
      <img
        src={CoverImage}
        alt="Folio workspace"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex h-full flex-col px-14 py-32 text-stone-900">
        <div>
          <img src={Logo} alt="Folio logo" className="mb-6 h-11 w-11" />

          <h2 className="mb-4 text-[28px] font-semibold tracking-tight">
            Folio
          </h2>

          <p className="mb-3 text-base font-semibold">
            Documents. Organized. Collaborated.
          </p>

          <p className="max-w-[290px] text-sm leading-6 text-stone-600">
            Where your team's documents find their safe, smart home.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 p-3">
      <div className="flex min-h-[calc(100vh-24px)] w-full overflow-hidden bg-white p-5">
        <CoverPanel />

        <div className="flex flex-1 items-center justify-center px-10">
          <div className="w-full max-w-[500px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}