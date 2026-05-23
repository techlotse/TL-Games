import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * shadcn/ui-style button. Used for the parent-facing UI (parents can read);
 * toddler-facing actions use the much larger <RoundButton />.
 */
const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-2 rounded-2xl font-bold ' +
    'transition-[transform,background-color] duration-150 ease-calm active:scale-[0.97] ' +
    'disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        solid: 'bg-ink text-background shadow-soft',
        soft: 'bg-surface-2 text-ink',
        outline: 'border-2 border-line bg-surface text-ink',
      },
      size: {
        md: 'h-12 px-5 text-base',
        lg: 'h-16 px-6 text-lg',
        block: 'h-16 w-full px-6 text-lg',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})
