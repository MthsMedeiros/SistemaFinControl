

let listDespesas = JSON.parse(localStorage.getItem("despesas")) || [];  // Lista de despesas, obtida do localStorage ou inicializada como array vazio
let categoriasDespesas = {}

let listReceitas = JSON.parse(localStorage.getItem("receitas")) || [];  // Lista de receitas, obtida do localStorage ou inicializada como array vazio
let categoriasReceitas = {}

listDespesas.forEach((element) => {
    categoriasDespesas[element.descricao] = (categoriasDespesas[element.descricao] || 0) + parseFloat(element.valor.replace(".", "").replace(",", "."));
})

listReceitas.forEach((element) => {
    categoriasReceitas[element.descricao] = (categoriasReceitas[element.descricao] || 0) + parseFloat(element.valor.replace(".", "").replace(",", "."));
})

function gerarGraficosDespesas(){

    const ctx = document.getElementById('graficoDespesas').getContext('2d');
    new Chart( ctx,{
        type: 'doughnut',
        data: {
            labels: Object.keys(categoriasDespesas),
            datasets: [{
                data: Object.values(categoriasDespesas),
               
            }]
        }
    })

}

function gerarGraficosReceitas(){

    const ctx = document.getElementById('graficoReceitas').getContext('2d');
    new Chart( ctx,{
        type: 'doughnut',
        data: {
            labels: Object.keys(categoriasReceitas),
            datasets: [{
                data: Object.values(categoriasReceitas),
               
            }]
        }
    })


}

addEventListener("DOMContentLoaded", () => {
    gerarGraficosDespesas();
    gerarGraficosReceitas();    
})