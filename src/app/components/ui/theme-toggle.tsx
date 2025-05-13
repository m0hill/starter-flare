import { cn } from '@/app/lib/utils'
import { Moon, Sun } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { Theme, useTheme } from 'remix-themes'

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useTheme()
  const isDark = theme === Theme.DARK

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? Theme.LIGHT : Theme.DARK)
  }, [isDark, setTheme])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'D') {
        toggleTheme()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [toggleTheme])

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme (Shift+D)`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme (Shift+D)`}
      className={cn(
        'relative h-7 w-14 rounded-full transition-colors duration-200 shadow-sm',
        isDark ? 'bg-black' : 'bg-gray-200',
        className
      )}
    >
      <span
        className={cn(
          'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200',
          isDark ? 'left-1' : 'left-8'
        )}
      />
      <span
        className={cn(
          'absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center',
          isDark ? 'text-gray-400' : 'text-black'
        )}
      >
        {!isDark && <Sun size={12} strokeWidth={2.5} />}
      </span>
      <span
        className={cn(
          'absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center',
          isDark ? 'text-white' : 'text-gray-400'
        )}
      >
        {isDark && <Moon size={12} strokeWidth={2.5} />}
      </span>
    </button>
  )
}
