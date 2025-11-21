 import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
 import { useState } from 'react'

 export function AppQueryProvider({ children }) {
   const [client] = useState(
     () =>
       new QueryClient({
         defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 30000 } }
       })
   )
   return <QueryClientProvider client={client}>{children}</QueryClientProvider>
 }
