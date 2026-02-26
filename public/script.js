// Lógica do FAQ
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.querySelector('.faq-answer');
        const isOpen = answer.style.display === 'block';
        answer.style.display = isOpen ? 'none' : 'block';
    });
});

// Lógica da API e WhatsApp
async function solicitarTeste(plano) {
    const whats = prompt("Digite seu WhatsApp com DDD:");
    if (!whats) return;

    try {
        const response = await fetch('/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                firstName: "Cliente", 
                lastName: plano, 
                whatsapp: whats 
            })
        });
        const data = await response.json();
        if (data.whatsappLink) window.location.href = data.whatsappLink;
    } catch (e) {
        alert("Erro ao conectar.");
    }
}