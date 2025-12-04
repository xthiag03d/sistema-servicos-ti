import { useData } from '../contexts/DataContext';

export default function Dashboard() {
  const { clientes, servicos, avaliacoes } = useData();

  const totalClientes = clientes.length;
  const totalServicos = servicos.length;
  const servicosConcluidos = servicos.filter(s => s.status === 'Concluído').length;
  
  const notaMedia = avaliacoes.length > 0 
    ? (avaliacoes.reduce((sum, a) => sum + a.nota, 0) / avaliacoes.length).toFixed(1)
    : 0;

  const clientesDemanda = clientes.map(cliente => ({
    ...cliente,
    totalServicos: servicos.filter(s => s.clienteId === cliente.id).length
  }))
  .filter(c => c.totalServicos > 0)
  .sort((a, b) => b.totalServicos - a.totalServicos);

  const servicosContagem = {};
  servicos.forEach(s => {
    servicosContagem[s.tipoServico] = (servicosContagem[s.tipoServico] || 0) + 1;
  });
  const servicosMaisSolicitados = Object.entries(servicosContagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalClientes}</h3>
          <p>Clientes Cadastrados</p>
        </div>
        <div className="stat-card">
          <h3>{totalServicos}</h3>
          <p>Total de Serviços</p>
        </div>
        <div className="stat-card">
          <h3>{servicosConcluidos}</h3>
          <p>Serviços Concluídos</p>
        </div>
        <div className="stat-card">
          <h3>{notaMedia} ⭐</h3>
          <p>Nota Média</p>
        </div>
      </div>

      <div className="card">
        <h2>📈 Clientes que Mais Demandam Serviços</h2>
        {clientesDemanda.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Total de Serviços</th>
              </tr>
            </thead>
            <tbody>
              {clientesDemanda.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone}</td>
                  <td><strong>{cliente.totalServicos}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>Nenhum serviço cadastrado ainda</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>🔧 Serviços Mais Solicitados</h2>
        {servicosMaisSolicitados.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Tipo de Serviço</th>
                <th>Quantidade</th>
                <th>Percentual</th>
              </tr>
            </thead>
            <tbody>
              {servicosMaisSolicitados.map(([servico, quantidade]) => {
                const percentual = ((quantidade / totalServicos) * 100).toFixed(1);
                return (
                  <tr key={servico}>
                    <td>{servico}</td>
                    <td><strong>{quantidade}</strong></td>
                    <td>{percentual}%</td>
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