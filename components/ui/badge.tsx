import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "green"
  | "amber"
  | "red"
  | "blue"
  | "purple"
  | "zinc";

const toneClasses: Record<Tone, string> = {
  neutral: "border-ink/30 bg-ticket text-steel",
  green: "border-green-800/50 bg-ticket text-green-900 dark:border-green-500/50 dark:text-green-300",
  amber: "border-amber-800/50 bg-ticket text-amber-900 dark:border-amber-500/50 dark:text-amber-300",
  red: "border-red-700/50 bg-ticket text-red-800 dark:border-red-500/50 dark:text-red-300",
  blue: "border-blue-800/50 bg-ticket text-blue-900 dark:border-blue-500/50 dark:text-blue-300",
  purple: "border-purple-800/50 bg-ticket text-purple-900 dark:border-purple-500/50 dark:text-purple-300",
  zinc: "border-ink/30 bg-ticket text-steel",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
