// JARVIS AI Assistant - Main JavaScript

class JarvisInterface {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentUser = null;
        this.lastResponse = '';
        
        this.initializeInterface();
        this.initializeParticles();
        this.checkAuthentication();
    }

    initializeInterface() {
        // Initialize speech recognition if available
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.setStatus('Listening...', 'listening');
                document.getElementById('coreVisual').classList.add('listening');
            };
            
            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript;
                this.processVoiceCommand(command);
            };
            
            this.recognition.onerror = (event) => {
                this.setStatus('Voice recognition error', 'error');
                this.stopListening();
            };
            
            this.recognition.onend = () => {
                this.stopListening();
            };
        }

        // Add enter key support for command input
        document.getElementById('commandInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processTextCommand();
            }
        });

        // Auto-update system info every 30 seconds
        setInterval(() => {
            if (this.currentUser) {
                this.updateSystemInfo();
            }
        }, 30000);
    }

    initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#00ffff'
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#000000'
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 40,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#00ffff',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 6,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'repulse'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 400,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: true
            });
        }
    }

    checkAuthentication() {
        // Check if user is already logged in
        fetch('/history')
            .then(response => {
                if (response.ok) {
                    this.showMainInterface();
                    this.loadHistory();
                } else {
                    this.showLoginModal();
                }
            })
            .catch(() => {
                this.showLoginModal();
            });
    }

    showLoginModal() {
        document.getElementById('loginModal').classList.remove('hidden');
        document.getElementById('mainInterface').classList.add('hidden');
    }

    showMainInterface() {
        document.getElementById('loginModal').classList.add('hidden');
        document.getElementById('mainInterface').classList.remove('hidden');
        this.setStatus('Ready', 'ready');
        this.updateSystemInfo();
    }

    setStatus(text, type) {
        const statusText = document.getElementById('statusText');
        const statusLight = document.getElementById('statusLight');
        
        statusText.textContent = text;
        
        statusLight.className = 'status-light';
        switch (type) {
            case 'listening':
                statusLight.style.background = '#ffff00';
                statusLight.style.boxShadow = '0 0 10px #ffff00';
                break;
            case 'processing':
                statusLight.style.background = '#ff6600';
                statusLight.style.boxShadow = '0 0 10px #ff6600';
                break;
            case 'error':
                statusLight.style.background = '#ff0000';
                statusLight.style.boxShadow = '0 0 10px #ff0000';
                break;
            default:
                statusLight.style.background = '#00ff00';
                statusLight.style.boxShadow = '0 0 10px #00ff00';
        }
    }

    async processCommand(command, language = 'auto') {
        this.setStatus('Processing...', 'processing');
        document.getElementById('coreVisual').classList.add('processing');

        try {
            const response = await fetch('/process_command', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: command,
                    language: language
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.displayResponse(command, data.response);
                this.lastResponse = data.response;
                document.getElementById('speakBtn').disabled = false;
                this.setStatus('Ready', 'ready');
            } else {
                this.displayError(data.error || 'Unknown error occurred');
                this.setStatus('Error', 'error');
            }
        } catch (error) {
            this.displayError('Connection error: ' + error.message);
            this.setStatus('Error', 'error');
        } finally {
            document.getElementById('coreVisual').classList.remove('processing');
        }
    }

    displayResponse(command, response) {
        const responseArea = document.getElementById('responseArea');
        
        // Clear welcome message on first response
        if (responseArea.querySelector('.welcome-message')) {
            responseArea.innerHTML = '';
        }

        const responseItem = document.createElement('div');
        responseItem.className = 'response-item';
        responseItem.innerHTML = `
            <div class="response-command">❯ ${command}</div>
            <div class="response-text">${response}</div>
        `;

        responseArea.insertBefore(responseItem, responseArea.firstChild);

        // Limit to 10 responses
        while (responseArea.children.length > 10) {
            responseArea.removeChild(responseArea.lastChild);
        }
    }

    displayError(error) {
        const responseArea = document.getElementById('responseArea');
        
        const errorItem = document.createElement('div');
        errorItem.className = 'response-item';
        errorItem.style.borderLeftColor = '#ff0000';
        errorItem.innerHTML = `
            <div class="response-command">❌ Error</div>
            <div class="response-text">${error}</div>
        `;

        responseArea.insertBefore(errorItem, responseArea.firstChild);
    }

    startVoiceRecognition() {
        if (this.recognition && !this.isListening) {
            this.isListening = true;
            document.getElementById('voiceBtn').classList.add('hidden');
            document.getElementById('stopBtn').classList.remove('hidden');
            this.recognition.start();
        } else {
            this.processVoiceCommand();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            this.recognition.stop();
        }
        
        document.getElementById('voiceBtn').classList.remove('hidden');
        document.getElementById('stopBtn').classList.add('hidden');
        document.getElementById('coreVisual').classList.remove('listening');
        this.setStatus('Ready', 'ready');
    }

    async processVoiceCommand(command) {
        if (command) {
            document.getElementById('commandInput').value = command;
            await this.processCommand(command);
        }
        this.stopListening();
    }

    processTextCommand() {
        const commandInput = document.getElementById('commandInput');
        const command = commandInput.value.trim();
        const language = document.getElementById('languageSelect').value;
        
        if (command) {
            this.processCommand(command, language);
            commandInput.value = '';
        }
    }

    speakResponse() {
        if (this.lastResponse && this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(this.lastResponse);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // Try to use a more robotic voice if available
            const voices = this.synthesis.getVoices();
            const roboticVoice = voices.find(voice => 
                voice.name.includes('Google') || 
                voice.name.includes('Microsoft') ||
                voice.name.includes('Alex') ||
                voice.name.includes('Daniel')
            );
            
            if (roboticVoice) {
                utterance.voice = roboticVoice;
            }
            
            this.synthesis.speak(utterance);
        }
    }

    quickCommand(command) {
        document.getElementById('commandInput').value = command;
        this.processCommand(command);
    }

    async updateSystemInfo() {
        try {
            const response = await this.processCommand('system information');
            // The system information will be displayed in the response area
        } catch (error) {
            console.error('Failed to update system info:', error);
        }
    }

    async loadHistory() {
        try {
            const response = await fetch('/history');
            if (response.ok) {
                const history = await response.json();
                this.displayHistory(history);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    }

    displayHistory(history) {
        const historyArea = document.getElementById('historyArea');
        historyArea.innerHTML = '';

        if (history.length === 0) {
            historyArea.innerHTML = '<p style="color: #b0b0b0; text-align: center;">No command history yet.</p>';
            return;
        }

        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = new Date(item.timestamp).toLocaleString();
            historyItem.innerHTML = `
                <div class="history-command">${item.command}</div>
                <div class="history-response">${item.response}</div>
                <div class="history-meta">
                    Language: ${item.language} | ${date}
                </div>
            `;
            
            historyArea.appendChild(historyItem);
        });
    }
}

// Authentication functions
async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            jarvis.currentUser = data.user_id;
            jarvis.showMainInterface();
            jarvis.loadHistory();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('Connection error: ' + error.message);
    }
}

async function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            jarvis.currentUser = data.user_id;
            jarvis.showMainInterface();
            jarvis.loadHistory();
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        alert('Connection error: ' + error.message);
    }
}

function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

async function logout() {
    try {
        await fetch('/logout');
        jarvis.currentUser = null;
        jarvis.showLoginModal();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Global functions for HTML onclick handlers
function startVoiceRecognition() {
    jarvis.startVoiceRecognition();
}

function stopListening() {
    jarvis.stopListening();
}

function processTextCommand() {
    jarvis.processTextCommand();
}

function speakResponse() {
    jarvis.speakResponse();
}

function quickCommand(command) {
    jarvis.quickCommand(command);
}

function updateSystemInfo() {
    jarvis.updateSystemInfo();
}

function loadHistory() {
    jarvis.loadHistory();
}

function handleCommandInput(event) {
    if (event.key === 'Enter') {
        processTextCommand();
    }
}

// Initialize JARVIS when page loads
let jarvis;

document.addEventListener('DOMContentLoaded', function() {
    jarvis = new JarvisInterface();
    
    // Add some interactive effects
    document.addEventListener('mousemove', function(e) {
        const coreVisual = document.getElementById('coreVisual');
        if (coreVisual) {
            const rect = coreVisual.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) * 0.01;
            const deltaY = (e.clientY - centerY) * 0.01;
            
            coreVisual.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
    });

    // Add click-to-wake functionality
    document.getElementById('coreVisual').addEventListener('click', function() {
        if (!jarvis.isListening) {
            startVoiceRecognition();
        }
    });

    // Preload voices for speech synthesis
    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = function() {
            // Voices are now loaded
        };
    }
});

// Add some console styling for debugging
console.log('%c🤖 JARVIS AI Assistant Initialized', 'color: #00ffff; font-size: 16px; font-weight: bold;');
console.log('%cSay "Hello JARVIS" to test voice recognition', 'color: #0080ff;');