// Manejo de Ventanas Modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }
}

// Cerrar modal al hacer clic en el fondo oscuro fuera del contenido
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Cerrar modal con la tecla ESC
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Lógica de Análisis IPv4 Interactivo
function analyzeIP() {
    const ipInput = document.getElementById('ipInput').value.trim();
    const resultBox = document.getElementById('ipResult');

    // Validación básica de formato de IP (Regex)
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ipInput.match(ipPattern);

    if (!match) {
        resultBox.className = 'result-box';
        resultBox.style.borderLeftColor = '#EF4444'; // Color de error (Rojo)
        resultBox.innerHTML = `<p style="color: #EF4444; font-weight: 600;"><i class="fa-solid fa-circle-exclamation"></i> Por favor, ingresa una dirección IPv4 válida (ej. 192.168.1.1).</p>`;
        resultBox.classList.remove('hidden');
        return;
    }

    const firstOctet = parseInt(match[1]);
    const octet2 = parseInt(match[2]);
    const octet3 = parseInt(match[3]);
    const octet4 = parseInt(match[4]);

    // Validar rango de octetos (0-255)
    if (firstOctet > 255 || octet2 > 255 || octet3 > 255 || octet4 > 255) {
        resultBox.className = 'result-box';
        resultBox.style.borderLeftColor = '#EF4444';
        resultBox.innerHTML = `<p style="color: #EF4444; font-weight: 600;"><i class="fa-solid fa-circle-exclamation"></i> Los octetos deben estar entre 0 y 255.</p>`;
        resultBox.classList.remove('hidden');
        return;
    }

    // Determinar Clase, Máscara por defecto y Ámbito
    let ipClass = '';
    let defaultMask = '';
    let scope = 'Pública';

    if (firstOctet >= 1 && firstOctet <= 126) {
        ipClass = 'Clase A';
        defaultMask = '255.0.0.0 (/8)';
        if (firstOctet === 10) scope = 'Privada (RFC 1918)';
    } else if (firstOctet === 127) {
        ipClass = 'Loopback (Pruebas de Diagnóstico)';
        defaultMask = '255.0.0.0 (/8)';
        scope = 'Reservada';
    } else if (firstOctet >= 128 && firstOctet <= 191) {
        ipClass = 'Clase B';
        defaultMask = '255.255.0.0 (/16)';
        if (firstOctet === 172 && octet2 >= 16 && octet2 <= 31) scope = 'Privada (RFC 1918)';
    } else if (firstOctet >= 192 && firstOctet <= 223) {
        ipClass = 'Clase C';
        defaultMask = '255.255.255.0 (/24)';
        if (firstOctet === 192 && octet2 === 168) scope = 'Privada (RFC 1918)';
    } else if (firstOctet >= 224 && firstOctet <= 239) {
        ipClass = 'Clase D (Multicast)';
        defaultMask = 'No aplica';
        scope = 'Reservada para Multicast';
    } else if (firstOctet >= 240 && firstOctet <= 254) {
        ipClass = 'Clase E (Experimental)';
        defaultMask = 'No aplica';
        scope = 'Reservada Investigación';
    } else {
        ipClass = 'Especial / Reservada';
        defaultMask = 'N/A';
        scope = 'Especial';
    }

    // Renderizar Resultados
    resultBox.className = 'result-box';
    resultBox.style.borderLeftColor = 'var(--accent-emerald)';
    resultBox.innerHTML = `
        <h4 style="color: var(--text-title); margin-bottom: 10px;">Resultado del Análisis para: <span style="color: var(--accent-emerald); font-family: var(--font-mono);">${ipInput}</span></h4>
        <div class="result-grid">
            <div class="result-item">
                <label>Clase de Red</label>
                <span>${ipClass}</span>
            </div>
            <div class="result-item">
                <label>Máscara por Defecto</label>
                <span>${defaultMask}</span>
            </div>
            <div class="result-item">
                <label>Ámbito de Dirección</label>
                <span>${scope}</span>
            </div>
        </div>
    `;
    resultBox.classList.remove('hidden');
}

// Analizar la IP por defecto al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    analyzeIP();
});