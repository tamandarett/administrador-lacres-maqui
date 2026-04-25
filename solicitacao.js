// ============================================================
// SCRIPT DE SOLICITAÇÃO (CORRIGIDO)
// ============================================================
const URL_API_SOLICITACAO = "https://script.google.com/macros/s/AKfycbzUnBsMDJ0xxXcX_tJUxwLDpVgtK6PvpgvZ7KgTb-Zj2-q2FsekKDO11yZWHQXtTD3h/exec";

const btnAbrir = document.getElementById("btnOpenSolicitacao");
const modal = document.getElementById("modalSolicitacao");
const btnFechar = document.querySelector(".close-modal");
const formSolicitacao = document.getElementById("formSolicitacao");
const msgRetorno = document.getElementById("msgRetorno");
// Agora o ID existe no HTML
const btnEnviar = document.getElementById("btnEnviarSolicitacao");

if(btnAbrir) {
    btnAbrir.onclick = function() {
        modal.style.display = "block";
        msgRetorno.innerText = "";
    }
}

if(btnFechar) {
    btnFechar.onclick = function() {
        modal.style.display = "none";
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

if(formSolicitacao) {
    formSolicitacao.onsubmit = function(event) {
        event.preventDefault(); 
        
        // Feedback visual seguro
        if(btnEnviar) {
            btnEnviar.innerText = "Enviando...";
            btnEnviar.disabled = true;
        }

        const dados = {
            loja: document.getElementById("solicitacaoLoja").value,
            solicitante: document.getElementById("solicitacaoNome").value,
            obs: document.getElementById("solicitacaoObs").value
        };

        fetch(URL_API_SOLICITACAO, {
            method: "POST",
            mode: 'no-cors', // Adicionado para evitar erro de CORS comum no Apps Script
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(dados)
        })
        .then(() => {
            msgRetorno.style.color = "green";
            msgRetorno.innerText = "✅ Pedido enviado com sucesso!";
            formSolicitacao.reset();
            
            setTimeout(() => {
                if(btnEnviar) {
                    btnEnviar.innerText = "ENVIAR PEDIDO";
                    btnEnviar.disabled = false;
                }
                modal.style.display = "none";
                msgRetorno.innerText = "";
            }, 2500);
        })
        .catch(error => {
            console.error("Erro:", error);
            msgRetorno.style.color = "red";
            msgRetorno.innerText = "❌ Erro ao enviar.";
            if(btnEnviar) {
                btnEnviar.innerText = "ENVIAR PEDIDO";
                btnEnviar.disabled = false;
            }
        });
    };
}
