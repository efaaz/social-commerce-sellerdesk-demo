import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus } from "@/types";

const variants = {
  PENDING: "warning",
  CONFIRMED: "secondary",
  DELIVERED: "success",
  CANCELLED: "muted",
} as const;

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={variants[status]}>{ORDER_STATUS_LABELS[status]}</Badge>
  );
}
