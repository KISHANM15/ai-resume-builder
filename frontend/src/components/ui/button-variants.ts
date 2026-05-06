import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white shadow-md shadow-violet-500/30 hover:brightness-110 hover:shadow-lg hover:shadow-fuchsia-500/25 active:scale-[0.98]',
        secondary:
          'border border-violet-200/80 bg-white/90 text-slate-900 shadow-sm backdrop-blur hover:border-fuchsia-300 hover:bg-gradient-to-r hover:from-violet-50 hover:to-fuchsia-50',
        outline:
          'border-2 border-violet-300/70 bg-white/60 text-violet-950 backdrop-blur hover:border-fuchsia-400 hover:bg-white/90',
        ghost:
          'text-violet-900/90 hover:bg-violet-100/80 hover:text-violet-950',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        link: 'text-violet-700 underline-offset-4 hover:text-fuchsia-600 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-lg px-6',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
