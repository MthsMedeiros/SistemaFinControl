let inptDescricao = document.getElementById("inpDescReceita");
let inptValor = document.getElementById("inpValorReceita");
let inptData = document.getElementById("inpDataReceita");
let listReceitas = getReceitas();
let tableGrid = document.getElementById("tableGrid");
let tableConstruction = []
let editting = false
let receitaEditId = 0;

class Receita {

    constructor(id, descricao, valor, data) {
        this.id = id;
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
    }



}

function clearfields() {
    inptDescricao.removeAttribute("disabled");
}

function getLastId() {
    let lastId = 0;
    listReceitas.forEach((element) => {
        if (element.id > lastId) {
            lastId = element.id;
        }
    });
    return lastId;

}

function createReceita() {
    let varControl = 0
    let descricao = inptDescricao.value;
    let valor = inptValor.value;
    let data = inptData.value.split("-").reverse().join("/");

    if (receitaEditId == 0) {
        receitaEditId = getLastId();
        receitaEditId++
        
    } else {
        
        receitaEditId++;
    }


    
    let receita = new Receita(receitaEditId, descricao, valor, data);


    if (editting) {
        listReceitas.forEach((element) => {
            if (element.descricao === receita.descricao) {
                if (varControl == 0) {

                    deleteReceita(element.id);
                    let elementEdited = new Receita(receitaEditId, descricao, valor, data);
                    listReceitas.push(elementEdited);
                    varControl = 1;
                }

            }
        });
        editting = false;
        varControl = 0;
    } else {

        listReceitas.push(receita);
    }

    console.log(listReceitas);
    localStorage.setItem("receitas", JSON.stringify(listReceitas));

    inptDescricao.value = "";
    inptDescricao.removeAttribute("disabled");
    inptValor.value = "";
    inptData.value = "";
    renderizarTabela(listReceitas);

}

function deleteReceita(id) {
    listReceitas.forEach((element) => {
        if (element.id === id) {
            listReceitas.splice(listReceitas.indexOf(element), 1);
        }
    });
    localStorage.setItem("receitas", JSON.stringify(listReceitas));
    renderizarTabela();
}

function editReceita(id) {
    listReceitas.forEach((element) => {
        if (element.id == id) {
            inptDescricao.value = element.descricao;
            inptDescricao.setAttribute("disabled", "disabled");
            inptValor.value = element.valor;
            inptData.value = element.data;
            editting = true;

        }
    });
}
function getReceitas() {
    let receitasList = localStorage.getItem("receitas");
    return JSON.parse(receitasList) || [];
}

function renderizarTabela() {
    let tbody = tableGrid.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    let receitaLocalStorage = getReceitas();

    receitaLocalStorage.forEach(element => {




        let tr = document.createElement("tr");

        tr.innerHTML = `<td class="border-r border-b p-2">${element.descricao}</td>
                <td class="border-r border-b p-2">${element.valor}</td>
                <td class="border-r border-b p-2">${element.data}</td>
                <td class="border-b p-2 flex justify-center items-center gap-2">
                            <button class="border p-2 bg-[#6a7282] text-white rounded-xl hover:scale-105" onclick="editReceita(${element.id})">Editar</button>
                            <button class="border p-2 bg-red-500 rounded-xl text-white hover:scale-105" onclick="deleteReceita(${element.id})">Excluir</button>
                </td>`
        tableConstruction.push(tr.innerHTML);
        tbody.appendChild(tr);




    });



}

addEventListener("DOMContentLoaded", function (e) {
    renderizarTabela();
});
