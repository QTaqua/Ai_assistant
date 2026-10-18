const chatStream = document.getElementById('chat-stream');
const userPrompt = document.getElementById('user-prompt');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const offlineBanner = document.getElementById('offline-banner');

// Handle offline/online detection state
function updateOnlineStatus() {
    if (!navigator.onLine) {
        offlineBanner.classList.remove('d-none');
    } else {
        offlineBanner.classList.add('d-none');
    }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// Send message event
sendBtn.addEventListener('click', async () => {
    const text = userPrompt.value.trim();
    if (!text) return;

    // Append Student Bubble
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    chatStream.innerHTML += `
        <div class="text-end text-muted small mb-1">YOU (STUDENT) • ${timeStr}</div>
        <div class="p-3 text-white bg-dark rounded-3 mb-3 shadow-sm ms-auto" style="max-width: 85%;">
            ${escapeHtml(text)}
        </div>
    `;
    
    userPrompt.value = '';
    chatStream.scrollTop = chatStream.scrollHeight;

    // Call backend Django API endpoint securely
    try {
        const response = await fetch('/api/chat/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: text })
        });
        
        const data = await response.json();
        
        const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (data.response) {
            chatStream.innerHTML += `
                <div class="text-muted small mb-1">CLASS ASSISTANT • ${aiTimeStr}</div>
                <div class="p-3 border rounded-3 bg-white mb-3 shadow-sm">
                    ${formatMarkdownLike(data.response)}
                </div>
            `;
        } else {
            chatStream.innerHTML += `<div class="p-3 border rounded-3 bg-white mb-3 text-danger">Error: ${data.error || 'Failed to fetch response.'}</div>`;
        }
    } catch (err) {
        chatStream.innerHTML += `<div class="p-3 border rounded-3 bg-white mb-3 text-danger">Network Error: Unable to reach server (Are you offline?)</div>`;
    }
    chatStream.scrollTop = chatStream.scrollHeight;
});

clearBtn.addEventListener('click', () => {
    userPrompt.value = '';
});

// Helper for basic safety escape
function escapeHtml(string) {
    return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatMarkdownLike(text) {
    return escapeHtml(text).replace(/\n/g, '<br>');
}

// Register Service Worker for PWA Offline Capability
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/ai_assistant/sw.js')
        .then(() => console.log("Service Worker Registered Successfully"));
}