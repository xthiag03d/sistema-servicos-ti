import { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function Clientes() {
  const { clientes, addCliente, updateCliente, deleteCliente, showMessage } = useData();
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.telefone) {
      showMessage('Preencha todos os campos!', 'error');
      return;
    }

    if (editingId) {
      updateCliente(editingId, formData);
      showMessage('Cliente atualizado com sucesso!');
      setEditingId(null);
    } else {
      addCliente(formData);
      showMessage('Cliente cadastrado com sucesso!');
    }

    setFormData({ nome: '', email: '', telefone: '' });
  };

  const handleEdit = (cliente) => {
    setFormData({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone });
    setEditingId(cliente.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteCliente(id);
      showMessage('Cliente excluído com sucesso!');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ nome: '', email: '', telefone: '' });
  };

  return (
    <div>
      <div className="card">
        <h2>{editingId ? '✏️ Editar Cliente' : '➕ Cadastrar Novo Cliente'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome/Empresa *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              placeholder="Ex: Empresa ABC Ltda"
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="contato@empresa.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Telefone *</label>
            <input
              type="text"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              placeholder="(11) 98765-4321"
              required
            />
          </div>
          <div>
            <button type="submit">
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>📋 Lista de Clientes ({clientes.length})</h2>
        {clientes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nome/Empresa</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone}</td>
                  <td>
                    <button className="btn-small" onClick={() => handleEdit(cliente)}>
                      Editar
                    </button>
                    <button className="btn-small btn-danger" onClick={() => handleDelete(cliente.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>Nenhum cliente cadastrado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}