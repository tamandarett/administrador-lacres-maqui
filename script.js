document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. DICIONÁRIO DE ENDPOINTS POR LOJA
    // Mapeia o nome da loja (valor do SELECT) diretamente para a URL correta.
    // =========================================================================
    
    // URL da Planilha Antiga (Lojas 02, 12, 13, 15, 16)
    const URL_PLANILHA_ANTIGA = 'https://script.google.com/macros/s/AKfycbzNEaGuuffVK7oD5kcyJDEcFxWCM2k_6JrbRWkfFQ0_VwKThTqosy45F84-TbVrmyhRlg/exec'; 
    
    // URL da Planilha Nova (Lojas 05, 09, 10, 14)
    const URL_PLANILHA_NOVA = 'https://script.google.com/macros/s/AKfycbzFiupzPyg7941a_JmyhgQSVkiYiKqtz8Vxq8ZFsuy80h8SniHAY7calpSIL-nMSzOdtQ/exec';

    const lojaEndpoints = {
        // Mapeamento para URL Antiga
        '02 - Morada': URL_PLANILHA_ANTIGA,
        '12 - Elias Fausto': URL_PLANILHA_ANTIGA,
        '13 - Maria José': URL_PLANILHA_ANTIGA,
        '15 - Salto': URL_PLANILHA_ANTIGA,
        '16 - Itu': URL_PLANILHA_ANTIGA,

        // Mapeamento para URL Nova
        '05 - Visconde': URL_PLANILHA_NOVA,
        '09 - Vinhedo': URL_PLANILHA_NOVA,
        '10 - Conceição': URL_PLANILHA_NOVA,
        '14 - Paula Leite': URL_PLANILHA_NOVA
    };

    const lacreInput = document.getElementById('lacre');
    const confirmarLacreInput = document.getElementById('confirmar-lacre');
    const form = document.getElementById('lacreForm');
    const successMessageDiv = document.getElementById('successMessage');
    const novoRegistroBtn = document.getElementById('novoRegistroBtn');
    const lojaSelect = document.getElementById('loja'); // O select de loja
    
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
        const loja = lojaSelect.value; // Pega a loja selecionada
        const operador = document.getElementById('operador').value;
        
        // 2. Determina o Endpoint com base na Loja Selecionada
        // Se a loja não estiver no mapa, o valor será undefined, o que é um erro.
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
