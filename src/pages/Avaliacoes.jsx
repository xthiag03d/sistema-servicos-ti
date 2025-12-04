import { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function Avaliacoes() {
  const { clientes, servicos, avaliacoes, addAvaliacao, deleteAvaliacao, showMessage } = useData();
  const [formData, setFormData] = useState({
    servicoId: '',
    nota: 0,
    comentario: ''
  });
  const [hoverRating, setHoverRating] = useState(0);

  const servicosConcluidos = servicos.filter(s => s.status === 'Concluído');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.servicoId) {
      showMessage('Selecione um serviço!', 'error');
      return;
    }

    if (formData.nota === 0) {
      showMessage('Selecione uma nota!', 'error');
      return;
    }

    if (avaliacoes.some(a => a.servicoId === parseInt(formData.servicoId))) {
      showMessage('Este serviço já foi avaliado!', 'error');
      return;
    }

    addAvaliacao(formData);
    showMessage('Avaliação cadastrada com sucesso!');
    setFormData({ servicoId: '', nota: 0, comentario: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      deleteAvaliacao(id);
      showMessage('Avaliação excluída com sucesso!');
    }
  };

  const calcularNotaMediaPorTipo = () => {
    const mediasPorTipo = {};
    
    servicos.forEach(servico => {
      const avaliacoesServico = avaliacoes.filter(a => a.servicoId === servico.id);
      
      if (avaliacoesServico.length > 0) {
        if (!mediasPorTipo[servico.tipoServico]) {
          mediasPorTipo[servico.tipoServico] = { soma: 0, count: 0 };
        }
        avaliacoesServico.forEach(av => {
          mediasPorTipo[servico.tipoServico].soma += av.nota;
          mediasPorTipo[servico.tipoServico].count += 1;
        });
      }
    });

    return Object.entries(mediasPorTipo).map(([tipo, dados]) => ({
      tipo,
      media: (dados.soma / dados.count).toFixed(1),
      totalAvaliacoes: dados.count
    })).sort((a, b) => b.media - a.media);
  };

  const mediaPorTipo = calcularNotaMediaPorTipo();

  const renderStars = (nota, clickable = false, onClickStar = null) => {
    return (
      <div className="rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= (clickable ? (hoverRating || nota) : nota) ? 'filled' : ''}`}
            onClick={() => clickable && onClickStar && onClickStar(star)}
            onMouseEnter={() => clickable && setHoverRating(star)}
            onMouseLeave={() => clickable && setHoverRating(0)}
            style={{ cursor: clickable ? 'pointer' : 'default' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="card">
        <h2>➕ Nova Avaliação</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Serviço Concluído *</label>
            <select
              value={formData.servicoId}
              onChange={(e) => setFormData({...formData, servicoId: e.target.value})}
              required
            >
              <option value="">Selecione um serviço</option>
              {servicosConcluidos.map(servico => {
                const cliente = clientes.find(c => c.id === servico.clienteId);
                const jaAvaliado = avaliacoes.some(a => a.servicoId === servico.id);
                return (
                  <option 
                    key={servico.id} 
                    value={servico.id}
                    disabled={jaAvaliado}
                  >
                    {servico.tipoServico} - {cliente?.nome} 
                    {jaAvaliado ? ' (Já avaliado)' : ''}
                  </option>
                );
              })}
            </select>
            {servicosConcluidos.length === 0 && (
              <small style={{ color: '#dc3545' }}>
                Nenhum serviço concluído disponível para avaliação!
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Nota * {formData.nota > 0 && `(${formData.nota} estrelas)`}</label>
            {renderStars(formData.nota, true, (star) => setFormData({...formData, nota: star}))}
          </div>

          <div className="form-group">
            <label>Comentário</label>
            <textarea
              value={formData.comentario}
              onChange={(e) => setFormData({...formData, comentario: e.target.value})}
              placeholder="Deixe um comentário sobre o serviço..."
              rows="4"
            />
          </div>

          <button type="submit" disabled={servicosConcluidos.length === 0}>
            Cadastrar Avaliação
          </button>
        </form>
      </div>

      <div className="card">
        <h2>⭐ Avaliações Cadastradas ({avaliacoes.length})</h2>
        {avaliacoes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Cliente</th>
                <th>Nota</th>
                <th>Comentário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {avaliacoes.map(avaliacao => {
                const servico = servicos.find(s => s.id === avaliacao.servicoId);
                const cliente = clientes.find(c => c.id === servico?.clienteId);
                return (
                  <tr key={avaliacao.id}>
                    <td>{servico?.tipoServico || 'Serviço não encontrado'}</td>
                    <td>{cliente?.nome || 'Cliente não encontrado'}</td>
                    <td>
                      <span style={{ fontSize: '20px', color: '#ffc107' }}>
                        {'★'.repeat(avaliacao.nota)}{'☆'.repeat(5 - avaliacao.nota)}
                      </span>
                      <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
                        {avaliacao.nota}/5
                      </span>
                    </td>
                    <td>{avaliacao.comentario || '-'}</td>
                    <td>
                      <button className="btn-small btn-danger" onClick={() => handleDelete(avaliacao.id)}>
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
            <p>Nenhuma avaliação cadastrada ainda</p>
          </div>
        )}
      </div>

      {mediaPorTipo.length > 0 && (
        <div className="card">
          <h2>📊 Nota Média por Tipo de Serviço</h2>
          <table>
            <thead>
              <tr>
                <th>Tipo de Serviço</th>
                <th>Nota Média</th>
                <th>Total de Avaliações</th>
              </tr>
            </thead>
            <tbody>
              {mediaPorTipo.map(({ tipo, media, totalAvaliacoes }) => (
                <tr key={tipo}>
                  <td>{tipo}</td>
                  <td>
                    <span style={{ fontSize: '20px', color: '#ffc107', marginRight: '8px' }}>
                      {'★'.repeat(Math.round(parseFloat(media)))}
                      {'☆'.repeat(5 - Math.round(parseFloat(media)))}
                    </span>
                    <strong style={{ fontSize: '18px', color: '#667eea' }}>
                      {media}
                    </strong>
                  </td>
                  <td>{totalAvaliacoes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}