import { lazy, Suspense } from 'react';
import LoadingSpinner from '@components/common/UI/Loading/Spinner';
import ErrorBoundary from '@components/common/ErrorBoundary/ErrorBoundary';

export const createLazyComponent = (importFn, fallback = <LoadingSpinner />) => {
  const LazyComponent = lazy(importFn);

  const WrappedComponent = (props) => (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );

  // Set a display name for better debugging
  WrappedComponent.displayName = `LazyComponent(${getDisplayName(importFn)})`;

  return WrappedComponent;
};

// Helper to extract component name from import function (optional)
function getDisplayName(importFn) {
  // Attempt to extract file name from importFn.toString()
  // This is just a heuristic and might not be perfect
  const match = importFn.toString().match(/import\(['"](.+)['"]\)/);
  if (match && match[1]) {
    // Extract the file name from the path
    const parts = match[1].split('/');
    const fileName = parts[parts.length - 1];
    return fileName.replace(/\.[^/.]+$/, ''); // remove extension
  }
  return 'Component';
}

// Pre-load components for better UX (optional)
export const preloadComponent = (importFn) => {
  return importFn();
};
