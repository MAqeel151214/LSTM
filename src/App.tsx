import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Landing from './pages/Landing.tsx';

const ExplorePage = lazy(() => import('./pages/ExplorePage.tsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.tsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader({ isDark }: { isDark: boolean }) {
  return (
    <div className={`min-h-[70vh] flex flex-col items-center justify-center gap-4 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
      <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-xs font-mono tracking-wider uppercase">Loading experience...</span>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isDark = location.pathname !== '/blog';

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route
            path="/explore"
            element={
              <Suspense fallback={<PageLoader isDark={true} />}>
                <ExplorePage />
              </Suspense>
            }
          />
          <Route
            path="/blog"
            element={
              <Suspense fallback={<PageLoader isDark={false} />}>
                <BlogPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
