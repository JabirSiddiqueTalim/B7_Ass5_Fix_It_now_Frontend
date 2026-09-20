"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import type { AdminUserListItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { updateUserStatus } from "../_actions/updateUserStatus";

export function BanUserDialog({
  user,
  open,
  onClose,
}: {
  user: AdminUserListItem;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const banning = user.status === "ACTIVE";
  const label = banning ? "Ban" : "Unban";

  function handleConfirm() {
    startTransition(async () => {
      const res = await updateUserStatus(user.id, banning ? "BANNED" : "ACTIVE");
      if (res.success) {
        toast.success(res.message);
        onClose();
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={banning ? "Ban this user?" : "Unban this user?"}
    >
      <p className="text-sm text-muted-foreground">
        {banning ? "This will block " : "This will restore "}
        <span className="font-semibold text-foreground">{user.name}</span>
        {banning
          ? " from the platform. They won\u2019t be able to log in until you unban them."
          : " to the platform. They can log in again."}
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Keep
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={pending}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60",
            banning
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-700 hover:bg-green-800"
          )}
        >
          {pending ? "Updating…" : label}
        </button>
      </div>
    </Dialog>
  );
}
