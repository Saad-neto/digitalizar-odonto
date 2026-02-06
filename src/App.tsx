import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import RouterProvider from "./components/RouterProvider";

// Optimized React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Keep unused data in cache for 10 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      // Retry failed requests up to 1 time (reduced from default 3)
      retry: 1,
      // Don't refetch on window focus for better UX
      refetchOnWindowFocus: false,
      // Refetch on mount only if data is stale
      refetchOnMount: 'if-stale',
      // Refetch on reconnect only if data is stale
      refetchOnReconnect: 'if-stale',
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider />
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
