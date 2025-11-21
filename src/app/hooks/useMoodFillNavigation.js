import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Globally handles click on cards with data-navigate-to, plays mood fill animation, then navigates
export default function useMoodFillNavigation(options = {}) {
  const navigate = useNavigate()
  const durationMs = options.durationMs ?? 900

  useEffect(() => {
    const handleClick = (e) => {
      // Only left click, ignore modified clicks
      if (e.defaultPrevented || e.button !== 0) return

      const card = e.target.closest?.('.diaryList-card[data-navigate-to]')
      if (!card) return

      // If a nested anchor with href was clicked, prevent its default to allow animation
      const link = e.target.closest('a')
      if (link) e.preventDefault();

      const to = card.getAttribute('data-navigate-to')
      if (!to) return

      const rect = card.getBoundingClientRect()
      const clientX = e.clientX
      const clientY = e.clientY
      const xPercent = ((clientX - rect.left) / rect.width) * 100
      const yPercent = ((clientY - rect.top) / rect.height) * 100

      card.style.setProperty('--x', `${xPercent}%`)
      card.style.setProperty('--y', `${yPercent}%`)

      card.classList.remove('is-filling')
      // restart animation
      void card.offsetWidth
      card.classList.add('is-filling')

      window.setTimeout(() => {
        card.classList.remove('is-filling')
        navigate(to)
      }, durationMs)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [navigate, durationMs])
}
