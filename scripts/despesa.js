let inptDescricao = document.getElementById("inpDescReceita");
let inptValor = document.getElementById("inpValorReceita");
let inptData = document.getElementById("inpDataReceita");
let listDespesas = getDespesas();
let tableGrid = document.getElementById("tableGrid");
let tableConstruction = []
let editting = false
let despesaEditId = 0;

class Despesa {

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
    listDespesas.forEach((element) => {
        if (element.id > lastId) {
            lastId = element.id;
        }
    });
    return lastId;

}

function createDespesa() {
    let varControl = 0
    let descricao = inptDescricao.value;
    let valor = inptValor.value;
    let data = inptData.value.split("-").reverse().join("/");

    if (despesaEditId == 0) {
        despesaEditId = getLastId();
        despesaEditId++
        
    } else {
        
        despesaEditId++;
    }


    
    let despesa = new Despesa(despesaEditId, descricao, valor, data);


    if (editting) {
        listDespesas.forEach((element) => {
            if (element.descricao === despesa.descricao) {
                if (varControl == 0) {

                    deleteDespesa(element.id);
                    let elementEdited = new Despesa(despesaEditId, descricao, valor, data);
                    listDespesas.push(elementEdited);
                    varControl = 1;
                }

            }
        });
        editting = false;
        varControl = 0;
    } else {

        listDespesas.push(despesa);
    }

    console.log(listDespesas);
    localStorage.setItem("despesas", JSON.stringify(listDespesas));

    inptDescricao.value = "";
    inptDescricao.removeAttribute("disabled");
    inptValor.value = "";
    inptData.value = "";
    renderizarTabela(listDespesas);

}

function deleteDespesa(id) {
    listDespesas.forEach((element) => {
        if (element.id === id) {
            listDespesas.splice(listDespesas.indexOf(element), 1);
        }
    });
    localStorage.setItem("despesas", JSON.stringify(listDespesas));
    renderizarTabela();
}

function editDespesa(id) {
    listDespesas.forEach((element) => {
        if (element.id == id) {
            inptDescricao.value = element.descricao;
            inptDescricao.setAttribute("disabled", "disabled");
            inptValor.value = element.valor;
            inptData.value = element.data;
            editting = true;

        }
    });
}
function getDespesas() {
    let despesasList = localStorage.getItem("despesas");
    return JSON.parse(despesasList) || [];
}

function renderizarTabela() {
    let tbody = tableGrid.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    let despesasLocalStorage = getDespesas();

    despesasLocalStorage.forEach(element => {




        let tr = document.createElement("tr");

        tr.innerHTML = `<td class="border-r border-b p-2">${element.descricao}</td>
                <td class="border-r border-b p-2">${element.valor}</td>
                <td class="border-r border-b p-2">${element.data}</td>
                <td class="border-b p-2 flex justify-center items-center gap-2">
                            <button class="border p-2 bg-[#6a7282] text-white rounded-xl hover:scale-105" onclick="editDespesa(${element.id})">Editar</button>
                            <button class="border p-2 bg-red-500 rounded-xl text-white hover:scale-105" onclick="deleteDespesa(${element.id})">Excluir</button>
                </td>`
        tableConstruction.push(tr.innerHTML);
        tbody.appendChild(tr);




    });



}

addEventListener("DOMContentLoaded", function (e) {
    renderizarTabela();
});
