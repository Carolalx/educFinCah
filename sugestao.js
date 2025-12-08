document.addEventListener('DOMContentLoaded', () => {
  const dadosJSON = sessionStorage.getItem('dadosGestao');
  if (!dadosJSON) {
    alert("Nenhum dado encontrado.");
    window.location.href = "gestao.html";
    return;
  }

  const dados = JSON.parse(dadosJSON);

  // Pergunta sobre número de pessoas apenas UMA vez
  if (dados.simulacao === 'familiar') {
    let pessoas = 0;
    while (!Number.isInteger(pessoas) || pessoas <= 0) {
      pessoas = parseInt(prompt("A renda familiar se baseia em quantas pessoas?"));
    }
    dados.mercadoRecomendado = pessoas * 500;
  }

  iniciarSugestao(dados);

  document.getElementById('btnFechar').addEventListener('click', () => window.location.href = 'gestao.html');
});

function iniciarSugestao(dados) {
  const receita = Number(dados.totalReceitas) || 0;
  const saldoAtual = Number(dados.saldo) || 0; // apenas para exibir, não entra no cálculo

  const recomendado = {
    Moradia: Number(dados.moradia),
    Luz: Number(dados.luz),
    Água: Number(dados.agua),
    Mercado: Number(dados.mercadoRecomendado || 500), // usa valor já calculado
    Farmácia: Number(dados.farmacia),
    Internet: Number(dados.internet),
    Locomoção: Number(dados.locomocao),
    "Cartão de Crédito": 0,
    Educação: Number(dados.educacao),
    Lazer: receita * 0.05,
    Investimentos: Number(dados.investimentos)
  };

  const atual = {
    Moradia: Number(dados.moradia),
    Luz: Number(dados.luz),
    Água: Number(dados.agua),
    Mercado: Number(dados.mercado),
    Farmácia: Number(dados.farmacia),
    Internet: Number(dados.internet),
    Locomoção: Number(dados.locomocao),
    "Cartão de Crédito": Number(dados.cartaoCredito),
    Educação: Number(dados.educacao),
    Lazer: Number(dados.lazer),
    Investimentos: Number(dados.investimentos)
  };

  function moeda(v){ return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}); }

  let investimentoInicial = recomendado.Investimentos;

  function atualizarTabela() {
    const somaRecomendado = Object.values(recomendado).reduce((a,b)=>a+b,0);
    const saldoRecomendado = receita - somaRecomendado;
    const saldoParaInvestir = saldoRecomendado > 0 ? saldoRecomendado : 0;
    const somaAtual = Object.values(atual).reduce((a,b)=>a+b,0);

    let html = `<table class="recomendacao">
      <tr><th>Categoria</th><th>Atual (R$)</th><th>Recomendado (R$)</th></tr>`;

    Object.keys(atual).forEach(cat => {
      const atualVal = atual[cat];
      const recVal = recomendado[cat];
      let classe = '';
      let seta = '';
      if(recVal > atualVal){ classe='azul'; seta=' ⬆'; }
      else if(recVal < atualVal){ classe='vermelho'; seta=' ⬇'; }
      html += `<tr>
        <td>${cat}</td>
        <td>${moeda(atualVal)}</td>
        <td class="${classe}">${moeda(recVal)}${seta}</td>
      </tr>`;
    });

    html += `<tr style="font-weight:bold">
      <td>Total</td>
      <td>${moeda(somaAtual)}</td>
      <td>${moeda(somaRecomendado)}</td>
    </tr>`;

    html += `<tr style="font-weight:bold">
      <td>Saldo</td>
      <td>${moeda(saldoAtual)}</td>
      <td>${moeda(saldoParaInvestir)}</td>
    </tr>`;

    document.getElementById("tabelaRecomendada").innerHTML = html;
    return saldoParaInvestir;
  }

  let saldoDisponivel = atualizarTabela();

  function calcularProjecao(investimento = investimentoInicial) {
    const taxaPct = Number(document.getElementById("taxaInput").value) || 1;
    const i = taxaPct/100;

    function fv_mensal(p,n,r){ return r===0?p*n:p*((Math.pow(1+r,n)-1)/r); }

    const anos=[5,10,20,30];
    // Alinha à esquerda, abaixo da taxa
    let phtml = `<div style="margin-bottom:8px; text-align:left;">Investimento Inicial: <strong>${moeda(investimento)}</strong></div>`;
    phtml += `<table class="recomendacao">
      <tr><th>Anos</th><th>Patrimônio (R$)</th><th>Renda Mensal Estimada (1%)</th></tr>`;

    anos.forEach(a=>{
      const meses = a*12;
      const patrimonio = fv_mensal(investimento, meses, i);
      const rendaMensal = patrimonio*0.01;
      phtml += `<tr>
        <td>${a} anos</td>
        <td>${moeda(patrimonio)}</td>
        <td>${moeda(rendaMensal)}</td>
      </tr>`;
    });

    phtml += "</table>";
    document.getElementById("projecao").innerHTML = phtml;
  }

  calcularProjecao();
  document.getElementById("taxaInput").addEventListener("input", () => calcularProjecao(investimentoInicial));

  const btnInvestir = document.createElement("button");
  btnInvestir.textContent = "Investir Saldo";
  btnInvestir.className = "primary";
  btnInvestir.style.marginTop = "12px";
  document.querySelector(".card").appendChild(btnInvestir);

  btnInvestir.addEventListener("click", () => {
    if(saldoDisponivel <= 0){
      alert("Não há saldo disponível para investir!");
      return;
    }

    const investirTudo = confirm("Deseja investir todo o saldo disponível?");
    let valorInvestimento = 0;

    if(investirTudo){
      valorInvestimento = saldoDisponivel;
    } else {
      do {
        valorInvestimento = parseInt(prompt(`Informe (R$) quanto do saldo disponível deseja investir? (Máx: ${saldoDisponivel})`), 10);
      } while(isNaN(valorInvestimento) || valorInvestimento < 0 || valorInvestimento > saldoDisponivel);
    }

    recomendado.Investimentos += valorInvestimento;
    investimentoInicial = recomendado.Investimentos;

    saldoDisponivel = atualizarTabela();
    calcularProjecao(investimentoInicial);
  });
}
