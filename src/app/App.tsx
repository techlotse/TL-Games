import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { AppShell } from '@/components/layout/AppShell'
import { useCalmMotion } from '@/lib/motion'
import { ROUTES } from './routes'

export function App() {
  const screen = useAppStore((s) => s.screen)
  const calm = useCalmMotion()
  const Screen = ROUTES[screen]

  return (
    <AppShell>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={screen}
          className="absolute inset-0 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: calm ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Screen />
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}
