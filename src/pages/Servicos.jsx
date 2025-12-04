import { useState } from 'react';
import { useData } from '../contexts/DataContext';

const TIPOS_SERVICO = [
  'Manutenção de Computadores',
  'Instalação de Rede',
  'Suporte Técnico',
  'Desenvolvimento de Software',
  'Consultoria em TI',
  'Backup e Recuperação',
  'Segurança da Informação',
  'Cloud Computing',
  'Infraestrutura',
  'Outro'
];

export default function Servicos() {
  const { clientes, servicos, addServico, updateServico, deleteServico, showMessage } = useData();
  const [formData, setFormData] = useState({
    clienteId: '',
    tipoServico: '',
    descricao: '',
    orcamento: '',
    status: 'Em andamento',
    data: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.clienteId || !formData.tipoServico || !formData.orcamento) {
      showMessage('Preencha todos os campos obrigatórios!', 'error');
      return;
    }

    if (parseFloat(formData.orcamento) <= 0) {
      showMessage('O orçamento deve ser maior que zero!', 'error');
      return;
    }

    addServico(formData);
    showMessage('Serviço cadastrado com sucesso!');
    setFormData({
      clienteId: '',
      tipoServico: '',
      descricao: '',
      orcamento: '',
      status: 'Em andamento',
      data: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteServico(id);
      showMessage('Serviço excluído com sucesso!');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateServico(id, { status: newStatus });
    showMessage('Status atualizado!');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Concluído': return '#28a745';
      case 'Em andamento': return '#ffc107';
      case 'Cancelado': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div>
      <div className="card">
        <h2>➕ Solicitar Novo Serviço</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cliente *</label>
            <select
              value={formData.clienteId}
              onChange={(e) => setFormData({...formData, clienteId: e.target.value})}
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
            {clientes.length === 0 && (
              <small style={{ color: '#dc3545' }}>Cadastre um cliente primeiro!</small>
            )}
          </div>

          <div className="form-group">
            <label>Tipo de Serviço *</label>
            <select
              value={formData.tipoServico}
              onChange={(e) => setFormData({...formData, tipoServico: e.target.value})}
              required
            >
              <option value="">Selecione o tipo</option>
              {TIPOS_SERVICO.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              placeholder="Descreva os detalhes do serviço..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Orçamento (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.orcamento}
              onChange={(e) => setFormData({...formData, orcamento: e.target.value})}
              placeholder="500.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({...formData, data: e.target.value})}
            />
          </div>

          <button type="submit" disabled={clientes.length === 0}>
            Cadastrar Serviço
          </button>
        </form>
      </div>

      <div className="card">
        <h2>📋 Lista de Serviços ({servicos.length})</h2>
        {servicos.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Orçamento</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map(servico => {
                const cliente = clientes.find(c => c.id === servico.clienteId);
                return (
                  <tr key={servico.id}>
                    <td>{cliente?.nome || 'Cliente não encontrado'}</td>
                    <td>{servico.tipoServico}</td>
                    <td>{servico.descricao || '-'}</td>
                    <td>R$ {servico.orcamento.toFixed(2)}</td>
                    <td>{new Date(servico.data).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <select 
                        value={servico.status}
                        onChange={(e) => handleStatusChange(servico.id, e.target.value)}
                        style={{ 
                          padding: '5px 10px', 
                          borderRadius: '5px',
                          border: '2px solid',
                          borderColor: getStatusColor(servico.status),
                          color: getStatusColor(servico.status),
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Em andamento">Em andamento</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn-small btn-danger" onClick={() => handleDelete(servico.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>Nenhum serviço cadastrado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}