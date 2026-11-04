import { CalendarDays, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({
  pageTitle,
  onOpenMenu,
}: {
  pageTitle: string;
  onOpenMenu: () => void;
}) {
  const today = new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <Menu />
        </Button>
        <div className="text-sm text-muted-foreground">
          Workspace <span className="px-1.5">/</span>
          <span className="font-semibold text-foreground">{pageTitle}</span>
        </div>
      </div>
      <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
        <CalendarDays className="size-4" />
        {today}
      </div>
    </header>
  );
}
