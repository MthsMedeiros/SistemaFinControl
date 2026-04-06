// === VARIÁVEIS GLOBAIS ===
// Elementos de entrada do formulário
let inptDescricao = document.getElementById("inpDescReceita");  // Campo para descrição da receita
let inptValor = document.getElementById("inpValorReceita");    // Campo para valor da receita
let inptData = document.getElementById("inpDataReceita");      // Campo para data da receita

// Dados e elementos da interface
let listReceitas = getReceitas();         // Lista de receitas armazenada no localStorage
let tableGrid = document.getElementById("tableGrid");  // Tabela que exibe as receitas
let tableConstruction = [];               // Array para construir as linhas da tabela
let editting = false;                     // Flag indicando se está em modo de edição
let receitaEditId = 0;                    // ID da receita sendo editada

// === CLASSE RECEITA ===
// Modelo de dados para uma receita
class Receita {
    // Construtor que recebe os dados da receita
    constructor(id, descricao, valor, data) {
        this.id = id;              // Identificador único da receita
        this.descricao = descricao; // Descrição/fonte da receita
        this.valor = valor;        // Valor recebido
        this.data = data;          // Data da receita
    }
}

// === FUNÇÕES UTILITÁRIAS ===
// Limpa os campos de entrada e habilita o campo de descrição
function clearfields() {
    inptDescricao.removeAttribute("disabled");  // Remove a desabilitação do campo de descrição
}

// Obtém o maior ID existente na lista de receitas
function getLastId() {
    let lastId = 0;
    // Percorre a lista procurando pelo maior ID
    listReceitas.forEach((element) => {
        if (element.id > lastId) {
            lastId = element.id;  // Atualiza o maior ID encontrado
        }
    });
    return lastId;  // Retorna o maior ID para usar como base para o próximo
}

// Verifica se a descrição já existe na lista (evita duplicatas)
function descricaoExists(descricao) {
    return listReceitas.some((element) => element.descricao.toLowerCase() === descricao.toLowerCase());

}


// === FUNÇÃO PRINCIPAL DE CRIAÇÃO/EDIÇÃO ===
// Cria uma nova receita ou atualiza uma existente
function createReceita() {
    let varControl = 0;  // Controle para evitar duplicação na edição
    let descricao = inptDescricao.value;  // Obtém a descrição do formulário
    let valor = new Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(inptValor.value);  // Obtém o valor do formulário
    // Converte data do formato YYYY-MM-DD para DD/MM/YYYY
    let data = inptData.value.split("-").reverse().join("/");
    let receita;  // Variável que armazenará a nova receita

    // Gera um novo ID se não estiver editando
    if (receitaEditId == 0) {
        receitaEditId = getLastId();  // Obtém o último ID
        receitaEditId++;  // Incrementa para criar novo ID
    } else {
        // Se já tem um ID, apenas incrementa
        receitaEditId++;
    }

    // Validação: verifica se a descrição já existe e não está em modo de edição
    if (descricaoExists(descricao) && !editting) {
        inptDescricao.classList.add("border-red-500");  // Marca o campo em vermelho

        // Evita criar múltiplas mensagens de erro
        if (document.getElementById("errorMessage")) {
            return;  // Mensagem já existe, sai da função
        } else {
            // Cria e exibe mensagem de erro
            let errorMessage = document.createElement("p");
            errorMessage.innerText = "A descrição já existe, por favor escolha outra descrição.";
            errorMessage.id = "errorMessage";
            errorMessage.classList.add("text-red-500", "text-sm", "mt-1", "ml-5");
            document.getElementById("divInptDesc").appendChild(errorMessage);
        }
        return;  // Sai sem criar a receita
    } else if (descricao == null || descricao == undefined || descricao == "") {
        inptDescricao.classList.add("border-red-500");  // Marca o campo em vermelho
        // Cria e exibe mensagem de erro para descrição vazia
        if (!document.getElementById("errorMessage")) {
            let errorMessage = document.createElement("p");
            errorMessage.innerText = "Campo obrigatório!";
            errorMessage.id = "errorMessage";
            errorMessage.classList.add("text-red-500", "text-sm", "mt-1", "ml-5");
            document.getElementById("divInptDesc").appendChild(errorMessage);
        }
        return;  // Sai sem criar a receita
    } else {
        // Cria nova instância de Receita com os dados validados
        receita = new Receita(receitaEditId, descricao, valor, data);

        // Remove mensagem de erro anterior se existir
        if (document.getElementById("errorMessage")) {
            inptDescricao.classList.remove("border-red-500");  // Remove marcação vermelha
            document.getElementById("errorMessage").remove();  // Remove mensagem de erro
        }
    }





    // Se está em modo de edição, substitui a receita antiga pela nova
    if (editting) {
        listReceitas.forEach((element) => {
            if (element.descricao === receita.descricao) {
                // Garante que não há duplicação usando varControl
                if (varControl == 0) {
                    deleteReceita(element.id);  // Remove a receita antiga
                    let elementEdited = new Receita(receitaEditId, descricao, valor, data);
                    listReceitas.push(elementEdited);  // Adiciona a receita editada
                    varControl = 1;  // Marca como processado
                }
            }
        });
        editting = false;  // Finaliza o modo de edição
        varControl = 0;    // Reseta o controle
    } else {
        // Adiciona a nova receita à lista
        listReceitas.push(receita);
    }

    // Persiste os dados no localStorage
    console.log(listReceitas);
    localStorage.setItem("receitas", JSON.stringify(listReceitas));

    // Limpa os campos do formulário
    inptDescricao.value = "";
    inptDescricao.removeAttribute("disabled");  // Habilita o campo para nova entrada
    inptValor.value = "";
    inptData.value = "";

    // Atualiza a tabela com os dados modificados
    renderizarTabela(listReceitas);

}

// === FUNÇÃO DE EXCLUSÃO ===
// Remove uma receita da lista pelo ID
function deleteReceita(id) {
    // Procura e remove a receita com o ID especificado
    listReceitas.forEach((element) => {
        if (element.id === id) {
            listReceitas.splice(listReceitas.indexOf(element), 1);  // Remove do array
        }
    });
    // Persiste as alterações no localStorage
    localStorage.setItem("receitas", JSON.stringify(listReceitas));
    renderizarTabela();  // Atualiza a exibição
}

// === FUNÇÃO DE EDIÇÃO ===
// Carrega uma receita existente no formulário para edição
function editReceita(id) {
    // Procura a receita pelo ID
    listReceitas.forEach((element) => {
        if (element.id == id) {
            // Preenche o formulário com os dados da receita
            inptDescricao.value = element.descricao;
            inptDescricao.setAttribute("disabled", "disabled");  // Desabilita edição de descrição
            inptValor.value = element.valor;
            inptData.value = element.data;
            editting = true;  // Ativa o modo de edição
        }
    });
}
// === FUNÇÃO DE RECUPERAÇÃO DE DADOS ===
// Obtém a lista de receitas do localStorage
function getReceitas() {
    let receitasList = localStorage.getItem("receitas");  // Recupera dados armazenados
    return JSON.parse(receitasList) || [];  // Converte JSON em array ou retorna array vazio
}

// === FUNÇÃO DE RENDERIZAÇÃO ===
// Constrói e exibe a tabela com todas as receitas
function renderizarTabela() {
    // Obtém o corpo da tabela (tbody)
    let tbody = tableGrid.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";  // Limpa conteúdo anterior

    // Recupera as receitas do localStorage
    let receitaLocalStorage = getReceitas();

    // Itera sobre cada receita e cria uma linha na tabela
    receitaLocalStorage.forEach(element => {
        // Cria um elemento de linha
        let tr = document.createElement("tr");

        // Define o HTML da linha com os dados da receita e botões de ação
        tr.innerHTML = `<td class="border-r border-b p-2">${element.descricao}</td>
                <td class="border-r border-b p-2">R$ ${element.valor}</td>
                <td class="border-r border-b p-2">${element.data}</td>
                <td class="border-b p-2 flex justify-center items-center gap-2">
                            <button class="border p-2 bg-[#6a7282] text-white rounded-xl hover:scale-105" onclick="editReceita(${element.id})">Editar</button>
                            <button class="border p-2 bg-red-500 rounded-xl text-white hover:scale-105" onclick="deleteReceita(${element.id})">Excluir</button>
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
