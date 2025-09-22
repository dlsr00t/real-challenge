document.addEventListener('DOMContentLoaded', function() {

    const loginButton = document.getElementById('loginButton');
    const raInput = document.getElementById('raInput');
    const senhaInput = document.getElementById('senhaInput');
    const errorMessage = document.getElementById('errorMessage');
    const passwordToggle = document.getElementById('passwordToggle'); 


    if (loginButton) {
        loginButton.addEventListener('click', function(event) {
           
            event.preventDefault();

            
            const raCorreto = 'E47259';
            const senhaCorreta = 'E47259';

            
            const raDigitado = raInput.value.trim();
            const senhaDigitada = senhaInput.value.trim();

           
            if (raDigitado === raCorreto && senhaDigitada === senhaCorreta) {
              
                errorMessage.style.display = 'none';
                window.location.href = 'pagina_inicial.html';
            } else {
               
                errorMessage.style.display = 'block';
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