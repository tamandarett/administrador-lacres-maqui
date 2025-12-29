// URL da API (Script do Google Sheets)
const URL_API_SOLICITACAO = "https://script.google.com/macros/s/AKfycbzUnBsMDJ0xxXcX_tJUxwLDpVgtK6PvpgvZ7KgTb-Zj2-q2FsekKDO11yZWHQXtTD3h/exec";

// Elementos da tela
const btnAbrir = document.getElementById("btnOpenSolicitacao");
const modal = document.getElementById("modalSolicitacao");
const btnFechar = document.querySelector(".close-modal");
const formSolicitacao = document.getElementById("formSolicitacao");
const msgRetorno = document.getElementById("msgRetorno");
const btnEnviar = document.getElementById("btnEnviarSolicitacao");

// 1. Abrir o Modal
if(btnAbrir) {
    btnAbrir.onclick = function() {
        modal.style.display = "block";
        msgRetorno.innerText = "";
    }
}

// 2. Fechar o Modal no X
if(btnFechar) {
    btnFechar.onclick = function() {
        modal.style.display = "none";
    }
}

// 3. Fechar se clicar fora da caixinha
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// 4. Enviar os dados
if(formSolicitacao) {
    formSolicitacao.onsubmit = function(event) {
    event.preventDefault(); 

    // Feedback visual
    btnEnviar.innerText = "Enviando...";
    btnEnviar.disabled = true;

    // Coleta dados
    const dados = {
        loja: document.getElementById("solicitacaoLoja").value,
        solicitante: document.getElementById("solicitacaoNome").value,
        obs: document.getElementById("solicitacaoObs").value
    };

    // Envia para o Google Sheets
    fetch(URL_API_SOLICITACAO, {
        method: "POST",
        body: JSON.stringify(dados)
    })
    .then(response => {
        msgRetorno.style.color = "green";
        msgRetorno.innerText = "✅ Pedido enviado com sucesso!";
        formSolicitacao.reset();
        
        setTimeout(() => {
            btnEnviar.innerText = "Enviar Pedido";
            btnEnviar.disabled = false;
            modal.style.display = "none";
            msgRetorno.innerText = "";
        }, 2000);
    })
    .catch(error => {
        console.error("Erro:", error);
        msgRetorno.style.color = "red";
        msgRetorno.innerText = "❌ Erro ao enviar.";
        btnEnviar.innerText = "Enviar Pedido";
        btnEnviar.disabled = false;
    });
    }
}
