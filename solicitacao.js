document.addEventListener('DOMContentLoaded', function() {
    const URL_API_SOLICITACAO = "https://script.google.com/macros/s/AKfycbzUnBsMDJ0xxXcX_tJUxwLDpVgtK6PvpgvZ7KgTb-Zj2-q2FsekKDO11yZWHQXtTD3h/exec";

    const btnAbrir = document.getElementById("btnOpenSolicitacao");
    const modal = document.getElementById("modalSolicitacao");
    const btnFechar = document.querySelector(".close-modal");
    const formSolicitacao = document.getElementById("formSolicitacao");
    const msgRetorno = document.getElementById("msgRetorno");
    const solicitacaoLoja = document.getElementById("solicitacaoLoja");
    const solicitacaoNome = document.getElementById("solicitacaoNome");

    // 1. Abrir o Modal
    if(btnAbrir) {
        btnAbrir.onclick = function() {
            modal.style.display = "block";
            msgRetorno.innerText = "";
            
            // Pré-preenche com a loja fixada e o operador se existirem
            const lojaSalva = localStorage.getItem('lojaFixa');
            if (lojaSalva && solicitacaoLoja) {
                solicitacaoLoja.value = lojaSalva;
            }
            const operadorSalvo = localStorage.getItem('ultimoOperador');
            if (operadorSalvo && solicitacaoNome && !solicitacaoNome.value) {
                solicitacaoNome.value = operadorSalvo;
            }
        };
    }

    // 2. Fechar o Modal no X
    if(btnFechar) {
        btnFechar.onclick = function() {
            modal.style.display = "none";
        };
    }

    // 3. Fechar se clicar fora
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // 4. Enviar os dados
    if(formSolicitacao) {
        let enviando = false;

        formSolicitacao.onsubmit = async function(event) {
            event.preventDefault(); 
            if (enviando) return;

            const btnEnviar = formSolicitacao.querySelector('button[type="submit"]');
            if(btnEnviar) {
                btnEnviar.innerText = "Enviando...";
                btnEnviar.disabled = true;
            }
            enviando = true;

            const dados = {
                loja: document.getElementById("solicitacaoLoja").value,
                solicitante: document.getElementById("solicitacaoNome").value,
                obs: document.getElementById("solicitacaoObs").value,
                dataHora: new Date().toISOString()
            };

            try {
                // Envio com mode: 'no-cors' para contornar redirecionamentos do Apps Script
                await fetch(URL_API_SOLICITACAO, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify(dados)
                });

                msgRetorno.style.color = "#276749";
                msgRetorno.innerText = "✅ Pedido enviado com sucesso!";
                document.getElementById("solicitacaoObs").value = '';
                
                setTimeout(() => {
                    if(btnEnviar) {
                        btnEnviar.innerText = "ENVIAR PEDIDO";
                        btnEnviar.disabled = false;
                    }
                    modal.style.display = "none";
                    msgRetorno.innerText = "";
                    enviando = false;
                }, 2000);

            } catch (error) {
                console.error("Erro ao solicitar reposição:", error);
                msgRetorno.style.color = "#C53030";
                msgRetorno.innerText = "❌ Erro de conexão ao enviar. Tente novamente.";
                if(btnEnviar) {
                    btnEnviar.innerText = "ENVIAR PEDIDO";
                    btnEnviar.disabled = false;
                }
                enviando = false;
            }
        };
    }
});
