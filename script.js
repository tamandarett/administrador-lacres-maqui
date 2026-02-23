document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. DICIONÁRIO DE ENDPOINTS POR LOJA
    // Mapeamento de 9 Lojas para 9 URLs de Apps Script (Uma Planilha por Loja)
    // =========================================================================
    
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

    const lacreInput = document.getElementById('lacre');
    const confirmarLacreInput = document.getElementById('confirmar-lacre');
    const form = document.getElementById('lacreForm');
    const successMessageDiv = document.getElementById('successMessage');
    const novoRegistroBtn = document.getElementById('novoRegistroBtn');
    const lojaSelect = document.getElementById('loja');
    const mensagemErro = document.getElementById('mensagem-erro');
    
    // Referência para o botão de envio
    const submitButton = form.querySelector('button[type="submit"]');

    // Função centralizada para exibir erros na tela
    function mostrarErro(mensagem) {
        mensagemErro.innerHTML = mensagem;
        mensagemErro.style.display = 'block';
        
        // Faz o erro desaparecer sozinho após 5 segundos para limpar a tela
        setTimeout(() => {
            mensagemErro.style.display = 'none';
        }, 5000);
    }

    // Funções para impedir copiar/colar e menu de contexto (Modernizada)
    const preventAction = (e) => {
        e.preventDefault();
        mostrarErro('⚠️ Copiar ou colar não é permitido por segurança. Digite o número.');
    };
    lacreInput.addEventListener('paste', preventAction);
    confirmarLacreInput.addEventListener('paste', preventAction);
    lacreInput.addEventListener('cut', preventAction);
    confirmarLacreInput.addEventListener('cut', preventAction);
    lacreInput.addEventListener('contextmenu', (e) => e.preventDefault());
    confirmarLacreInput.addEventListener('contextmenu', (e) => e.preventDefault());

    // Evento de envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Oculta erros anteriores a cada nova tentativa
        mensagemErro.style.display = 'none';

        // 1. Pega os valores
        const lacre = lacreInput.value;
        const confirmarLacre = confirmarLacreInput.value;
        const loja = lojaSelect.value;
        const operador = document.getElementById('operador').value;
        
        // 2. Determina o Endpoint com base na Loja Selecionada
        const appsScriptUrl = lojaEndpoints[loja];
        
        // PONTO DE DEBUG
        console.log('--- Tentativa de Envio ---');
        console.log('Loja Selecionada:', loja);
        console.log('Apps Script URL para envio:', appsScriptUrl);

        // 3. Validação do Roteamento
        if (!loja) {
            mostrarErro('⚠️ Por favor, selecione a Loja antes de registrar.');
            return;
        }

        if (!appsScriptUrl) {
            mostrarErro(`⚠️ Erro de Roteamento: Rota da loja ${loja} não encontrada.`);
            return;
        }

        // 4. Validação dos campos de lacre
        lacreInput.style.borderColor = '';
        confirmarLacreInput.style.borderColor = '';

        if (lacre !== confirmarLacre) {
            mostrarErro('⚠️ Os números do lacre não conferem. Por favor, verifique.');
            lacreInput.style.borderColor = '#C53030'; // Vermelho erro
            confirmarLacreInput.style.borderColor = '#C53030';
            return;
        }
        
        // =========================================================
        // 5. PROTEÇÃO CONTRA CLIQUE DUPLO
        // =========================================================
        submitButton.disabled = true;
        submitButton.textContent = 'Registrando... Por favor, aguarde.';

        // 6. Prepara os dados
        const dataHora = new Date().toISOString();
        const dados = {
            lacre: lacre,
            loja: loja,
            operador: operador,
            dataHora: dataHora
        };

        // 7. Envia os dados para o endpoint correto
        try {
            const response = await fetch(appsScriptUrl, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                // Sucesso
                console.log('Sucesso: Dados enviados para o Web App.');
                form.style.display = 'none';
                successMessageDiv.style.display = 'block';
            } else {
                // Falha do Web App
                console.error('Falha do Web App:', response.status, response.statusText);
                mostrarErro(`⚠️ Erro do sistema (Código: ${response.status}). Tente novamente.`);
            }
        } catch (error) {
            // Falha de Conexão (ex: sem internet)
            console.error('Erro de conexão:', error);
            mostrarErro('⚠️ Não foi possível conectar. Verifique a internet e tente novamente.');
        } finally {
            // =========================================================
            // 8. FIM DA PROTEÇÃO: SEMPRE reabilita o botão
            // =========================================================
            submitButton.disabled = false;
            submitButton.textContent = 'Registrar Lacre';
        }
    });

    // Evento do botão "Novo Registro"
    novoRegistroBtn.addEventListener('click', () => {
        form.style.display = 'block';
        successMessageDiv.style.display = 'none';
        mensagemErro.style.display = 'none'; // Garante que a caixa de erro suma
        form.reset();
        lacreInput.style.borderColor = '';
        confirmarLacreInput.style.borderColor = '';
        lojaSelect.value = ""; 
    });
});
