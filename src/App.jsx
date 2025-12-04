import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import Avaliacoes from './pages/Avaliacoes';

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="servicos" element={<Servicos />} />
            <Route path="avaliacoes" element={<Avaliacoes />} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;