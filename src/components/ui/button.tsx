import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-cosmic-blue text-white shadow-md hover:bg-cosmic-blue/90 hover:shadow-lg hover:shadow-cosmic-blue/20 transform hover:-translate-y-0.5",
        primary:
          "bg-gradient-to-r from-cosmic-blue to-cosmic-purple text-white shadow-md hover:shadow-lg hover:shadow-cosmic-blue/20 transform hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-white shadow-md hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/20 transform hover:-translate-y-0.5",
        outline:
          "border border-cosmic-blue/30 bg-background/70 text-cosmic-blue shadow-sm backdrop-blur-sm hover:bg-cosmic-blue/10 hover:border-cosmic-blue/70",
        secondary:
          "bg-cosmic-purple/80 text-white shadow-md hover:bg-cosmic-purple hover:shadow-lg hover:shadow-cosmic-purple/20 transform hover:-translate-y-0.5",
        ghost:
          "text-cosmic-blue hover:bg-cosmic-blue/10 hover:text-cosmic-blue/90",
        link: 
          "text-cosmic-blue underline-offset-4 hover:underline decoration-cosmic-blue/30 hover:decoration-cosmic-blue/70 p-0 h-auto",
        subtle:
          "bg-cosmic-blue/10 text-cosmic-blue hover:bg-cosmic-blue/20",
        success:
          "bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg hover:shadow-green-700/20 transform hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-8 has-[>svg]:px-6 text-base",
        xl: "h-14 rounded-md px-10 has-[>svg]:px-8 text-lg",
        icon: "size-10",
        "icon-sm": "size-8",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, rounded, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
