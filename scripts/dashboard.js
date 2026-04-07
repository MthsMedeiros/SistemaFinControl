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

function gerarGraficosDespesas() {

    const ctx = document.getElementById('graficoDespesas').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        
        data: {
            labels: Object.keys(categoriasDespesas),
            datasets: [{
                data: Object.values(categoriasDespesas),

            }]
        }
    })

}

function gerarGraficosReceitas() {

    const ctx = document.getElementById('graficoReceitas').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoriasReceitas),
            datasets: [{
                data: Object.values(categoriasReceitas),

            }]
        }
    })


}

function gerarGraficoBarras() {
    const ctx = document.getElementById('graficoBalanco').getContext('2d');
    
    let sumDespesas = () => {
        let sum = 0;
        listDespesas.forEach((element) => {
            sum += parseFloat(element.valor.replace(".", "").replace(",", "."));
        })
        return sum;
    }

    let sumReceitas = () => {
        let sum = 0;
        listReceitas.forEach((element) => {
            sum += parseFloat(element.valor.replace(".", "").replace(",", "."));
        })
        return sum;
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Despesas", "Receitas"],
            datasets: [{
                label: "Balanço",
                data: [sumDespesas(), sumReceitas()],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',    // Vermelho para Despesas
                    'rgba(54, 162, 235, 0.7)'     // Azul para Receitas
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,              // ← Adicionar isso
            maintainAspectRatio: false,     // ← Adicionar isso
            scales: { 
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}

addEventListener("DOMContentLoaded", () => {
    gerarGraficosDespesas();
    gerarGraficosReceitas();
    gerarGraficoBarras();
})