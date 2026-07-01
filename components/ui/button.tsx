import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Motion (emil): press feedback via scale(0.97) on :active, fast 120ms ease-out.
// Hover effects gated behind a pointer/hover media query in Tailwind would need
// a plugin; instead we keep hover subtle and rely on transform for press.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-[transform,background-color,color,border-color,box-shadow] duration-200 ease-out-strong hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:hover:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-navy text-cream hover:bg-navy-700 shadow-sm",
        gold: "bg-gold text-navy shadow-sm hover:bg-gold-pale hover:shadow-[0_8px_24px_-10px_rgba(201,169,97,0.7)]",
        outline:
          "border border-navy/20 bg-transparent text-navy hover:bg-navy/5",
        "outline-light":
          "border border-cream/30 bg-cream/0 text-cream hover:bg-cream/10",
        ghost: "bg-transparent text-navy hover:bg-navy/5",
        link: "text-gold-deep underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-sm",
        default: "h-11 px-5 py-2",
        lg: "h-12 rounded-md px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
