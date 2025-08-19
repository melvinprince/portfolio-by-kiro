import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-b-2 border-primary",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size,
  className,
  label = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className={cn(spinnerVariants({ size }), className)} />
      <span className="sr-only">{label}</span>
    </div>
  );
}
