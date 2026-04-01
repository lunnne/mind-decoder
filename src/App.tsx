import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';
import PlayPage from './pages/PlayPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/result/:shareId" element={<ResultPage />} />
        <Route path="/play/:slug" element={<PlayPage />} />
      </Routes>
    </BrowserRouter>
  );
}
