document.addEventListener('DOMContentLoaded', () => {
    const form_bem_vindo = document.querySelector('#form-bemvindo');
    const bem_vindo = document.querySelector('#bem-vindo');
    const raspadinha = document.querySelector('#raspadinha');
    const solicitar_premio = document.getElementById('solicitar-premio');
    const campos_raspar = Array.from(document.querySelectorAll('.campos-para-raspar'));
    const botao_raspar = document.querySelector('#botao-raspar');
    const resultado = document.querySelector('#resultado');
    const premio = document.getElementById('premio');
    const mensagem_agradecimento = document.getElementById('mensagem-agradecimento');
        
    let icones = campos_raspar.map(campo => campo.getAttribute('data-icon'));
    
    raspadinha.classList.add('escondido');
    solicitar_premio.classList.add('escondido');
    botao_raspar.classList.add('escondido');

    form_bem_vindo.addEventListener('submit', (event) => {
        event.preventDefault();
        bem_vindo.classList.add('escondido');
        raspadinha.classList.remove('escondido');
        botao_raspar.classList.remove('escondido');
        iniciarRaspadinha();
    });

    function gerarArrayComMaisRepetidos(array, numTotalCampos) {
        let resultado = [];
        const numRepeticoes = Math.ceil(numTotalCampos / (array.length / 2));
        for (let i = 0; i < numRepeticoes; i++) {
            resultado = resultado.concat(array);
        }
        return resultado.slice(0, numTotalCampos);
    }

    function embaralharArray(array) {
        let resultado = [...array];
        for (let i = 0; i < resultado.length; i += 3) {
            if (Math.random() > 0.9) {
                resultado[i] = resultado[i + 1] = resultado[i + 2] = resultado[i] || array[0];
            }
        }
        return resultado.sort(() => Math.random() - 0.3);
    }

    botao_raspar.addEventListener('click', () => {
        bem_vindo.classList.add('escondido');
        let iconesComRepeticoes = gerarArrayComMaisRepetidos(icones, campos_raspar.length);
        let iconesEmbaralhados = embaralharArray(iconesComRepeticoes);
        campos_raspar.forEach((campo, index) => {
            const img = campo.querySelector('img');
            img.src = `./imagens/${iconesEmbaralhados[index]}.png`;
        });
        botao_raspar.disabled = true;
    });

    function iniciarRaspadinha() {
        let raspagemConcluida = false;
        let areaRaspada = new Set();
        let jogo_ativo = true;
        let isRaspando = false; // Estado de raspagem global

        campos_raspar.forEach(campo => {
            const canvas = campo.querySelector('.cobertura');
            const ctx = canvas.getContext('2d');
            canvas.width = campo.offsetWidth;
            canvas.height = campo.offsetHeight;

            ctx.fillStyle = '#383732';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const mouseMoveHandler = (e) => {
                if (isRaspando && jogo_ativo) {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.beginPath();
                    ctx.arc(x, y, 8, 0, Math.PI * 2);
                    ctx.fill();
                    areaRaspada.add(campo);
                }

                if (areaRaspada.size === campos_raspar.length && !raspagemConcluida) {
                    raspagemConcluida = true;
                    verificarPremio();
                }
            };

            canvas.addEventListener('mousedown', () => isRaspando = true);
            canvas.addEventListener('mouseup', () => isRaspando = false);
            canvas.addEventListener('mousemove', mouseMoveHandler);

            function removerEventosGlobais() {
                canvas.removeEventListener('mousemove', mouseMoveHandler);
                canvas.removeEventListener('mousedown', () => isRaspando = true);
                canvas.removeEventListener('mouseup', () => isRaspando = false);
            }

            function verificarPremio() {
                let iconesVisiveis = campos_raspar.map(campo => campo.querySelector('img').src.split('/').pop().split('.')[0]);
                let contagemIcones = {};

                iconesVisiveis.forEach(icone => {
                    contagemIcones[icone] = (contagemIcones[icone] || 0) + 1;
                });

                for (let icone in contagemIcones) {
                    if (contagemIcones[icone] >= 3) {
                        jogo_ativo = false; // Impede mais raspagens
                        alert("Parabéns! Você encontrou 3 ícones iguais!");
                       
                        removerEventosGlobais(); // Remove todos os eventos de raspagem
                        mostrar_solicitar_premio();
                        return;
                    }
                }
                resultado.textContent = "Não foi desta vez!";
            }
            

            function removerEventosGlobais() {
                campos_raspar.forEach(campo => {
                    const canvas = campo.querySelector('.cobertura');
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas ao final do jogo
                    canvas.removeEventListener('mousemove', mouseMoveHandler);
                    canvas.removeEventListener('mousedown', () => isRaspando = true);
                    canvas.removeEventListener('mouseup', () => isRaspando = false);
                });
                isRaspando = false; // Impede mais interações
            }
        });
    }

    function mostrar_solicitar_premio() {
        bem_vindo.classList.add('escondido');
        resultado.innerHTML = `
            <div class="ganhou-premio">
                <h2>🎉 Parabéns! Você ganhou! 🎉</h2>
                <img src="./imagens/presente.png" alt="Presente" width="60" height="60">
                <p></p>
            </div>
        `;
        //raspadinha.classList.add('escondido');
        solicitar_premio.classList.remove('escondido');

        premio.innerHTML = `
            <option value="premio">Selecione aqui:</option>
            <option value="premio1">Batedeira Elétrica Mondial</option>
            <option value="premio2">Furadeira Bosch Hobby</option>
            <option value="premio3">KIT Mope Limpeza Pesada</option>
            <option value="premio4">KIT Educativo</option>
            <option value="premio5">GIFT Card NETFLIX</option>
        `;

    }
    const form_solicitacao = document.querySelector('#solicitacao');
    form_solicitacao.addEventListener('submit', (event) => {
        event.preventDefault();
        mostrarMensagemAgradecimento();

        function mostrarMensagemAgradecimento() {
            solicitar_premio.classList.add('escondido');
            mensagem_agradecimento.classList.remove('escondido');
            mensagem_agradecimento.innerHTML = `
                <h2>Obrigado pela sua participação!</h2>
                <p>Seu prêmio será enviado em breve.</p>
                <img src="./imagens/agradecimento.png" alt="Agradecimento" width="60" height="60">
            `;
        }
});
});
/*----------------------ADIÇÃO PARA USO DE API FICTICIA-----------------------/*/
        /*premio.addEventListener('change', () => {
            //enviarDadosParaAPI();
            //mostrarMensagemAgradecimento();
          });
    }
});
/// ENVIANDO OS DADOS DO GANHADOS PARA UMA API FICTICIA:

/*function enviarDadosParaAPI() {
    const dados = {
        evento: 'raspadinha',
        resultado: 'ganhou',
        premioEscolhido: premio.value,
    };

    fetch('https://api.ficticia.com/enviar-dados', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados enviados com sucesso:', data);
    })
    .catch((error) => {
        console.error('Erro ao enviar dados:', error);
    });
    
};
function mostrarMensagemAgradecimento() {
    // Ocultar todos os outros elementos
    bem_vindo.classList.add('escondido');
    raspadinha.classList.add('escondido');
    solicitar_premio.classList.add('escondido');
  
    // Mostrar a mensagem de agradecimento
    document.getElementById('mensagem-agradecimento').classList.remove('escondido');
  }*/










