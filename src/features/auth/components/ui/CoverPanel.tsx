import { LogoIcon } from "../../../../shared/components/icons";

export function CoverPanel() {
  return (
    <div className="relative hidden lg:flex flex-col w-[480px] flex-shrink-0 overflow-hidden rounded-2xl">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=960&q=80')`
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
 
      {/* Logo top */}
      <div className="relative z-10 p-8">
        <div className="flex items-center gap-2.5 text-white">
          <LogoIcon />
          <span className="text-lg font-semibold tracking-tight">Lumin</span>
        </div>
      </div>
 
      {/* Bottom text */}
      <div className="relative z-10 mt-auto p-8">
        <p className="text-2xl font-semibold text-white leading-snug mb-2">
          Documents. Organized.<br />Collaborated.
        </p>
        <p className="text-sm text-stone-300">
          Where your team's documents find their safe, smart home.
        </p>
      </div>
    </div>
  );
}