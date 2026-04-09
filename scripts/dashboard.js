let listDespesas = JSON.parse(localStorage.getItem("despesas")) || [];  // Lista de despesas, obtida do localStorage ou inicializada como array vazio
let categoriasDespesas = {}

let listReceitas = JSON.parse(localStorage.getItem("receitas")) || [];  // Lista de receitas, obtida do localStorage ou inicializada como array vazio
let categoriasReceitas = {}

let dtDashboard = document.getElementById("mesAnoInput");

let chartDespesas;
let chartReceitas;
let chartBalanco;



// listDespesas.forEach((element) => {
//     categoriasDespesas[element.descricao] = (categoriasDespesas[element.descricao] || 0) + parseFloat(element.valor.replace(".", "").replace(",", "."));
// })

// listReceitas.forEach((element) => {
//     categoriasReceitas[element.descricao] = (categoriasReceitas[element.descricao] || 0) + parseFloat(element.valor.replace(".", "").replace(",", "."));
// })

function getCurrentMonthYear() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    dtDashboard.value = `${now.getFullYear()}-${month}`;
}

function dataFilterDespesas(dtDashboard) {
    categoriasDespesas = {};
    let mesAnoFormat = dtDashboard.value.substring(5,7) + "/" + dtDashboard.value.substring(0,4);
    listDespesas.forEach((element) => {
        if(element.data.substring(3, 10) == mesAnoFormat){
            categoriasDespesas[element.descricao] = (categoriasDespesas[element.descricao] || 0) + parseFloat(element.valor.replace(".", "").replace(",", "."));
        }
    })
}

function dataFilterReceitas(dtDashboard) {
    categoriasReceitas = {};

    let mesAnoFormat = dtDashboard.value.substring(5,7) + "/" + dtDashboard.value.substring(0,4);
    listReceitas.forEach((element) => {
        if(element.data.substring(3, 10) == mesAnoFormat){
            categoriasReceitas[element.descricao] = (categoriasReceitas[element.descricao] || 0) + parseFloat(element.valor.replace(".", "").replace(",", "."));
        }
    })
}

function gerarGraficosDespesas() {
    
    
    dataFilterDespesas(dtDashboard);
    

    const ctx = document.getElementById('graficoDespesas').getContext('2d');
    if (chartDespesas) {
        chartDespesas.destroy();
    }
    chartDespesas = new Chart(ctx, {
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

    dataFilterReceitas(dtDashboard);

    const ctx = document.getElementById('graficoReceitas').getContext('2d');
    if (chartReceitas) {
        chartReceitas.destroy();
    }
    chartReceitas = new Chart(ctx, {
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

    dataFilterDespesas(dtDashboard);
    dataFilterReceitas(dtDashboard);


    const ctx = document.getElementById('graficoBalanco').getContext('2d');
    if (chartBalanco) {
        chartBalanco.destroy();
    }
    
    let sumDespesas = () => {
        let sum = 0;
        listDespesas.forEach((element) => {
            if(element.data.substring(3, 10) == dtDashboard.value.substring(5,7) + "/" + dtDashboard.value.substring(0,4)){ 

                sum += parseFloat(element.valor.replace(".", "").replace(",", "."));
            }
        })
        return sum;
    }

    let sumReceitas = () => {
        let sum = 0;
        listReceitas.forEach((element) => {
            if(element.data.substring(3, 10) == dtDashboard.value.substring(5,7) + "/" + dtDashboard.value.substring(0,4)){ 

                sum += parseFloat(element.valor.replace(".", "").replace(",", "."));
            }
        })
        return sum;
    }

    chartBalanco = new Chart(ctx, {
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
    getCurrentMonthYear();
    gerarGraficosDespesas();
    gerarGraficosReceitas();
    gerarGraficoBarras();

    dtDashboard.addEventListener("change", () => {
        gerarGraficosDespesas();
        gerarGraficosReceitas();
        gerarGraficoBarras();
    })
})