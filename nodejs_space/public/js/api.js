
// Configuração da API
const API_BASE_URL = window.location.origin;
const API_KEY = '49e516cb-aeb1-44aa-9d76-f9341db7973a';

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint, options = {}) {
    // Se estamos enviando FormData, não definir Content-Type (o browser faz isso automaticamente)
    const isFormData = options.body instanceof FormData;
    
    const defaultHeaders = {
        'X-API-Key': API_KEY,
    };
    
    if (!isFormData) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(error.error || 'Erro na requisição');
    }

    return response.json();
}

// Funções de notificação
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    
    const bgColors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600'
    };
    
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 max-w-md ${
        bgColors[type] || bgColors.success
    }`;
    notification.innerHTML = message;
    document.body.appendChild(notification);

    const duration = type === 'warning' ? 5000 : 3000;
    
    setTimeout(() => {
        notification.remove();
    }, duration);
}
