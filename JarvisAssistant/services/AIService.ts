interface OpenAIResponse {
  choices: Array<{
    text: string;
    finish_reason: string;
  }>;
}

export interface AIResponse {
  text: string;
  confidence: number;
  action?: string;
}

export class AIService {
  private apiKey: string = '';
  private chatHistory: string = '';
  private baseUrl = 'https://api.openai.com/v1/completions';

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async processCommand(query: string): Promise<AIResponse> {
    // First, try to handle built-in commands
    const builtInResponse = this.handleBuiltInCommands(query);
    if (builtInResponse) {
      return builtInResponse;
    }

    // If no built-in command matches, use AI
    if (this.apiKey) {
      return await this.getAIResponse(query);
    } else {
      return this.getFallbackResponse(query);
    }
  }

  private handleBuiltInCommands(query: string): AIResponse | null {
    const lowerQuery = query.toLowerCase();

    // Time commands
    if (lowerQuery.includes('time') || lowerQuery.includes('clock')) {
      const now = new Date();
      return {
        text: `The current time is ${now.toLocaleTimeString()}`,
        confidence: 1.0,
        action: 'time'
      };
    }

    // Date commands
    if (lowerQuery.includes('date') || lowerQuery.includes('today')) {
      const now = new Date();
      return {
        text: `Today is ${now.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`,
        confidence: 1.0,
        action: 'date'
      };
    }

    // Greeting commands
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      const greetings = [
        "Hello! How can I assist you today?",
        "Hi there! I'm Jarvis, your personal assistant.",
        "Hey! What can I help you with?",
        "Greetings! I'm here to help."
      ];
      return {
        text: greetings[Math.floor(Math.random() * greetings.length)],
        confidence: 1.0,
        action: 'greeting'
      };
    }

    // Thanks commands
    if (lowerQuery.includes('thank') || lowerQuery.includes('thanks')) {
      const responses = [
        "You're welcome!",
        "Happy to help!",
        "My pleasure!",
        "Anytime!"
      ];
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        confidence: 1.0,
        action: 'thanks'
      };
    }

    // Goodbye commands
    if (lowerQuery.includes('goodbye') || lowerQuery.includes('bye') || lowerQuery.includes('see you')) {
      const farewells = [
        "Goodbye! Have a great day!",
        "See you later!",
        "Take care!",
        "Until next time!"
      ];
      return {
        text: farewells[Math.floor(Math.random() * farewells.length)],
        confidence: 1.0,
        action: 'goodbye'
      };
    }

    // Weather commands (placeholder)
    if (lowerQuery.includes('weather') || lowerQuery.includes('temperature')) {
      return {
        text: "I'd love to check the weather for you, but I need internet access and a weather API key for that feature.",
        confidence: 0.8,
        action: 'weather'
      };
    }

    // Music commands (placeholder)
    if (lowerQuery.includes('music') || lowerQuery.includes('song') || lowerQuery.includes('play')) {
      return {
        text: "I can help with music playback, but I need access to your music library or streaming service for that.",
        confidence: 0.8,
        action: 'music'
      };
    }

    return null;
  }

  private async getAIResponse(query: string): Promise<AIResponse> {
    try {
      this.chatHistory += `Human: ${query}\nJarvis: `;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-instruct', // Updated model
          prompt: this.chatHistory,
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const aiText = data.choices[0]?.text?.trim() || "I'm not sure how to respond to that.";
      
      this.chatHistory += `${aiText}\n`;

      return {
        text: aiText,
        confidence: 0.9,
        action: 'ai_response'
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return this.getFallbackResponse(query);
    }
  }

  private getFallbackResponse(query: string): AIResponse {
    const fallbackResponses = [
      "I understand you said: " + query + ". I'm still learning how to respond to that.",
      "That's interesting! I'm working on understanding more complex requests.",
      "I heard you, but I need more training to give you a better response.",
      "I'm processing what you said. My responses will improve as I learn more."
    ];

    return {
      text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      confidence: 0.5,
      action: 'fallback'
    };
  }

  resetChatHistory(): void {
    this.chatHistory = '';
  }

  getChatHistory(): string {
    return this.chatHistory;
  }
}

export default new AIService();