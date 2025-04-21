import BaseAgent from './baseAgent';

class ValidatorAgent extends BaseAgent {
  constructor(config) {
    super({
      ...config,
      name: 'ValidatorAgent',
      role: 'You validate responses for accuracy and adherence to guidelines.'
    });
  }

  async validateResponse(response, conversationContext, sourceAgentName) {
    const validationPrompt = `
      ## Task
      You are a response validator for a senior living community chat system.
      Review the proposed response and check for:
      1. Factual accuracy based on the knowledge base
      2. Adherence to style guidelines
      3. Appropriate tone and empathy
      4. No hallucinations or made-up information
      
      ## Knowledge Base
      ${JSON.stringify(this.knowledgeBase)}
      
      ## Proposed Response
      "${response}"
      
      ## Source Agent
      ${sourceAgentName}
      
      ## Conversation Context
      ${JSON.stringify(conversationContext)}
      
      ## Output Format
      If the response is valid, return the original response.
      If the response needs correction, fix ONLY the factual issues while preserving the style and tone.
      Do not add disclaimers or explanations about the validation process.
    `;
    
    const validatedResponse = await this.callLLM(validationPrompt);
    return validatedResponse;
  }
}

export default ValidatorAgent;