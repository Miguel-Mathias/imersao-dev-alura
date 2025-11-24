let cardContainer = document.querySelector(".card-Container");
let campoBusca = document.querySelector("input[type='text']");
let dados = []; // Variável global para armazenar todos os dados

// Função para renderizar a mensagem inicial interativa (Gota de Sangue)
function renderizarMensagemInicial() {
    cardContainer.innerHTML = `
        <div class="interactive-message">
            <span class="blood-drop"></span>
            <p>Os laços de 'Sempre e Para Sempre' esperam. Digite o nome de um Original ou um familiar para começar sua busca!</p>
        </div>
    `;
}

// Função para carregar os dados do JSON (apenas carrega na memória, não renderiza inicialmente)
async function carregarDados() {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        // Exibe uma mensagem de erro SÓ SE a carga falhar
        cardContainer.innerHTML = `<p class="interactive-message">Não foi possível carregar os dados. Verifique a execução no Live Server.</p>`;
    }
}

// Função para iniciar a busca/filtro (acionada pelo botão ou 'Enter')
function iniciarBusca() {
    // 1. Pega o termo digitado, remove espaços e converte para minúsculas
    const termoBusca = campoBusca.value.toLowerCase().trim();

    // 2. Se o campo de busca estiver vazio, limpa a tela (sem mensagem inicial)
    if (termoBusca === "") {
        renderizarCards([]); 
        return; 
    }

    // 3. Filtra o array 'dados'
    const dadosFiltrados = dados.filter(dado => 
        // Verifica se o termo está no nome OU na descrição
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.descricao.toLowerCase().includes(termoBusca)
    );

    // 4. Renderiza os cards com base nos dados filtrados
    renderizarCards(dadosFiltrados);
}

// Função para renderizar os cards dinamicamente
function renderizarCards(dados) {
    // Limpa o container
    cardContainer.innerHTML = ''; 

    // Se não há dados, verifica o que exibir
    if (dados.length === 0) {
        const termoBusca = campoBusca.value.toLowerCase().trim();

        if (termoBusca === "") {
             // Se a busca estiver vazia, exibe a mensagem interativa (tela inicial)
             renderizarMensagemInicial();
        } else {
             // Se a busca NÃO estiver vazia, exibe a mensagem de 'Nenhum resultado'
             cardContainer.innerHTML = `<p class="interactive-message">Nenhum resultado encontrado para sua busca: <strong>${campoBusca.value}</strong>.</p>`;
        }
        return;
    }

    // Se houver dados, renderiza os cards normalmente
    for(let dado of dados){
        let article = document.createElement("article");
        article.classList.add("card");
        
        // Renderização com o link do Instagram
        article.innerHTML = `
            <h2>${dado.nome}</h2>            
            <p>${dado.descricao}</p>
            <p><strong>Primeira Aparição (Ano/Flashback):</strong> ${dado.ano}</p>
            
            <a href="https://www.instagram.com/${dado.instagram.replace('@', '')}" target="_blank">
                Instagram do ator/atriz
            </a>
        `;
        
        cardContainer.appendChild(article);
    }
}

// 1. Adiciona um listener para a tecla 'Enter' no campo de busca.
campoBusca.addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
        iniciarBusca();
    }
});

// 2. Ação inicial ao carregar a página:
// Carrega os dados na memória e, em seguida, exibe a mensagem inicial.
window.onload = async () => {
    await carregarDados(); 
    renderizarMensagemInicial(); 
}