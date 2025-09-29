document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. DICIONÁRIO DE ENDPOINTS (Web App URLs)
    // ATENÇÃO: Confirme se essas URLs são as corretas para a Planilha Antiga e a Planilha Nova.
    // =========================================================================
    const scriptEndpoints = {
        // 'grupo_1' (Lojas 02, 12, 13, 15, 16) - SUA URL ORIGINAL
        'grupo_1': 'https://script.google.com/macros/s/AKfycbzNEaGuuffVK7oD5kcyJDEcFxWCM2k_6JrbRWkfFQ0_VwKThTqosy45F84-TbVrmyhRlg/exec',
        
        // 'grupo_2' (Lojas 05, 09, 10, 14) - SUA NOVA URL
        'grupo_2': 'https://script.google.com/macros/s/AKfycbzFiupzPyg7941a_JmyhgQSVkiYiKqtz8Vxq8ZFsuy80h8SniHAY7calpSIL-nMSzOdtQ/exec'
    };

    const lacreInput = document.getElementById('lacre');
    const confirmarLacreInput = document.getElementById('confirmar-lacre');
    const form = document.getElementById('lacreForm');
    const successMessageDiv = document.getElementById('successMessage');
    const novoRegistroBtn = document.getElementById('novoRegistroBtn');
    const grupoLojaInput = document.getElementById('grupo_loja'); 
    
    // Funções para impedir copiar/colar e menu de contexto
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
        const loja = document.getElementById('loja').value;
        const operador = document.getElementById('operador').value;
        const selectedGroup = grupoLojaInput.value; // Pega o grupo selecionado
        
        // 2. Determina o Endpoint
        const appsScriptUrl = scriptEndpoints[selectedGroup];

        // 3. Validação do Grupo de Loja
        if (!appsScriptUrl) {
            alert('Atenção: Por favor, selecione o Grupo de Lojas (Destino).');
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
            const response = await fetch(appsScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                // Se der certo, esconde o formulário e mostra a mensagem de sucesso
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
        // Limpa os selects após o reset do form
        grupoLojaInput.value = "";
        document.getElementById('loja').value = "";
    });
});
