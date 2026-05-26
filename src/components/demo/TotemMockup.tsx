type Props = { children: React.ReactNode };

export function TotemMockup({ children }: Props) {
  return (
    <div className="relative w-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -inset-x-4 -bottom-4 top-4 rounded-[28px] bg-black/20 blur-2xl" />

      {/* Device body */}
      <div
        className="relative rounded-t-[10px] bg-[#1c1c1e]"
        style={{
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.45)",
        }}
      >
        {/* Edge highlight — bright top/left, dark bottom/right */}
        <div className="pointer-events-none absolute inset-0 rounded-t-[10px] ring-1 ring-inset ring-white/[0.13]" />
        <div className="pointer-events-none absolute inset-0 rounded-t-[10px] shadow-[inset_-1px_-1px_0_0_rgba(0,0,0,0.5)]" />

        {/* Diagonal stripe reflection */}
        <div
          className="pointer-events-none absolute inset-0 rounded-t-[10px]"
          style={{
            background:
              "linear-gradient(135deg, transparent 28%, rgba(255,255,255,0.055) 42%, rgba(255,255,255,0.035) 50%, transparent 64%)",
          }}
        />

        {/* Top bar */}
        <div className="py-3" />

        {/* Screen */}
        <div className="relative mx-[10px] overflow-hidden">
          {children}
          {/* Screen glare */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 45%)",
            }}
          />
        </div>

        {/* Chin */}
        <div className="h-20 bg-[#1c1c1e]" />
      </div>
    </div>
  );
}
