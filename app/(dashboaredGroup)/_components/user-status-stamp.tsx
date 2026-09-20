import type { UserStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function UserStatusStamp({ status }: { status: UserStatus }) {
  const banned = status === "BANNED";

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-[2px] border-2 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em]",
        banned
          ? "-rotate-2 border-safety text-safety shadow-[2px_2px_0_rgba(255,90,31,0.3)]"
          : "rotate-[-1deg] border-ink/55 text-ink/70"
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}
