"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      style={{ fontFamily: "inherit", overflowWrap: "anywhere" }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "bg-background text-foreground border-border border-2 font-medium shadow-[4px_4px_0px_0px_var(--color-foreground)] rounded-md text-[13px] flex items-center gap-2.5 p-4 w-[356px] [&:has(button)]:justify-between",
          description: "text-sm",
          actionButton:
            "text-sm border-2 text-[12px] h-6 px-2 bg-primary text-primary-foreground border-foreground rounded-md shrink-0 shadow-[2px_2px_0px_0px_var(--color-foreground)]",
          cancelButton:
            "text-sm border-2 text-[12px] h-6 px-2 bg-background text-foreground border-foreground rounded-md shrink-0 shadow-[2px_2px_0px_0px_var(--color-foreground)]",
          error: "bg-black text-white",
          loading:
            "[&[data-sonner-toast]_[data-icon]]:flex [&[data-sonner-toast]_[data-icon]]:size-4 [&[data-sonner-toast]_[data-icon]]:relative [&[data-sonner-toast]_[data-icon]]:justify-start [&[data-sonner-toast]_[data-icon]]:items-center [&[data-sonner-toast]_[data-icon]]:flex-shrink-0",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
