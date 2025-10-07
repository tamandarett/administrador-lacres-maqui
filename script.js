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
    
    // NOVO: Referência para o botão de envio para podermos desabilitá-lo
    const submitButton = form.querySelector('button[type="submit"]');

    // Funções para impedir copiar/colar e menu de contexto (MANTIDAS)
    const preventAction = (e) => {
        e.preventDefault();
        alert('Copiar, colar ou cortar não é permitido neste campo. Por favor, digite o número.');
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
            alert('Atenção: Por favor, selecione a Loja antes de registrar.');
            return;
        }

        if (!appsScriptUrl) {
            alert('ERRO DE ROTEAMENTO: Não foi possível encontrar o Web App para a loja ' + loja + '. Verifique o console ou contate o suporte.');
            return;
        }

        // 4. Validação dos campos de lacre
        lacreInput.style.borderColor = '';
        confirmarLacreInput.style.borderColor = '';

        if (lacre !== confirmarLacre) {
            alert('Atenção: Os números de lacre não são iguais. Por favor, verifique.');
            lacreInput.style.borderColor = 'red';
            confirmarLacreInput.style.borderColor = 'red';
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
            const response = await fetch(appsScriptUrl, { // Usa a URL roteada!
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
                // Falha do Web App (ex: erro 404, 500)
                console.error('Falha do Web App:', response.status, response.statusText);
                alert('Erro ao enviar os dados. O Web App retornou um erro (código: ' + response.status + '). Verifique se a URL está correta ou se o script está publicado.');
            }
        } catch (error) {
            // Falha de Conexão (ex: sem internet)
            console.error('Erro de conexão:', error);
            alert('Não foi possível conectar. Verifique sua internet ou tente novamente.');
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
        form.reset();
        lacreInput.style.borderColor = '';
        confirmarLacreInput.style.borderColor = '';
        lojaSelect.value = ""; 
    });
});
