// ============================================================
// SCRIPT DE SOLICITAÇÃO (UNIFICADO E CORRIGIDO)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const URL_API_SOLICITACAO = "https://script.google.com/macros/s/AKfycbzUnBsMDJ0xxXcX_tJUxwLDpVgtK6PvpgvZ7KgTb-Zj2-q2FsekKDO11yZWHQXtTD3h/exec";
    
    const btnAbrir = document.getElementById("btnOpenSolicitacao");
    const modal = document.getElementById("modalSolicitacao");
    const btnFechar = document.querySelector(".close-modal");
    const formSolicitacao = document.getElementById("formSolicitacao");
    const msgRetorno = document.getElementById("msgRetorno");
    const btnEnviar = document.getElementById("btnEnviarSolicitacao");

    // Gerenciamento de abertura/fechamento do Modal
    if (btnAbrir) btnAbrir.onclick = () => { modal.style.display = "block"; msgRetorno.innerText = ""; };
    if (btnFechar) btnFechar.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

    if (formSolicitacao) {
        formSolicitacao.addEventListener('submit', async (e) => {
            e.preventDefault();

            const loja = document.getElementById("solicitacaoLoja").value;
            const nome = document.getElementById("solicitacaoNome").value;
            const obs = document.getElementById("solicitacaoObs").value;

            btnEnviar.disabled = true;
            btnEnviar.innerText = "Enviando...";
            msgRetorno.innerText = "";

            try {
                const response = await fetch(URL_API_SOLICITACAO, {
                    method: "POST",
                    // Enviar como text/plain evita que o Google bloqueie por CORS na entrada
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({ loja, solicitante: nome, obs })
                });

                // Apps Script geralmente retorna 200 (OK) ou 302 (Redirecionamento) em envios bem sucedidos
                if (response.ok || response.status === 302) {
                    msgRetorno.style.color = "green";
                    msgRetorno.innerText = "✅ Pedido enviado com sucesso!";
                    formSolicitacao.reset();
                    
                    setTimeout(() => {
                        modal.style.display = "none";
                        btnEnviar.disabled = false;
                        btnEnviar.innerText = "ENVIAR PEDIDO";
                        msgRetorno.innerText = "";
                    }, 2000);
                } else {
                    msgRetorno.style.color = "red";
                    msgRetorno.innerText = `❌ Erro de comunicação (Status ${response.status}).`;
                    btnEnviar.disabled = false;
                    btnEnviar.innerText = "ENVIAR PEDIDO";
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                msgRetorno.style.color = "red";
                msgRetorno.innerText = "❌ Falha na conexão. Verifique sua internet.";
                btnEnviar.disabled = false;
                btnEnviar.innerText = "ENVIAR PEDIDO";
            }
        });
    }
});
