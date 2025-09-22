document.addEventListener('DOMContentLoaded', function() {
    const sideMenu = document.getElementById('sideMenu');
    const menuHamburguer = document.getElementById('menuHamburguer');
    const closeBtn = document.querySelector('.close-btn');

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