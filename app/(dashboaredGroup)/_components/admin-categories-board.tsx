"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AdminCategoryListItem } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { createCategory } from "../_actions/createCategory";
import { EmptyState } from "./empty-state";

const labelCls =
  "font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-steel";
const inputCls =
  "mt-1.5 w-full rounded-sm border-2 border-ink/30 bg-bone px-3 py-2 text-sm text-ink placeholder:text-ink/30 focus:border-safety focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function AdminCategoriesBoard({
  categories,
}: {
  categories: AdminCategoryListItem[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const res = await createCategory({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      if (res.success) {
        toast.success(res.message);
        setName("");
        setDescription("");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="space-y-6 animate-ticket">
      <header className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-safety">
          Operations · service directory
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Categories
        </h2>
        <p className="text-sm text-steel">
          The service directory technicians list their work under.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-safety">
            On file · {categories.length}
          </p>

          {categories.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="rounded-md border-2 border-ink bg-bone p-5 shadow-[4px_4px_0_rgba(33,30,25,0.1)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg font-bold text-ink">
                        {category.name}
                      </p>
                      {category.description && (
                        <p className="mt-1 text-sm text-steel">
                          {category.description}
                        </p>
                      )}
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-steel/70">
                        {category._count?.services ?? 0} service
                        {(category._count?.services ?? 0) === 1 ? "" : "s"} ·
                        added {formatDate(category.createdAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]",
                        category.isActive
                          ? "border-green-700/60 bg-green-50 text-green-900"
                          : "border-ink/30 bg-muted text-muted-foreground"
                      )}
                    >
                      <span
                        className="size-1.5 rounded-full bg-current"
                        aria-hidden
                      />
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3">
              <EmptyState
                title="No categories yet."
                description="Add the first category on the right."
                actionHref="/admin-dashboard/categories"
                actionLabel="Add a category"
              />
            </div>
          )}
        </section>

        <aside className="h-fit rounded-md border-2 border-ink bg-bone p-5 shadow-[4px_4px_0_rgba(33,30,25,0.1)] lg:sticky lg:top-24">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-safety">
            Add a category
          </p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field label="Name" htmlFor="cat-name">
              <input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className={inputCls}
                placeholder="Gardening"
              />
            </Field>
            <Field label="Description" htmlFor="cat-desc">
              <textarea
                id="cat-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(inputCls, "resize-y")}
                placeholder="Garden maintenance and landscaping…"
              />
            </Field>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-sm border-2 border-ink bg-ink px-4 py-2.5 font-display text-sm font-bold text-bone transition-colors hover:bg-safety hover:text-ink disabled:pointer-events-none disabled:opacity-50"
            >
              {pending ? "Adding…" : "Add category"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
