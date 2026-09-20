"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Category, Service } from "@/lib/types";
import { cn, formatBDT } from "@/lib/utils";
import { createService } from "../_actions/createService";

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

export function ServicesBoard({
  services,
  categories,
}: {
  services: Service[];
  categories: Category[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]?.name ?? "");
  const [price, setPrice] = useState("");
  const [durationMins, setDurationMins] = useState("");

  function reset() {
    setTitle("");
    setDescription("");
    setCategory(categories[0]?.name ?? "");
    setPrice("");
    setDurationMins("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const res = await createService({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        price: Number(price),
        durationMins: durationMins === "" ? undefined : Number(durationMins),
      });

      if (res.success) {
        toast.success(res.message);
        reset();
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
          Workshop file · services
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
          Services
        </h2>
        <p className="text-sm text-steel">
          What you offer, at what price — customers book these directly.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-safety">
            On your board · {services.length}
          </p>

          {services.length > 0 ? (
            <ul className="mt-3 space-y-4">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="rounded-md border-2 border-ink bg-bone p-5 shadow-[4px_4px_0_rgba(33,30,25,0.1)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg font-bold text-ink">
                        {service.title}
                      </p>
                      {service.description && (
                        <p className="mt-1 text-sm text-steel">
                          {service.description}
                        </p>
                      )}
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-steel/70">
                        {service.durationMins} min
                        {service.isActive ? (
                          <span className="ml-3 text-safety">· active</span>
                        ) : (
                          <span className="ml-3 text-steel">· inactive</span>
                        )}
                      </p>
                    </div>
                    <span className="font-display text-xl font-bold text-ink">
                      {formatBDT(service.price)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 rounded-md border-2 border-dashed border-ink/30 bg-ticket-hi px-6 py-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-steel">
                Nothing on file
              </p>
              <p className="mt-2 font-display text-xl font-bold text-ink">
                No services yet.
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-steel">
                Add your first service on the right — pick a category and set a
                price.
              </p>
            </div>
          )}
        </section>

        <aside className="h-fit rounded-md border-2 border-ink bg-bone p-5 shadow-[4px_4px_0_rgba(33,30,25,0.1)] lg:sticky lg:top-24">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-safety">
            Add a service
          </p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field label="Title" htmlFor="svc-title">
              <input
                id="svc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
                className={inputCls}
                placeholder="Pipe Leak Repair"
              />
            </Field>
            <Field label="Description" htmlFor="svc-desc">
              <textarea
                id="svc-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={cn(inputCls, "resize-y")}
                placeholder="Fix leaking pipes at home…"
              />
            </Field>
            <Field label="Category" htmlFor="svc-category">
              <select
                id="svc-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className={inputCls}
              >
                {categories.length === 0 && (
                  <option value="">No categories loaded</option>
                )}
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (৳)" htmlFor="svc-price">
                <input
                  id="svc-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className={inputCls}
                  placeholder="350"
                />
              </Field>
              <Field label="Duration (min)" htmlFor="svc-duration">
                <input
                  id="svc-duration"
                  type="number"
                  min="1"
                  step="1"
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value)}
                  className={inputCls}
                  placeholder="60"
                />
              </Field>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-sm border-2 border-ink bg-ink px-4 py-2.5 font-display text-sm font-bold text-bone transition-colors hover:bg-safety hover:text-ink disabled:pointer-events-none disabled:opacity-50"
            >
              {pending ? "Adding…" : "Add service"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
