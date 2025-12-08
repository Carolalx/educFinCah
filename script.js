document.addEventListener('DOMContentLoaded', () => {
  // Botão Simular Gestão
  const btnSimularGestao = document.getElementById('simularAgora');
  if (btnSimularGestao) {
    btnSimularGestao.addEventListener('click', () => {
      window.location.href = 'gestao.html';
    });
  }

  // Simulador de Juros Compostos
  const form = document.getElementById('simuladorForm');
  const resultadoArea = document.getElementById('resultadoArea');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const capitalInicial = parseFloat(document.getElementById('capitalInicial').value) || 0;
    const aporteMensal = parseFloat(document.getElementById('aporteMensal').value) || 0;
    const taxaAumentoAporte = parseFloat(document.getElementById('taxaAumentoAporte').value) / 100 || 0;
    const taxaJurosAnual = parseFloat(document.getElementById('taxaJuros').value) / 100 || 0;
    const periodoAnos = parseFloat(document.getElementById('periodo').value);

    if (periodoAnos <= 0) { alert('Período deve ser maior que zero'); return; }

    let montanteFinal = capitalInicial;
    let totalAportes = capitalInicial;
    let aporteAtual = aporteMensal;

    for (let i = 1; i <= periodoAnos; i++) {
      for (let m = 1; m <= 12; m++) {
        montanteFinal += aporteAtual;
      }
      montanteFinal *= (1 + taxaJurosAnual);
      aporteAtual *= (1 + taxaAumentoAporte);
      totalAportes += aporteAtual * 12;
    }

    const totalJuros = montanteFinal - totalAportes;

    document.getElementById('montanteFinal').textContent =
      montanteFinal.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});

    document.getElementById('totalJuros').textContent =
      totalJuros.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});

    // NOVO: renda mensal aproximada (1%)
    const rendaMensal = montanteFinal * 0.01;
    document.getElementById('rendaMensal').textContent =
      rendaMensal.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});

    resultadoArea.style.display = 'block';

  });
});
