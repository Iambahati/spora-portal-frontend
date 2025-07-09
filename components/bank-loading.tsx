'use client'

import { cn } from "@/lib/utils"

interface BankLoadingProps {
  size?: "sm" | "md" | "lg"
  message?: string
  className?: string
}

export default function BankLoading({ 
  size = "md", 
  message = "Loading...", 
  className 
}: BankLoadingProps) {
  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center gap-4 bg-background",
      className
    )}>
      {/* Matrix shimmer loader (Uiverse.io by Shoh2008, Spora colors) */}
      <div className="spora-matrix-loader" aria-label="Loading" />

      {/* Loading Message */}
      <p className={cn(
        "text-muted-foreground text-center font-medium tracking-wide mt-2",
        size === "sm" && "text-base",
        size === "md" && "text-lg",
        size === "lg" && "text-xl"
      )}>
        {message}
      </p>

      {/* Custom animation styles */}
      <style>{`
        /* Spora Matrix Loader: Uiverse.io by Shoh2008, Spora brand colors */
        .spora-matrix-loader {
          width: 45px;
          height: 40px;
          background:
            linear-gradient(#0000 calc(1*100%/6), #eb6e03 0 calc(3*100%/6), #0000 0),
            linear-gradient(#0000 calc(2*100%/6), #040956 0 calc(4*100%/6), #0000 0),
            linear-gradient(#0000 calc(3*100%/6), #eb6e03 0 calc(5*100%/6), #0000 0);
          background-size: 10px 400%;
          background-repeat: no-repeat;
          animation: spora-matrix 1s infinite linear;
        }
        @keyframes spora-matrix {
          0% {
            background-position: 0% 100%, 50% 100%, 100% 100%;
          }
          100% {
            background-position: 0% 0%, 50% 0%, 100% 0%;
          }
        }
      `}</style>
    </div>
  )
}
