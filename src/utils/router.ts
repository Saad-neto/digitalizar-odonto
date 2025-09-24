// Utility to detect if SPA routing is working and fallback to hash routing if needed
export const detectRoutingSupport = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return true;
  
  // Check if we can use history API
  if (!window.history || !window.history.pushState) return false;
  
  // Check if current URL suggests server-side routing is working
  const currentPath = window.location.pathname;
  const isRouteWorking = currentPath === '/' || !currentPath.includes('/index.html');
  
  return isRouteWorking;
};

export const getRouterType = () => {
  const isProductionWithoutSPASupport = 
    import.meta.env.PROD && 
    !detectRoutingSupport() && 
    window.location.pathname !== '/';
    
  return isProductionWithoutSPASupport ? 'hash' : 'browser';
};