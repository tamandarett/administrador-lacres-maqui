document.addEventListener('DOMContentLoaded', () => {
    // URL da sua implantação do Google Apps Script
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbzNEaGuuffVK7oD5kcyJDEcFxWCM2k_6JrbRWkfFQ0_VwKThTqosy45F84-TbVrmyhRlg/exec';

    const lacreInput = document.getElementById('lacre');
    const confirmarLacreInput = document.getElementById('confirmar-lacre');
    const form = document.getElementById('lacreForm');
    const successMessageDiv = document.getElementById('successMessage');
    const novoRegistroBtn = document.getElementById('novoRegistroBtn');

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

        const lacre = lacreInput.value;
        const confirmarLacre = confirmarLacreInput.value;
        const loja = document.getElementById('loja').value;
        const operador = document.getElementById('operador').value;

        // Resetar a cor dos campos
        lacreInput.style.borderColor = '';
        confirmarLacreInput.style.borderColor = '';

        // Validação dos campos de lacre
        if (lacre !== confirmarLacre) {
            alert('Atenção: Os números de lacre não são iguais. Por favor, verifique.');
            lacreInput.style.borderColor = 'red';
            confirmarLacreInput.style.borderColor = 'red';
            return;
        }

        const dataHora = new Date().toISOString();

        const dados = {
            lacre: lacre,
            loja: loja,
            operador: operador,
            dataHora: dataHora
        };

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
                alert('Erro ao enviar os dados. Tente novamente.');
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
    });
});
