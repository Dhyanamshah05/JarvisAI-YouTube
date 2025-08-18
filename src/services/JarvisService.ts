import axios from 'axios';

export class JarvisService {
  private openaiApiKey: string | null = null;
  private isOnline: boolean = true;

  constructor() {
    this.loadApiKey();
  }

  private async loadApiKey() {
    // In a real app, you'd load this from secure storage
    // For now, we'll use a placeholder
    this.openaiApiKey = process.env.OPENAI_API_KEY || null;
  }

  async processCommand(command: string): Promise<string> {
    const lowerCommand = command.toLowerCase().trim();
    
    // Check for offline commands first
    const offlineResponse = this.processOfflineCommand(lowerCommand);
    if (offlineResponse) {
      return offlineResponse;
    }

    // If online and has API key, try AI processing
    if (this.isOnline && this.openaiApiKey) {
      try {
        return await this.processWithAI(command);
      } catch (error) {
        console.error('AI processing failed, falling back to offline:', error);
        return this.processOfflineCommand(lowerCommand) || 'I\'m having trouble processing that right now.';
      }
    }

    // Fallback to offline processing
    return this.processOfflineCommand(lowerCommand) || 'I didn\'t understand that command.';
  }

  private processOfflineCommand(command: string): string | null {
    // Time and date commands
    if (command.includes('time') || command.includes('what time')) {
      const now = new Date();
      return `The current time is ${now.toLocaleTimeString()}`;
    }

    if (command.includes('date') || command.includes('what date') || command.includes('what day')) {
      const now = new Date();
      return `Today is ${now.toLocaleDateString()}, ${now.toLocaleDateString('en-US', { weekday: 'long' })}`;
    }

    // Weather-related commands (mock responses)
    if (command.includes('weather') || command.includes('temperature')) {
      return 'I\'m sorry, I need an internet connection to provide weather information.';
    }

    // Calculator commands
    if (command.includes('calculate') || command.includes('math') || command.includes('what is')) {
      return this.processMathCommand(command);
    }

    // Greeting commands
    if (command.includes('hello') || command.includes('hi') || command.includes('hey')) {
      const greetings = [
        'Hello! How can I assist you today?',
        'Hi there! What can I help you with?',
        'Hey! I\'m here to help. What do you need?',
        'Greetings! How may I be of service?'
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Help commands
    if (command.includes('help') || command.includes('what can you do')) {
      return 'I can help you with time, date, basic math, greetings, and more. Try asking me "what time is it" or "calculate 15 plus 27".';
    }

    // Goodbye commands
    if (command.includes('goodbye') || command.includes('bye') || command.includes('see you')) {
      const goodbyes = [
        'Goodbye! Have a great day!',
        'See you later!',
        'Take care!',
        'Until next time!'
      ];
      return goodbyes[Math.floor(Math.random() * goodbyes.length)];
    }

    // Joke commands
    if (command.includes('joke') || command.includes('tell me a joke')) {
      const jokes = [
        'Why don\'t scientists trust atoms? Because they make up everything!',
        'What do you call a fake noodle? An impasta!',
        'Why did the scarecrow win an award? He was outstanding in his field!',
        'Why don\'t eggs tell jokes? They\'d crack each other up!'
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // System commands
    if (command.includes('battery') || command.includes('power')) {
      return 'I can\'t check your device\'s battery level without additional permissions.';
    }

    if (command.includes('volume') || command.includes('sound')) {
      return 'I can\'t control your device\'s volume directly, but I can help you with other tasks.';
    }

    // Default response for unrecognized commands
    return null;
  }

  private processMathCommand(command: string): string {
    // Extract numbers and operation from command
    const numbers = command.match(/\d+/g);
    const operation = command.match(/(plus|add|\+|minus|subtract|-|times|multiply|\*|divided by|divide|\/)/i);

    if (!numbers || numbers.length < 2 || !operation) {
      return 'I didn\'t understand the math operation. Try saying something like "calculate 15 plus 27" or "what is 10 times 5".';
    }

    const num1 = parseInt(numbers[0]);
    const num2 = parseInt(numbers[1]);
    let result: number;
    let operationText: string;

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

  private async processWithAI(command: string): Promise<string> {
    if (!this.openaiApiKey) {
      throw new Error('No API key available');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are Jarvis, a helpful AI assistant. Provide concise, helpful responses. Keep responses under 100 words unless more detail is specifically requested.'
            },
            {
              role: 'user',
              content: command
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0]?.message?.content || 'I\'m sorry, I couldn\'t process that request.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  setOnlineStatus(status: boolean) {
    this.isOnline = status;
  }

  setApiKey(key: string) {
    this.openaiApiKey = key;
  }
}