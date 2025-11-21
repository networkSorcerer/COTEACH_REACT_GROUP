import { useQuery } from '@tanstack/react-query'
import { fetchKoreanAdvice } from '../services/adviceClient'

export function useAdvice(options = {}) {
  const { enabled = true } = options
  return useQuery({
    queryKey: ['advice','korean'],
    queryFn: () => fetchKoreanAdvice(),
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60,    // 60분
    refetchOnWindowFocus: false,
    enabled,
  })
}
