import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * App frame.
 *
 * Full viewport height, constrained to a comfortable phone-width column so
 * the touch layout stays consistent on tablets and desktop too. Safe-area
 * insets are handled by individual screens via the `safe-*` utilities.
 */
export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="flex h-full w-full justify-center bg-background">
      <main
        className={cn(
          'relative flex h-full w-full max-w-[34rem] flex-col overflow-hidden bg-background',
          className,
        )}
      >
        {children}
      </main>
    </div>
  )
}
