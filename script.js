document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. DICIONÁRIO DE ENDPOINTS POR LOJA
    // Mapeamento de 9 Lojas para 9 URLs de Apps Script (Uma Planilha por Loja)
    // =========================================================================
    
    // As constantes URL_PLANILHA_ANTIGA e URL_PLANILHA_NOVA foram removidas.
    
    const lojaEndpoints = {
        // Lojas Mapeadas (Ordem Numérica)
        [cite_start]'02 - Morada': 'https://script.google.com/macros/s/AKfycbzNEaGuuffVK7oD5kcyJDEcFxWCM2k_6JrbRWkfFQ0_VwKThTqosy45F84-TbVrmyhRlg/exec', [cite: 1]
        [cite_start]'05 - Visconde': 'https://script.google.com/macros/s/AKfycbx5H2lPfVNnVwRbf1INEaZ1DZr12KE2zH5w7IZqyXKWA1SjYCBkpHj1oPNyd24yzSQ/exec', [cite: 7]
        [cite_start]'09 - Vinhedo': 'https://script.google.com/macros/s/AKfycbzFiupzPyg7941a_JmyhgQSVkiYiKqtz8Vxq8ZFsuy80h8SniHAY7calpSIL-nMSzOdtQ/exec', [cite: 8]
        [cite_start]'10 - Conceição': 'https://script.google.com/macros/s/AKfycby_3QL9-xL_cGbKkMzbRr5GAZQ-jzu6P9fpjF9pp63lyYqStxbbxm7y0JAM4ALIxKnc/exec', [cite: 10]
        [cite_start]'12 - Elias Fausto': 'https://script.google.com/macros/s/AKfycbxyjitPDPUJalWxcnFkT2h1pf9_PAQlslFkNAxA4KZ0aTCSUg9Sn_7vGLB8T3CC4BwH/exec', [cite: 2]
        [cite_start]'13 - Maria José': 'https://script.google.com/macros/s/AKfycbx00ywLtjI7QmXgiHcebssfl0cV8vOSZ-Pug3ZlQ0Dlb_G7vYGdBS9BQGN6ce1T-YhacQ/exec', [cite: 3]
        [cite_start]'14 - Paula Leite': 'https://script.google.com/macros/s/AKfycbzexRszc2yOtSZtv0aznkNfkC3gROl229ToeHQ1ui5QhazZ-lAmOo3vDBPPcV4FxY6u/exec', [cite: 11]
        [cite_start]'15 - Salto': 'https://script.google.com/macros/s/AKfycbyVF62kF-gPgheKQI8B3kN9hGu0RXisr5-KI76s31FTYdOu8kBq4F3aBkYMbM5UHSrI/exec', [cite: 5]
        [cite_start]'16 - Itu': 'https://script.google.com/macros/s/AKfycbzz3XjqXVo9gl7KgYDNdzBHF89UID7xv-5ZUjBKTJc2277rqfEpdt-EfS8fJAIw_nfH/exec' [cite: 6]
    };

    const lacreInput = document.getElementById('lacre');
    const confirmarLacreInput = document.getElementById('confirmar-lacre');
    const form = document.getElementById('lacreForm');
    const successMessageDiv = document.getElementById('successMessage');
    const novoRegistroBtn = document.getElementById('novoRegistroBtn');
    const lojaSelect = document.getElementById('loja'); 
    
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

        // 3. Validação do Roteamento
        if (!appsScriptUrl) {
            alert('Atenção: A loja selecionada não possui um destino de planilha válido. Contate o suporte.');
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
        
        // 5. Prepara os dados
        const dataHora = new Date().toISOString();
        const dados = {
            lacre: lacre,
            loja: loja,
            operador: operador,
            dataHora: dataHora
        };

        // 6. Envia os dados para o endpoint correto
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
                form.style.display = 'none';
                successMessageDiv.style.display = 'block';
            } else {
                alert('Erro ao enviar os dados. O Web App pode ter retornado um erro. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Não foi possível conectar. Verifique sua internet.');
        }
    });

    // Evento do botão "Novo Registro"
    novoRegistroBtn.addEventListener('click', () => {
        form.style.display = 'block';
        successMessageDiv.style.display = 'none';
        form.reset();
        lacreInput.style.borderColor = '';
        confirmarLacreInput.style.borderColor = '';
        // Limpa o select
        lojaSelect.value = ""; 
    });
});
