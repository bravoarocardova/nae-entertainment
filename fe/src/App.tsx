import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { ThemeProvider } from './components/theme-provider';
import { MusicProvider } from './contexts/MusicContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import VideoPage from './pages/VideoPage';
import MusicPage from './pages/MusicPage';
import MusicPlayerPage from './pages/MusicPlayerPage';

function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800
    });
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MusicProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="video" element={<VideoPage />} />
              <Route path="music" element={<MusicPage />} />
            </Route>
            <Route path="/music/play" element={<MusicPlayerPage />} />
          </Routes>
        </BrowserRouter>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;
