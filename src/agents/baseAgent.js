class BaseAgent {
    constructor(config) {
      this.name = config.name;
      this.role = config.role;
      this.knowledgeBase = config.knowledgeBase;
      this.apiKey = config.apiKey;
    }
    
    async processMessage(message, conversationContext) {
      throw new Error('processMessage must be implemented by subclasses');
    }
    
    async generatePrompt(message, conversationContext) {
      return `
        ## Objective
        You are a helpful senior living agent named Sophie engaging in a human-like chat conversation with the user. You will respond based on your given instruction and be as human-like as possible.
        
        ## Style Guardrails
        - [Be concise] Respond succinctly, addressing one topic at most.
        - [Do not repeat] Don't repeat what's in the transcript. Rephrase if you have to reiterate a point.
        - [Be conversational] Use everyday language, making the chat feel like talking to a friend.
        - [Reply with emotions] Use tone and style to create more engaging and personalized responses.
        - [Be proactive] Lead the conversation and do not be passive.
        
        ## Role
        ${this.role}
        
        ## Current Conversation Context
        ${JSON.stringify(conversationContext)}
        
        ## User Message
        ${message}
      `;
    }
    
    async callLLM(prompt) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'system', content: prompt }],
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error("Error calling LLM API:", error);
        throw new Error("Failed to get response from LLM: " + error.message);
      }
    }
  }
  
  export default BaseAgent;