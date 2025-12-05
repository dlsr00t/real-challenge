document.addEventListener('DOMContentLoaded', function() {

    const loginButton = document.getElementById('loginButton');
    const raInput = document.getElementById('raInput');
    const senhaInput = document.getElementById('senhaInput');
    const errorMessage = document.getElementById('errorMessage');
    const passwordToggle = document.getElementById('passwordToggle'); 
    const API_BASE_URL = 'http://localhost:4000';


    if (loginButton) {
        loginButton.addEventListener('click', async function(event) {
            event.preventDefault();
            errorMessage.style.display = 'none';

            const raDigitado = raInput.value.trim();
            const senhaDigitada = senhaInput.value.trim();

            if (!raDigitado || !senhaDigitada) {
                errorMessage.textContent = 'Informe RA e senha.';
                errorMessage.style.display = 'block';
                return;
            }

            loginButton.disabled = true;
            loginButton.textContent = 'Entrando...';

            try {
                const resposta = await fetch(`${API_BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ra: raDigitado, senha: senhaDigitada })
                });

                const payload = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(payload.message || 'Falha no login');
                }

                localStorage.setItem('portalAlunoToken', payload.token);
                localStorage.setItem('portalAlunoUser', JSON.stringify(payload.user));
                window.location.href = 'pagina_inicial.html';
            } catch (error) {
                errorMessage.textContent = error.message || 'Não foi possível realizar o login.';
                errorMessage.style.display = 'block';
            } finally {
                loginButton.disabled = false;
                loginButton.textContent = 'Login';
            }
        });
    }

  
    if (passwordToggle && senhaInput) {
        passwordToggle.addEventListener('click', function() {
            if (senhaInput.type === 'password') {
                senhaInput.type = 'text';
                passwordToggle.classList.remove('fa-eye');
                passwordToggle.classList.add('fa-eye-slash'); 
            } else {
                senhaInput.type = 'password';
                passwordToggle.classList.remove('fa-eye-slash');
                passwordToggle.classList.add('fa-eye'); 
            }
        });
    }
});
