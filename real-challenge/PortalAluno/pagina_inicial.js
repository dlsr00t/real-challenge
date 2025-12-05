document.addEventListener('DOMContentLoaded', function() {
    const sideMenu = document.getElementById('sideMenu');
    const menuHamburguer = document.getElementById('menuHamburguer');
    const closeBtn = document.querySelector('.close-btn');
    const API_BASE_URL = 'http://localhost:4000';
    const userProfileSpan = document.querySelector('.user-profile span');

    const redirectToLogin = () => {
        localStorage.removeItem('portalAlunoToken');
        localStorage.removeItem('portalAlunoUser');
        window.location.href = 'paginaLogin.html';
    };

    const loadUser = async () => {
        const token = localStorage.getItem('portalAlunoToken');
        if (!token) {
            redirectToLogin();
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Sessão expirada');
            }

            const payload = await res.json();
            localStorage.setItem('portalAlunoUser', JSON.stringify(payload.user));
            if (userProfileSpan) {
                userProfileSpan.textContent = `${payload.user.nome} - RA: ${payload.user.ra}`;
            }
        } catch (error) {
            redirectToLogin();
        }
    };

    loadUser();

    if (menuHamburguer) {
        menuHamburguer.addEventListener('click', function() {
            sideMenu.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            sideMenu.classList.remove('active');
        });
    }

    const chatIcon = document.getElementById('chatIcon');
    const chatWindow = document.getElementById('chatWindow');
    const chatCloseBtn = document.querySelector('.chat-close-btn');

    if (chatIcon) {
        chatIcon.addEventListener('click', function() {
            chatWindow.classList.add('active');
        });
    }

    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', function() {
            chatWindow.classList.remove('active');
        });
    }

    const searchInput = document.querySelector('.search-bar input');
    const clearSearchBtn = document.querySelector('.clear-search');

    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
        });
    }
});
