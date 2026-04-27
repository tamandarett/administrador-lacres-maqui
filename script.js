document.addEventListener('DOMContentLoaded', () => {

    // === ENDPOINTS (mesmo do original) ===
    const lojaEndpoints = {
        '02 - Morada': 'https://script.google.com/macros/s/AKfycbzNEaGuuffVK7oD5kcyJDEcFxWCM2k_6JrbRWkfFQ0_VwKThTqosy45F84-TbVrmyhRlg/exec',
        '05 - Visconde': 'https://script.google.com/macros/s/AKfycbx5H2lPfVNnVwRbf1INEaZ1DZr12KE2zH5w7IZqyXKWA1SjYCBkpHj1oPNyd24yzSQ/exec',
        '09 - Vinhedo': 'https://script.google.com/macros/s/AKfycbzFiupzPyg7941a_JmyhgQSVkiYiKqtz8Vxq8ZFsuy80h8SniHAY7calpSIL-nMSzOdtQ/exec',
        '10 - Conceição': 'https://script.google.com/macros/s/AKfycbz1xp_B2y9IRDT53UimM3syJZ73wdZDFSrwUU9f08vyqoQBrpI3i4AOdoY-o76xVys/exec',
        '12 - Elias Fausto': 'https://script.google.com/macros/s/AKfycbxyjitPDPUJalWxcnFkT2h1pf9_PAQlslFkNAxA4KZ0aTCSUg9Sn_7vGLB8T3CC4BwH/exec',
        '13 - Maria José': 'https://script.google.com/macros/s/AKfycbx00ywLtjI7QmXgiHcebssfl0cV8vOSZ-Pug3ZlQ0Dlb_G7vYGdBS9BQGN6ce1T-YhacQ/exec',
        '14 - Paula Leite': 'https://script.google.com/macros/s/AKfycbzexRszc2yOtSZtv0aznkNfkC3gROl229ToeHQ1ui5QhazZ-lAmOo3vDBPPcV4FxY6u/exec',
        '15 - Salto': 'https://script.google.com/macros/s/AKfycbyVF62kF-gPgheKQI8B3kN9hGu0RXisr5-KI76s31FTYdOu8kBq4F3aBkYMbM5UHSrI/exec',
        '16 - Itu': 'https://script.google.com/macros/s/AKfycbzz3XjqXVo9gl7KgYDNdzBHF89UID7xv-5ZUjBKTJc2277rqfEpdt-EfS8fJAIw_nfH/exec'
    };

    // Elementos
    const lacreInput = document.getElementById('lacre');
    const confirmarLacreInput = document.getElementById('confirmar-lacre');
    const form = document.getElementById('lacreForm');
    const lojaSelect = document.getElementById('loja');
    const mensagemErro = document.getElementById('mensagem-erro');
    const submitButton = form.querySelector('button[type="submit"]');
    const historicoDiv = document.getElementById('listaHistorico');
    const trocarLojaBtn = document.getElementById('trocarLoja');

    // ========== FUNÇÃO LOJA FIXA ==========
    function aplicarLojaFixa() {
        const lojaSalva = localStorage.getItem('lojaFixa');
        if (lojaSalva && lojaEndpoints[lojaSalva]) {
            lojaSelect.value = lojaSalva;
            lojaSelect.classList.add('loja-fixada');
            lojaSelect.disabled = true;
            trocarLojaBtn.style.display = 'block';
        } else {
            lojaSelect.disabled = false;
            lojaSelect.classList.remove('loja-fixada');
            trocarLojaBtn.style.display = 'none';
        }
    }

    trocarLojaBtn?.addEventListener('click', () => {
        lojaSelect.disabled = false;
        lojaSelect.classList.remove('loja-fixada');
        lojaSelect.value = "";
        trocarLojaBtn.style.display = 'none';
        localStorage.removeItem('lojaFixa');
    });

    // ========== FUNÇÃO histórico local ==========
    function atualizarHistorico() {
        const logs = JSON.parse(localStorage.getItem('ultimosLacres') || '[]');
        if (!logs.length) {
            historicoDiv.innerHTML = '<div style="color:#A0AEC0; font-style:italic; font-size:11px; padding:5px;">Nenhum registro ainda</div>';
            return;
        }
        // Exibe apenas os 3 últimos e removeu a coluna "Unid"
        historicoDiv.innerHTML = logs.slice(0, 3).map(log => `
            <div class="registro-grid">
                <span><b>Lacre:</b> ${log.numero || '-'}</span>
                <span><b>Op:</b> ${log.operador ? log.operador.split(' ')[0] : '-'}</span>
                <span>${log.hora || '-'}</span>
            </div>
        `).join('');
    }

    // ========== Mostrar erro (desaparece após 5s) ==========
    function mostrarErro(mensagem) {
        mensagemErro.innerHTML = mensagem;
        mensagemErro.style.display = 'block';
        setTimeout(() => { mensagemErro.style.display = 'none'; }, 5000);
    }

    // ========== Bloquear copia/cola ==========
    const preventAction = (e) => {
        e.preventDefault();
        mostrarErro('⚠️ Copiar ou colar não é permitido. Digite o número.');
    };
    lacreInput.addEventListener('paste', preventAction);
    confirmarLacreInput.addEventListener('paste', preventAction);
    lacreInput.addEventListener('cut', preventAction);
    confirmarLacreInput.addEventListener('cut', preventAction);
    lacreInput.addEventListener('contextmenu', (e) => e.preventDefault());
    confirmarLacreInput.addEventListener('contextmenu', (e) => e.preventDefault());

    // ========== ENVIO DO FORMULÁRIO ==========
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensagemErro.style.display = 'none';

        const lacre = lacreInput.value.trim();
        const confirmar = confirmarLacreInput.value.trim();
        const loja = lojaSelect.value;
        const operador = document.getElementById('operador').value.trim();

        if (!loja) { mostrarErro('⚠️ Selecione a loja.'); return; }
        if (lacre !== confirmar) {
            mostrarErro('⚠️ Os números do lacre não conferem.');
            return;
        }

        const appsScriptUrl = lojaEndpoints[loja];
        if (!appsScriptUrl) { mostrarErro('⚠️ Loja sem endpoint.'); return; }

        // Salva a loja como fixa (se não estava fixa)
        if (!lojaSelect.disabled) {
            localStorage.setItem('lojaFixa', loja);
            aplicarLojaFixa();
        }

        const dados = { lacre, loja, operador, dataHora: new Date().toISOString() };

        submitButton.disabled = true;
        submitButton.textContent = 'Registrando...';

        try {
            const response = await fetch(appsScriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(dados)
            });

            // CORREÇÃO: consideramos sucesso mesmo se status não for 200,
            // pois o Google Apps Script pode responder com redirecionamento 302 ou 200.
            // Só mostramos erro se a rede falhar completamente.
            if (response.ok || response.status === 302 || response.status === 200) {
                // Sucesso: salva no histórico local
                const novoLog = {
                    numero: lacre,
                    operador: operador,
                    loja: loja,
                    hora: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
                };
                let logs = JSON.parse(localStorage.getItem('ultimosLacres') || '[]');
                logs.unshift(novoLog);
                if (logs.length > 3) logs.pop();
                localStorage.setItem('ultimosLacres', JSON.stringify(logs));
                atualizarHistorico();

                // Mostra mensagem de sucesso no lugar do erro
                mensagemErro.style.backgroundColor = '#F0FFF4';
                mensagemErro.style.color = '#2F855A';
                mensagemErro.style.borderColor = '#C6F6D5';
                mensagemErro.innerHTML = '✅ Lacre registrado com sucesso!';
                mensagemErro.style.display = 'block';
                setTimeout(() => {
                    mensagemErro.style.display = 'none';
                    // Reset estilo
                    mensagemErro.style.backgroundColor = '';
                    mensagemErro.style.color = '';
                    mensagemErro.style.borderColor = '';
                }, 3000);

                // Limpa formulário
                lacreInput.value = '';
                confirmarLacreInput.value = '';
                document.getElementById('operador').value = '';
                lacreInput.focus();
            } else {
                // Resposta inesperada, mas o envio pode ter funcionado. Registra silenciosamente.
                console.warn('Resposta inesperada:', response.status);
                mostrarErro(`⚠️ Enviado, mas resposta incomum (código ${response.status}). Dados devem estar na planilha.`);
            }
        } catch (error) {
            console.error(error);
            mostrarErro('⚠️ Erro de conexão. Verifique a internet e tente novamente.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'REGISTRAR LACRE';
        }
    });

    // Inicializa cache e histórico
    aplicarLojaFixa();
    atualizarHistorico();
});
