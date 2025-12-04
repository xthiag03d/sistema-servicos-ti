import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

const INITIAL_DATA = {
  clientes: [
    { id: 1, nome: 'Empresa ABC Ltda', email: 'contato@abc.com', telefone: '(11) 98765-4321' },
    { id: 2, nome: 'Tech Solutions SA', email: 'suporte@techsol.com', telefone: '(11) 91234-5678' }
  ],
  servicos: [
    { 
      id: 1, 
      clienteId: 1, 
      tipoServico: 'Manutenção de Computadores', 
      descricao: 'Limpeza e manutenção preventiva', 
      orcamento: 500, 
      status: 'Concluído', 
      data: '2025-11-15' 
    },
    { 
      id: 2, 
      clienteId: 2, 
      tipoServico: 'Instalação de Rede', 
      descricao: 'Instalação de rede cabeada', 
      orcamento: 1200, 
      status: 'Concluído', 
      data: '2025-11-20' 
    },
    { 
      id: 3, 
      clienteId: 1, 
      tipoServico: 'Suporte Técnico', 
      descricao: 'Suporte remoto', 
      orcamento: 300, 
      status: 'Em andamento', 
      data: '2025-12-01' 
    }
  ],
  avaliacoes: [
    { id: 1, servicoId: 1, nota: 5, comentario: 'Excelente atendimento!' },
    { id: 2, servicoId: 2, nota: 4, comentario: 'Muito bom, rápido e eficiente.' }
  ]
};

export const DataProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const savedClientes = localStorage.getItem('clientes');
    const savedServicos = localStorage.getItem('servicos');
    const savedAvaliacoes = localStorage.getItem('avaliacoes');

    setClientes(savedClientes ? JSON.parse(savedClientes) : INITIAL_DATA.clientes);
    setServicos(savedServicos ? JSON.parse(savedServicos) : INITIAL_DATA.servicos);
    setAvaliacoes(savedAvaliacoes ? JSON.parse(savedAvaliacoes) : INITIAL_DATA.avaliacoes);
  }, []);

  useEffect(() => {
    if (clientes.length > 0) localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    if (servicos.length > 0) localStorage.setItem('servicos', JSON.stringify(servicos));
  }, [servicos]);

  useEffect(() => {
    if (avaliacoes.length > 0) localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
  }, [avaliacoes]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const addCliente = (cliente) => {
    const newCliente = { ...cliente, id: Date.now() };
    setClientes([...clientes, newCliente]);
    return newCliente;
  };

  const updateCliente = (id, cliente) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, ...cliente } : c));
  };

  const deleteCliente = (id) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  const addServico = (servico) => {
    const newServico = { 
      ...servico, 
      id: Date.now(),
      clienteId: parseInt(servico.clienteId),
      orcamento: parseFloat(servico.orcamento)
    };
    setServicos([...servicos, newServico]);
    return newServico;
  };

  const updateServico = (id, servico) => {
    setServicos(servicos.map(s => s.id === id ? { ...s, ...servico } : s));
  };

  const deleteServico = (id) => {
    setServicos(servicos.filter(s => s.id !== id));
  };

  const addAvaliacao = (avaliacao) => {
    const newAvaliacao = { 
      ...avaliacao, 
      id: Date.now(),
      servicoId: parseInt(avaliacao.servicoId)
    };
    setAvaliacoes([...avaliacoes, newAvaliacao]);
    return newAvaliacao;
  };

  const deleteAvaliacao = (id) => {
    setAvaliacoes(avaliacoes.filter(a => a.id !== id));
  };

  const value = {
    clientes,
    servicos,
    avaliacoes,
    message,
    showMessage,
    addCliente,
    updateCliente,
    deleteCliente,
    addServico,
    updateServico,
    deleteServico,
    addAvaliacao,
    deleteAvaliacao
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};