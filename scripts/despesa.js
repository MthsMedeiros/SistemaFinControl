// === VARIÁVEIS GLOBAIS ===
// Elementos de entrada do formulário
let inptDescricao = document.getElementById("inpDescDespesa");  // Campo para descrição da despesa
let inptValor = document.getElementById("inpValorDespesa");    // Campo para valor da despesa
let inptData = document.getElementById("inpDataDespesa");      // Campo para data da despesa

// Dados e elementos da interface
let listDespesas = getDespesas();        // Lista de despesas armazenada no localStorage
let tableGrid = document.getElementById("tableGrid");  // Tabela que exibe as despesas
let tableConstruction = [];               // Array para construir as linhas da tabela
let editting = false;                     // Flag indicando se está em modo de edição
let despesaEditId = 0;                    // ID da despesa sendo editada

// === CLASSE DESPESA ===
// Modelo de dados para uma despesa
class Despesa {
    // Construtor que recebe os dados da despesa
    constructor(id, descricao, valor, data) {
        this.id = id;              // Identificador único da despesa
        this.descricao = descricao; // Descrição/nome da despesa
        this.valor = valor;        // Valor gasto
        this.data = data;          // Data da despesa
    }
}

// === FUNÇÕES UTILITÁRIAS ===
// Limpa os campos de entrada e habilita o campo de descrição
function clearfields() {
    inptDescricao.removeAttribute("disabled");  // Remove a desabilitação do campo de descrição
}

// Obtém o maior ID existente na lista de despesas
function getLastId() {
    let lastId = 0;
    // Percorre a lista procurando pelo maior ID
    listDespesas.forEach((element) => {
        if (element.id > lastId) {
            lastId = element.id;  // Atualiza o maior ID encontrado
        }
    });
    return lastId;  // Retorna o maior ID para usar como base para o próximo
}

// Verifica se a descrição já existe na lista (evita duplicatas)
function descricaoExists(descricao) {  
    
        return listDespesas.some((element) => element.descricao.toLowerCase() === descricao.toLowerCase());
    
}


// === FUNÇÃO PRINCIPAL DE CRIAÇÃO/EDIÇÃO ===
// Cria uma nova despesa ou atualiza uma existente
function createDespesa() {
    let varControl = 0;  // Controle para evitar duplicação na edição
    let descricao = inptDescricao.value;  // Obtém a descrição do formulário
    let valor = new Intl.NumberFormat('pt-br',{minimumFractionDigits: 2, maximumFractionDigits:2}).format(inptValor.value);  // Obtém o valor do formulário
    // Converte data do formato YYYY-MM-DD para DD/MM/YYYY
    let data = inptData.value.split("-").reverse().join("/");
    let despesa;  // Variável que armazenará a nova despesa

    // Gera um novo ID se não estiver editando
    if (despesaEditId == 0) {
        despesaEditId = getLastId();  // Obtém o último ID
        despesaEditId++;  // Incrementa para criar novo ID
    } else {
        // Se já tem um ID, apenas incrementa
        despesaEditId++;
    }


    // Validação: verifica se a descrição já existe e não está em modo de edição
    if(descricaoExists(descricao) && !editting){
        inptDescricao.classList.add("border-red-500");  // Marca o campo em vermelho
        
        // Evita criar múltiplas mensagens de erro
        if(document.getElementById("errorMessage")){
            return;  // Mensagem já existe, sai da função
        } else {
            // Cria e exibe mensagem de erro
            let errorMessage = document.createElement("p");
            errorMessage.innerText = "A descrição já existe, por favor escolha outra descrição.";
            errorMessage.id = "errorMessage";
            errorMessage.classList.add("text-red-500", "text-sm", "mt-1", "ml-5");
            document.getElementById("divInptDesc").appendChild(errorMessage);
        } 
        return;  // Sai sem criar a despesa
    } else if(descricao == null || descricao == undefined || descricao == ""){
        inptDescricao.classList.add("border-red-500");  // Marca o campo em vermelho
        // Cria e exibe mensagem de erro para descrição vazia
        if(!document.getElementById("errorMessage")){
            let errorMessage = document.createElement("p");
            errorMessage.innerText = "Campo obrigatório!";
            errorMessage.id = "errorMessage";
            errorMessage.classList.add("text-red-500", "text-sm", "mt-1", "ml-5");
            document.getElementById("divInptDesc").appendChild(errorMessage);
        }
        return;  // Sai sem criar a despesa
    } else {
        // Cria nova instância de Despesa com os dados validados
        despesa = new Despesa(despesaEditId, descricao, valor, data);
        
        // Remove mensagem de erro anterior se existir
        if(document.getElementById("errorMessage")){
            inptDescricao.classList.remove("border-red-500");  // Remove marcação vermelha
            document.getElementById("errorMessage").remove();  // Remove mensagem de erro
        }
    }


    // Se está em modo de edição, substitui a despesa antiga pela nova
    if (editting) {
        listDespesas.forEach((element) => {
            if (element.descricao === despesa.descricao) {
                // Garante que não há duplicação usando varControl
                if (varControl == 0) {
                    deleteDespesa(element.id);  // Remove a despesa antiga
                    let elementEdited = new Despesa(despesaEditId, descricao, valor, data);
                    listDespesas.push(elementEdited);  // Adiciona a despesa editada
                    varControl = 1;  // Marca como processado
                }
            }
        });
        editting = false;  // Finaliza o modo de edição
        varControl = 0;    // Reseta o controle
    } else {
        // Adiciona a nova despesa à lista
        listDespesas.push(despesa);
    }

    // Persiste os dados no localStorage
    console.log(listDespesas);
    localStorage.setItem("despesas", JSON.stringify(listDespesas));

    // Limpa os campos do formulário
    inptDescricao.value = "";
    inptDescricao.removeAttribute("disabled");  // Habilita o campo para nova entrada
    inptValor.value = "";
    inptData.value = "";
    
    // Atualiza a tabela com os dados modificados
    renderizarTabela(listDespesas);

}

// === FUNÇÃO DE EXCLUSÃO ===
// Remove uma despesa da lista pelo ID
function deleteDespesa(id) {
    // Procura e remove a despesa com o ID especificado
    listDespesas.forEach((element) => {
        if (element.id === id) {
            listDespesas.splice(listDespesas.indexOf(element), 1);  // Remove do array
        }
    });
    // Persiste as alterações no localStorage
    localStorage.setItem("despesas", JSON.stringify(listDespesas));
    renderizarTabela();  // Atualiza a exibição
}

// === FUNÇÃO DE EDIÇÃO ===
// Carrega uma despesa existente no formulário para edição
function editDespesa(id) {
    // Procura a despesa pelo ID
    listDespesas.forEach((element) => {
        if (element.id == id) {
            // Preenche o formulário com os dados da despesa
            inptDescricao.value = element.descricao;
            inptDescricao.setAttribute("disabled", "disabled");  // Desabilita edição de descrição
            inptValor.value = element.valor;
            inptData.value = element.data;
            editting = true;  // Ativa o modo de edição
        }
    });
}
// === FUNÇÃO DE RECUPERAÇÃO DE DADOS ===
// Obtém a lista de despesas do localStorage
function getDespesas() {
    let despesasList = localStorage.getItem("despesas");  // Recupera dados armazenados
    return JSON.parse(despesasList) || [];  // Converte JSON em array ou retorna array vazio
}

// === FUNÇÃO DE RENDERIZAÇÃO ===
// Constrói e exibe a tabela com todas as despesas
function renderizarTabela() {
    // Obtém o corpo da tabela (tbody)
    let tbody = tableGrid.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";  // Limpa conteúdo anterior
    
    // Recupera as despesas do localStorage
    let despesasLocalStorage = getDespesas();

    // Itera sobre cada despesa e cria uma linha na tabela
    despesasLocalStorage.forEach(element => {
        // Cria um elemento de linha
        let tr = document.createElement("tr");

        // Define o HTML da linha com os dados da despesa e botões de ação
        tr.innerHTML = `<td class="border-r border-b p-2">${element.descricao}</td>
                <td class="border-r border-b p-2">${element.valor}</td>
                <td class="border-r border-b p-2">${element.data}</td>
                <td class="border-b p-2 flex justify-center items-center gap-2">
                            <button class="border p-2 bg-[#6a7282] text-white rounded-xl hover:scale-105" onclick="editDespesa(${element.id})">Editar</button>
                            <button class="border p-2 bg-red-500 rounded-xl text-white hover:scale-105" onclick="deleteDespesa(${element.id})">Excluir</button>
                </td>`;
        
        tableConstruction.push(tr.innerHTML);  // Adiciona ao array de construção (opcional)
        tbody.appendChild(tr);  // Insere a linha na tabela
    });
}

// === EVENT LISTENER DE INICIALIZAÇÃO ===
// Renderiza a tabela quando a página é carregada
addEventListener("DOMContentLoaded", function (e) {
    renderizarTabela();  // Carrega os dados do localStorage e exibe na tabela
});
