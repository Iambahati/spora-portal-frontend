import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, style, onFocus, onBlur, ...props }, ref) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = "#eb6e03"
      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(235, 110, 3, 0.1)"
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = "#e5e7eb"
      e.currentTarget.style.boxShadow = "none"
      onBlur?.(e)
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        style={{
          height: "2.75rem",
          borderColor: "#e5e7eb",
          backgroundColor: "white",
          transition: "border-color 0.2s, box-shadow 0.2s",
          ...style
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
