import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 disabled:pointer-events-none disabled:opacity-50 outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground  shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground border-foreground shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground  shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none",
        ghost:
          "hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        noShadow: "bg-primary text-primary-foreground hover:bg-primary/90",
        reverse:
          "bg-primary text-primary-foreground  hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_var(--color-foreground)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
