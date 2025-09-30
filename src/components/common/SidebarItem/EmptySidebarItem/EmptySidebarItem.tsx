import { cn } from "@/lib/utils";

interface EmptySidebarItemProps {
  message?: string;
  className?: string;
}

export function EmptySidebarItem({
  message = "No models available",
  className,
}: EmptySidebarItemProps) {
  return (
    <div
      className={cn(
        "w-full pl-6 py-2 text-xs text-muted-foreground/60",
        className
      )}
    >
      {message}
    </div>
  );
}
