// Jarvis Assistant Web Version
class JarvisAssistant {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.commandHistory = [];
        this.openaiApiKey = localStorage.getItem('openai_api_key') || '';
        
        this.initializeSpeechRecognition();
        this.loadSettings();
        this.updateUI();
    }

    initializeSpeechRecognition() {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUI();
                this.updateStatus('Listening...');
                this.startWaveform();
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processCommand(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateUI();
                this.updateStatus('Error occurred');
                this.stopWaveform();
                
                if (event.error === 'not-allowed') {
                    this.showResponse('Please allow microphone access to use voice commands.');
                } else {
                    this.showResponse('Sorry, I couldn\'t understand that. Please try again.');
                }
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateUI();
                this.updateStatus('Ready');
                this.stopWaveform();
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
            this.updateStatus('Voice recognition not supported');
        }
    }

    toggleListening() {
        if (!this.recognition) {
            this.showResponse('Voice recognition is not supported in your browser.');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    startWaveform() {
        const waveform = document.getElementById('waveform');
        waveform.classList.add('active');
    }

    stopWaveform() {
        const waveform = document.getElementById('waveform');
        waveform.classList.remove('active');
    }

    updateUI() {
        const mainButton = document.getElementById('main-button');
        const buttonIcon = document.getElementById('button-icon');
        
        if (this.isListening) {
            mainButton.classList.add('listening');
            buttonIcon.textContent = 'mic';
        } else {
            mainButton.classList.remove('listening');
            buttonIcon.textContent = 'mic_none';
        }
    }

    updateStatus(status) {
        const statusText = document.getElementById('status-text');
        statusText.textContent = status;
    }

    processCommand(command) {
        this.updateStatus('Processing...');
        this.showTranscript(command);
        this.addToHistory(command);
        
        // Process the command
        const response = this.getResponse(command);
        this.showResponse(response);
        
        // Speak the response if TTS is enabled
        if (this.synthesis && document.getElementById('tts-enabled').checked) {
            this.speak(response);
        }
        
        this.updateStatus('Ready');
    }

    getResponse(command) {
        const lowerCommand = command.toLowerCase().trim();
        
        // Time and date commands
        if (lowerCommand.includes('time') || lowerCommand.includes('what time')) {
            const now = new Date();
            return `The current time is ${now.toLocaleTimeString()}`;
        }
        
        if (lowerCommand.includes('date') || lowerCommand.includes('what date') || lowerCommand.includes('what day')) {
            const now = new Date();
            return `Today is ${now.toLocaleDateString()}, ${now.toLocaleDateString('en-US', { weekday: 'long' })}`;
        }
        
        // Calculator commands
        if (lowerCommand.includes('calculate') || lowerCommand.includes('math') || lowerCommand.includes('what is')) {
            return this.processMathCommand(lowerCommand);
        }
        
        // Greeting commands
        if (lowerCommand.includes('hello') || lowerCommand.includes('hi') || lowerCommand.includes('hey')) {
            const greetings = [
                'Hello! How can I assist you today?',
                'Hi there! What can I help you with?',
                'Hey! I\'m here to help. What do you need?',
                'Greetings! How may I be of service?'
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // Help commands
        if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
            return 'I can help you with time, date, basic math, greetings, and more. Try asking me "what time is it" or "calculate 15 plus 27".';
        }
        
        // Goodbye commands
        if (lowerCommand.includes('goodbye') || lowerCommand.includes('bye') || lowerCommand.includes('see you')) {
            const goodbyes = [
                'Goodbye! Have a great day!',
                'See you later!',
                'Take care!',
                'Until next time!'
            ];
            return goodbyes[Math.floor(Math.random() * goodbyes.length)];
        }
        
        // Joke commands
        if (lowerCommand.includes('joke') || lowerCommand.includes('tell me a joke')) {
            const jokes = [
                'Why don\'t scientists trust atoms? Because they make up everything!',
                'What do you call a fake noodle? An impasta!',
                'Why did the scarecrow win an award? He was outstanding in his field!',
                'Why don\'t eggs tell jokes? They\'d crack each other up!'
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }
        
        // Weather commands (mock responses)
        if (lowerCommand.includes('weather') || lowerCommand.includes('temperature')) {
            return 'I\'m sorry, I need an internet connection to provide weather information.';
        }
        
        // Default response
        return 'I didn\'t understand that command. Try asking for the time, a calculation, or a joke!';
    }

    processMathCommand(command) {
        // Extract numbers and operation from command
        const numbers = command.match(/\d+/g);
        const operation = command.match(/(plus|add|\+|minus|subtract|-|times|multiply|\*|divided by|divide|\/)/i);
        
        if (!numbers || numbers.length < 2 || !operation) {
            return 'I didn\'t understand the math operation. Try saying something like "calculate 15 plus 27" or "what is 10 times 5".';
        }
        
        const num1 = parseInt(numbers[0]);
        const num2 = parseInt(numbers[1]);
        let result, operationText;
        
        switch (operation[0].toLowerCase()) {
            case 'plus':
            case 'add':
            case '+':
                result = num1 + num2;
                operationText = 'plus';
                break;
            case 'minus':
            case 'subtract':
            case '-':
                result = num1 - num2;
                operationText = 'minus';
                break;
            case 'times':
            case 'multiply':
            case '*':
                result = num1 * num2;
                operationText = 'times';
                break;
            case 'divided by':
            case 'divide':
            case '/':
                if (num2 === 0) {
                    return 'I can\'t divide by zero.';
                }
                result = num1 / num2;
                operationText = 'divided by';
                break;
            default:
                return 'I didn\'t understand the math operation.';
        }
        
        return `${num1} ${operationText} ${num2} equals ${result}`;
    }

    showTranscript(transcript) {
        const container = document.getElementById('transcript-container');
        const text = document.getElementById('transcript-text');
        
        text.textContent = transcript;
        container.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            container.style.display = 'none';
        }, 5000);
    }

    showResponse(response) {
        const container = document.getElementById('response-container');
        const text = document.getElementById('response-text');
        
        text.textContent = response;
        container.style.display = 'block';
        
        // Hide after 8 seconds
        setTimeout(() => {
            container.style.display = 'none';
        }, 8000);
    }

    addToHistory(command) {
        const timestamp = new Date().toLocaleTimeString();
        this.commandHistory.unshift({ command, timestamp });
        
        // Keep only last 10 commands
        if (this.commandHistory.length > 10) {
            this.commandHistory = this.commandHistory.slice(0, 10);
        }
        
        this.updateHistoryUI();
    }

    updateHistoryUI() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        this.commandHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-command">${item.command}</div>
                <div class="history-timestamp">${item.timestamp}</div>
            `;
            historyList.appendChild(historyItem);
        });
    }

    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1.0;
            this.synthesis.speak(utterance);
        }
    }

    sendTextCommand() {
        const input = document.getElementById('command-input');
        const command = input.value.trim();
        
        if (command) {
            this.processCommand(command);
            input.value = '';
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendTextCommand();
        }
    }

    openSettings() {
        document.getElementById('settings-modal').style.display = 'flex';
        document.getElementById('api-key-input').value = this.openaiApiKey;
    }

    closeSettings() {
        document.getElementById('settings-modal').style.display = 'none';
    }

    openCommands() {
        document.getElementById('commands-modal').style.display = 'flex';
    }

    closeCommands() {
        document.getElementById('commands-modal').style.display = 'none';
    }

    saveApiKey() {
        const apiKeyInput = document.getElementById('api-key-input');
        this.openaiApiKey = apiKeyInput.value.trim();
        localStorage.setItem('openai_api_key', this.openaiApiKey);
        
        if (this.openaiApiKey) {
            alert('API key saved successfully!');
        } else {
            alert('API key cleared.');
        }
    }

    loadSettings() {
        const voiceEnabled = localStorage.getItem('voice_enabled') !== 'false';
        const ttsEnabled = localStorage.getItem('tts_enabled') !== 'false';
        
        document.getElementById('voice-enabled').checked = voiceEnabled;
        document.getElementById('tts-enabled').checked = ttsEnabled;
    }
}

// Initialize Jarvis when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.jarvis = new JarvisAssistant();
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        const settingsModal = document.getElementById('settings-modal');
        const commandsModal = document.getElementById('commands-modal');
        
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
        if (event.target === commandsModal) {
            commandsModal.style.display = 'none';
        }
    });
});

// Global functions for HTML onclick events
function toggleListening() {
    if (window.jarvis) {
        window.jarvis.toggleListening();
    }
}

function openSettings() {
    if (window.jarvis) {
        window.jarvis.openSettings();
    }
}

function closeSettings() {
    if (window.jarvis) {
        window.jarvis.closeSettings();
    }
}

function openCommands() {
    if (window.jarvis) {
        window.jarvis.openCommands();
    }
}

function closeCommands() {
    if (window.jarvis) {
        window.jarvis.closeCommands();
    }
}

function sendTextCommand() {
    if (window.jarvis) {
        window.jarvis.sendTextCommand();
    }
}

function handleKeyPress(event) {
    if (window.jarvis) {
        window.jarvis.handleKeyPress(event);
    }
}

function saveApiKey() {
    if (window.jarvis) {
        window.jarvis.saveApiKey();
    }
}