import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { TodoProvider } from './context/TodoContext';
import { ThemeProvider } from './context/ThemeContext';
import NavBar from './components/NavBar';
import CloudBackground from './components/CloudBackground';
import Home from './pages/Home';
import TaskPage from './pages/TaskPage';
import CategoriesPage from './pages/CategoriesPage';
import StatsPage from './pages/StatsPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<Home />} />
        <Route path="/task/:id"   element={<TaskPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/stats"      element={<StatsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <TodoProvider>
          <CloudBackground />
          <AnimatedRoutes />
          <NavBar />
        </TodoProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
