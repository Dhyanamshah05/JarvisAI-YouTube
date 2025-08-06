document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const assistantUI = document.getElementById('assistantUI');
    const chatDisplay = document.getElementById('chatDisplay');
    const voiceBtn = document.getElementById('voiceBtn');
    const textInput = document.getElementById('textInput');
    const sendBtn = document.getElementById('sendBtn');

    // Simple login (for demo)
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // TODO: Replace with real authentication
        loginForm.style.display = 'none';
        assistantUI.style.display = 'flex';
    });

    // Send text command
    sendBtn.addEventListener('click', function() {
        sendMessage(textInput.value);
        textInput.value = '';
    });

    // Voice command
    voiceBtn.addEventListener('click', function() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition not supported.');
            return;
        }
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            sendMessage(transcript);
        };
        recognition.start();
    });

    function sendMessage(message) {
        if (!message.trim()) return;
        appendMessage('You', message);
        fetch('/api/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: message })
        })
        .then(res => res.json())
        .then(data => {
            appendMessage('JARVIS', data.response);
        })
        .catch(() => {
            appendMessage('JARVIS', 'Sorry, there was an error.');
        });
    }

    function appendMessage(sender, text) {
        const msg = document.createElement('div');
        msg.innerHTML = `<b>${sender}:</b> ${text}`;
        chatDisplay.appendChild(msg);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
});