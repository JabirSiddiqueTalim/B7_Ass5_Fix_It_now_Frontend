export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-ink/30 bg-ticket-hi px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-ticket text-2xl text-steel">
        ◌
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-steel">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
