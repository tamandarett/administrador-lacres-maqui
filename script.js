document.addEventListener('DOMContentLoaded', () => {

    // === ENDPOINTS DO GOOGLE APPS SCRIPT POR LOJA ===
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

    // Elementos DOM
    const lacreInput = document.getElementById('lacre');
    const confirmarLacreInput = document.getElementById('confirmar-lacre');
    const operadorInput = document.getElementById('operador');
    const form = document.getElementById('lacreForm');
    const lojaSelect = document.getElementById('loja');
    const mensagemBox = document.getElementById('mensagem-erro');
    const submitButton = form.querySelector('button[type="submit"]');
    const historicoDiv = document.getElementById('listaHistorico');
    const trocarLojaBtn = document.getElementById('trocarLoja');

    let timeoutMensagem = null;
    let enviandoRequisicao = false;

    // ========== EXIBIR MENSAGEM VISUAL ==========
    function exibirMensagem(texto, tipo = 'erro', duracao = 5000) {
        if (!mensagemBox) return;

        if (timeoutMensagem) {
            clearTimeout(timeoutMensagem);
            timeoutMensagem = null;
        }

        mensagemBox.className = `alerta-box alerta-${tipo}`;
        mensagemBox.innerHTML = texto;
        mensagemBox.style.display = 'block';

        if (duracao > 0) {
            timeoutMensagem = setTimeout(() => {
                mensagemBox.style.display = 'none';
            }, duracao);
        }
    }

    // ========== FUNÇÃO LOJA FIXA ==========
    function aplicarLojaFixa() {
        const lojaSalva = localStorage.getItem('lojaFixa');
        if (lojaSalva && lojaEndpoints[lojaSalva]) {
            lojaSelect.value = lojaSalva;
            lojaSelect.classList.add('loja-fixada');
            lojaSelect.disabled = true;
            if (trocarLojaBtn) trocarLojaBtn.style.display = 'block';
        } else {
            lojaSelect.disabled = false;
            lojaSelect.classList.remove('loja-fixada');
            if (trocarLojaBtn) trocarLojaBtn.style.display = 'none';
        }
    }

    if (trocarLojaBtn) {
        trocarLojaBtn.addEventListener('click', () => {
            lojaSelect.disabled = false;
            lojaSelect.classList.remove('loja-fixada');
            lojaSelect.value = '';
            trocarLojaBtn.style.display = 'none';
            localStorage.removeItem('lojaFixa');
            lojaSelect.focus();
        });
    }

    // ========== RESTAURAR OPERADOR SALVO (SE HOUVER) ==========
    const operadorSalvo = localStorage.getItem('ultimoOperador');
    if (operadorSalvo && operadorInput && !operadorInput.value) {
        operadorInput.value = operadorSalvo;
    }

    // ========== HISTÓRICO LOCAL ==========
    function atualizarHistorico() {
        if (!historicoDiv) return;
        const logs = JSON.parse(localStorage.getItem('ultimosLacres') || '[]');

        if (!logs.length) {
            historicoDiv.innerHTML = '<div style="color:#A0AEC0; font-style:italic; font-size:11px; padding:5px;">Nenhum registro ainda</div>';
            return;
        }

        historicoDiv.innerHTML = logs.slice(0, 3).map(log => `
            <div class="registro-grid">
                <span><b>Lacre:</b> ${log.numero || '-'} ${log.pendente ? '<span class="badge-pendente" title="Salvo offline, aguardando envio">Pendente</span>' : ''}</span>
                <span><b>Op:</b> ${log.operador ? log.operador.split(' ')[0] : '-'}</span>
                <span>${log.hora || '-'}</span>
            </div>
        `).join('');
    }

    function salvarRegistroHistorico(registro) {
        let logs = JSON.parse(localStorage.getItem('ultimosLacres') || '[]');
        // Remove se já houver registro pendente idêntico para evitar poluição visual
        logs = logs.filter(l => !(l.numero === registro.numero && l.pendente && !registro.pendente));
        logs.unshift(registro);
        if (logs.length > 5) logs.pop();
        localStorage.setItem('ultimosLacres', JSON.stringify(logs));
        atualizarHistorico();
    }

    // ========== VERIFICAÇÃO DE LACRE DUPLICADO RECENTE ==========
    function verificarDuplicadoRecente(numero, loja) {
        const logs = JSON.parse(localStorage.getItem('ultimosLacres') || '[]');
        const pendentes = JSON.parse(localStorage.getItem('lacresPendentes') || '[]');
        const todos = [...pendentes, ...logs];

        return todos.find(item => item.numero === numero && item.loja === loja);
    }

    // ========== FILA OFFLINE DE CONTINGÊNCIA ==========
    function salvarPendente(dados) {
        const pendentes = JSON.parse(localStorage.getItem('lacresPendentes') || '[]');
        // Evita duplicatas na própria fila pendente
        const jaExiste = pendentes.some(p => p.lacre === dados.lacre && p.loja === dados.loja);
        if (!jaExiste) {
            pendentes.push(dados);
            localStorage.setItem('lacresPendentes', JSON.stringify(pendentes));
        }
    }

    async function sincronizarPendentes() {
        const pendentes = JSON.parse(localStorage.getItem('lacresPendentes') || '[]');
        if (!pendentes.length) return;

        const naoEnviados = [];
        let enviadosComSucesso = 0;

        for (const item of pendentes) {
            const url = lojaEndpoints[item.loja];
            if (!url) continue;

            try {
                await fetch(url, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(item)
                });
                enviadosComSucesso++;
            } catch (e) {
                naoEnviados.push(item);
            }
        }

        localStorage.setItem('lacresPendentes', JSON.stringify(naoEnviados));

        if (enviadosComSucesso > 0) {
            // Remove flags de pendente do histórico local
            let logs = JSON.parse(localStorage.getItem('ultimosLacres') || '[]');
            logs = logs.map(l => ({ ...l, pendente: false }));
            localStorage.setItem('ultimosLacres', JSON.stringify(logs));
            atualizarHistorico();
            exibirMensagem(`☁️ ${enviadosComSucesso} lacre(s) pendente(s) sincronizado(s) com sucesso!`, 'sucesso', 4000);
        }
    }

    // Tenta sincronizar ao carregar a página e quando a rede voltar
    window.addEventListener('online', sincronizarPendentes);
    setTimeout(sincronizarPendentes, 1500);

    // ========== BLOQUEIO DE COPIAR / COLAR ==========
    const bloquearAcaoColar = (e) => {
        e.preventDefault();
        exibirMensagem('⚠️ Copiar ou colar não é permitido. Digite o número do lacre.', 'erro', 4000);
    };

    [lacreInput, confirmarLacreInput].forEach(el => {
        if (!el) return;
        el.addEventListener('paste', bloquearAcaoColar);
        el.addEventListener('cut', bloquearAcaoColar);
        el.addEventListener('drop', (e) => e.preventDefault());
        el.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    // ========== ENVIO DO FORMULÁRIO COM PROTEÇÃO ==========
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Evita submissões simultâneas / múltiplos cliques rápidos
        if (enviandoRequisicao) return;

        const lacre = lacreInput.value.trim();
        const confirmar = confirmarLacreInput.value.trim();
        const loja = lojaSelect.value;
        const operador = operadorInput.value.trim();

        // Validações básicas
        if (!loja) {
            exibirMensagem('⚠️ Selecione a loja.', 'erro', 4000);
            lojaSelect.focus();
            return;
        }

        if (!operador) {
            exibirMensagem('⚠️ Informe o nome do operador.', 'erro', 4000);
            operadorInput.focus();
            return;
        }

        if (!lacre || !confirmar) {
            exibirMensagem('⚠️ Preencha os campos de número do lacre.', 'erro', 4000);
            return;
        }

        if (lacre !== confirmar) {
            exibirMensagem('⚠️ Os números do lacre não conferem.', 'erro', 4000);
            confirmarLacreInput.focus();
            return;
        }

        const appsScriptUrl = lojaEndpoints[loja];
        if (!appsScriptUrl) {
            exibirMensagem('⚠️ Endpoint não configurado para esta loja.', 'erro', 5000);
            return;
        }

        // Validação anti-duplicidade recente (protege contra reenvios acidentais)
        const duplicado = verificarDuplicadoRecente(lacre, loja);
        if (duplicado) {
            const confirmarReenvio = window.confirm(
                `⚠️ ATENÇÃO: O lacre Nº ${lacre} já foi registrado hoje às ${duplicado.hora} por ${duplicado.operador || 'operador'}.\n\nTem certeza de que deseja registrar o mesmo número de lacre novamente?`
            );
            if (!confirmarReenvio) {
                return;
            }
        }

        // Salva a loja e o operador para facilitar próximos registros
        if (!lojaSelect.disabled) {
            localStorage.setItem('lojaFixa', loja);
            aplicarLojaFixa();
        }
        localStorage.setItem('ultimoOperador', operador);

        // Bloqueia botão e ativa estado de envio
        enviandoRequisicao = true;
        submitButton.disabled = true;
        submitButton.textContent = 'Registrando...';

        const agora = new Date();
        const horaFormatada = agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dados = {
            lacre,
            loja,
            operador,
            dataHora: agora.toISOString()
        };

        try {
            // Envio com mode: 'no-cors' para contornar redirecionamentos do Google Apps Script
            await fetch(appsScriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(dados)
            });

            // Sucesso garantido (a requisição foi recebida e processada pelo Google)
            salvarRegistroHistorico({
                numero: lacre,
                operador: operador,
                loja: loja,
                hora: horaFormatada,
                pendente: false,
                timestamp: Date.now()
            });

            exibirMensagem(`✅ Lacre ${lacre} registrado com sucesso!`, 'sucesso', 4000);

            // Limpa apenas os campos de lacre para nova digitação
            lacreInput.value = '';
            confirmarLacreInput.value = '';
            lacreInput.focus();

            // Feedback no botão e cooldown de 2s para impedir cliques em disparada
            submitButton.textContent = '✅ REGISTRADO!';
            submitButton.style.backgroundColor = '#2F855A';

            setTimeout(() => {
                submitButton.style.backgroundColor = '';
                submitButton.textContent = 'REGISTRAR LACRE';
                submitButton.disabled = false;
                enviandoRequisicao = false;
            }, 2000);

        } catch (error) {
            console.warn('Falha de conexão com a internet:', error);

            // Salva na fila de pendências locais
            salvarPendente(dados);

            salvarRegistroHistorico({
                numero: lacre,
                operador: operador,
                loja: loja,
                hora: horaFormatada,
                pendente: true,
                timestamp: Date.now()
            });

            exibirMensagem(`📡 Sem conexão no momento. O lacre ${lacre} foi salvo neste computador e será enviado automaticamente quando a internet voltar.`, 'aviso', 8000);

            // Limpa os campos para o operador não ficar preso
            lacreInput.value = '';
            confirmarLacreInput.value = '';
            lacreInput.focus();

            submitButton.textContent = 'REGISTRAR LACRE';
            submitButton.disabled = false;
            enviandoRequisicao = false;
        }
    });

    // Inicializa estado da loja fixa e histórico
    aplicarLojaFixa();
    atualizarHistorico();
});
