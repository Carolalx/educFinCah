document.addEventListener('DOMContentLoaded', () => {
  const dadosJSON = sessionStorage.getItem('dadosGestao');
  if(!dadosJSON){ alert("Nenhum dado encontrado."); window.location.href="gestao.html"; return; }

  const dados = JSON.parse(dadosJSON);
  iniciarSugestao(dados);

  document.getElementById('btnFechar').addEventListener('click',()=>window.location.href='gestao.html');
});

function iniciarSugestao(dados){
  const receita = Number(dados.totalReceitas) || 0;
  const saldoAtual = Number(dados.saldo) || 0;
  let mercadoRecomendado = 500;

  if(dados.simulacao === 'familiar'){
    let pessoas = 0;
    while(!Number.isInteger(pessoas) || pessoas<=0){
      pessoas = parseInt(prompt("A renda familiar se baseia em quantas pessoas?"));
    }
    mercadoRecomendado = pessoas * 500;
  }

  const recomendado = {
    Moradia: Number(dados.moradia),
    Luz: Number(dados.luz),
    Água: Number(dados.agua),
    Mercado: mercadoRecomendado,
    Farmácia: 0,
    Internet: Number(dados.internet),
    Locomoção: Number(dados.locomocao),
    "Cartão de Crédito": 0,
    Educação: Number(dados.educacao),
    Lazer: receita*0.05,
    Investimentos: saldoAtual >= receita*0.1 ? receita*0.1 : receita*0.05
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

  // soma
  const somaAtual = Object.values(atual).reduce((a,b)=>a+b,0);
  const somaRec = Object.values(recomendado).reduce((a,b)=>a+b,0);

  let html = `<table class="recomendacao">
    <tr><th>Categoria</th><th>Atual (R$)</th><th>Recomendado (R$)</th></tr>`;

  Object.keys(atual).forEach(cat=>{
    const atualVal = atual[cat];
    const recVal = recomendado[cat];
    let classe=''; let seta='';
    if(recVal>atualVal){ classe='azul'; seta=' ⬆'; }
    else if(recVal<atualVal){ classe='vermelho'; seta=' ⬇'; }
    html+=`<tr><td>${cat}</td><td>${moeda(atualVal)}</td><td class="${classe}">${moeda(recVal)}${seta}</td></tr>`;
  });

  html+=`<tr style="font-weight:bold"><td>Total</td><td>${moeda(somaAtual)}</td><td>${moeda(somaRec)}</td></tr>`;
  html+="</table>";

  document.getElementById("tabelaRecomendada").innerHTML=html;

  function calcularProjecao(){
    const taxaPct = Number(document.getElementById("taxaInput").value) || 1;
    const i = taxaPct/100;
    const aporte = recomendado.Investimentos;

    function fv_mensal(p,n,r){ return r===0?p*n:p*((Math.pow(1+r,n)-1)/r); }

    const anos=[5,10,20,30];
    let phtml=`<table class="recomendacao"><tr><th>Anos</th><th>Patrimônio (R$)</th><th>Renda Mensal Estimada (1%)</th></tr>`;
    anos.forEach(a=>{
      const meses=a*12;
      const patrimonio=fv_mensal(aporte,meses,i);
      const rendaMensal=patrimonio*0.01;
      phtml+=`<tr><td>${a} anos</td><td>${moeda(patrimonio)}</td><td>${moeda(rendaMensal)}</td></tr>`;
    });
    phtml+="</table>";
    document.getElementById("projecao").innerHTML=phtml;
  }

  calcularProjecao();
  document.getElementById("taxaInput").addEventListener("input",calcularProjecao);
}
