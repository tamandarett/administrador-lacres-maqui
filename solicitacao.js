// ============================================================
// SCRIPT DE SOLICITAÇÃO (FINAL E CORRIGIDO PARA APPS SCRIPT)
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
        // Removido o 'async'. Com 'no-cors', usamos apenas .then()
        formSolicitacao.addEventListener('submit', (e) => {
            e.preventDefault();

            const loja = document.getElementById("solicitacaoLoja").value;
            const nome = document.getElementById("solicitacaoNome").value;
            const obs = document.getElementById("solicitacaoObs").value;

            btnEnviar.disabled = true;
            btnEnviar.innerText = "Enviando...";
            msgRetorno.innerText = "";

            fetch(URL_API_SOLICITACAO, {
                method: "POST",
                mode: "no-cors", // <-- ISSO EVITA O ERRO DE REDIRECIONAMENTO DO GOOGLE
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ loja, solicitante: nome, obs })
            })
            .then(() => {
                // Com 'no-cors', a resposta é "opaca" (não conseguimos ler status 200).
                // Se a promessa resolveu, assumimos que o Google recebeu o pacote.
                msgRetorno.style.color = "green";
                msgRetorno.innerText = "✅ Pedido enviado com sucesso!";
                formSolicitacao.reset();
                
                setTimeout(() => {
                    modal.style.display = "none";
                    btnEnviar.disabled = false;
                    btnEnviar.innerText = "ENVIAR PEDIDO";
                    msgRetorno.innerText = "";
                }, 2000);
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                msgRetorno.style.color = "red";
                msgRetorno.innerText = "❌ Falha na conexão. Verifique sua internet.";
                btnEnviar.disabled = false;
                btnEnviar.innerText = "ENVIAR PEDIDO";
            });
        });
    }
});
