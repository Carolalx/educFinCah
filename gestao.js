document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('gestaoForm');
  const saldoEl = document.getElementById('saldo');
  const graficoCtx = document.getElementById('graficoPreview').getContext('2d');
  const sugestaoBox = document.getElementById('sugestaoBox');
  const btnSugestao = document.getElementById('btnSugestao');

  let grafico = null;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const receitas = ['salario','bonus','extras'].map(id => parseFloat(document.getElementById(id).value) || 0);
    const despesas = ['moradia','luz','agua','mercado','farmacia','internet','locomocao','cartaoCredito','educacao','lazer','investimentos'].map(id => parseFloat(document.getElementById(id).value) || 0);

    const totalReceitas = receitas.reduce((a,b)=>a+b,0);
    const totalDespesas = despesas.reduce((a,b)=>a+b,0);
    const saldo = totalReceitas - totalDespesas;
    saldoEl.textContent = `R$ ${saldo.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}`;

    // salvar dados para sugestao
    const simulacao = document.querySelector('input[name="simulacao"]:checked').value;
    const dadosGestao = {
      salario: Number(document.getElementById('salario').value),
      bonus: Number(document.getElementById('bonus').value),
      extras: Number(document.getElementById('extras').value),
      totalReceitas,
      saldo,
      moradia: Number(document.getElementById('moradia').value),
      luz: Number(document.getElementById('luz').value),
      agua: Number(document.getElementById('agua').value),
      mercado: Number(document.getElementById('mercado').value),
      farmacia: Number(document.getElementById('farmacia').value),
      internet: Number(document.getElementById('internet').value),
      locomocao: Number(document.getElementById('locomocao').value),
      cartaoCredito: Number(document.getElementById('cartaoCredito').value),
      educacao: Number(document.getElementById('educacao').value),
      lazer: Number(document.getElementById('lazer').value),
      investimentos: Number(document.getElementById('investimentos').value),
      simulacao
    };
    sessionStorage.setItem('dadosGestao', JSON.stringify(dadosGestao));

    atualizarGrafico(despesas);
    sugestaoBox.style.display = 'block';
  });

  btnSugestao.addEventListener('click', () => {
    window.open('sugestao.html', '_blank');
  });

  function atualizarGrafico(despesas){
    const labels = ['Moradia','Luz','Água','Mercado','Farmácia','Internet','Locomoção','Cartão','Educação','Lazer','Investimentos'];
    const cores = ['#f44336','#e57373','#f08080','#ffb74d','#ffd54f','#ba68c8','#9575cd','#64b5f6','#4fc3f7','#4caf50','#6edc73'];
    if(grafico){
      grafico.data.datasets[0].data = despesas;
      grafico.update();
    } else {
      grafico = new Chart(graficoCtx, {
        type:'pie',
        data: {labels, datasets:[{data:despesas, backgroundColor:cores}]},
        options:{responsive:true, plugins:{legend:{position:'right'}, datalabels:{formatter:(value)=>`R$ ${value.toLocaleString('pt-BR',{minimumFractionDigits:2})}`}}}, plugins:[ChartDataLabels]
      });
    }
  }
});
