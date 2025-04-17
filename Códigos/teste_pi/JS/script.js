const faixaTemperatura = { min: 18, max: 25 };
const faixaUmidade = { min: 40, max: 60 };

function verificarCondicao(temp, umid) {
  const tempOK = temp >= faixaTemperatura.min && temp <= faixaTemperatura.max;
  const umidOK = umid >= faixaUmidade.min && umid <= faixaUmidade.max;
  return tempOK && umidOK ? 'normal' : 'critico';
}

async function buscarDadosSensor() {
  try {
    const response = await fetch('/api/sensores');
    const dados = await response.json();

    const temperatura = parseFloat(dados.temperatura);
    const umidade = parseFloat(dados.umidade);
    const status = verificarCondicao(temperatura, umidade);

    document.getElementById('temperatura').textContent = `${temperatura}°C`;
    document.getElementById('umidade').textContent = `${umidade}%`;

    const statusSpan = document.getElementById('status-condicao');
    statusSpan.textContent = status === 'normal' ? 'Condições ideais' : 'Condições críticas';
    statusSpan.className = status === 'normal' ? 'status-normal' : 'status-critico';

  } catch (error) {
    console.error('Erro ao buscar dados do sensor:', error);
  }
}

async function carregarGraficoTemperatura() {
  try {
    const response = await fetch('/api/historico');
    const dados = await response.json();

    const horas = dados.map(d => d.hora);
    const temperaturas = dados.map(d => parseFloat(d.temperatura));

    const trace = {
      x: horas,
      y: temperaturas,
      mode: 'lines+markers',
      type: 'scatter',
      name: 'Temperatura',
      line: { color: '#4caf50' }
    };

    const layout = {
      title: 'Evolução da Temperatura',
      xaxis: { title: 'Hora' },
      yaxis: { title: 'Temperatura (°C)' }
    };

    Plotly.newPlot('grafico-temperatura', [trace], layout);
  } catch (error) {
    console.error('Erro ao carregar gráfico:', error);
  }
}

// Atualizações automáticas
setInterval(buscarDadosSensor, 5000);
buscarDadosSensor();

setInterval(carregarGraficoTemperatura, 60000); // Atualiza gráfico a cada 1 min
carregarGraficoTemperatura();
