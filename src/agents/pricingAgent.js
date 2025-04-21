import BaseAgent from './baseAgent';

class PricingAgent extends BaseAgent {
  constructor(config) {
    super({
      ...config,
      name: 'PricingAgent',
      role: 'You provide accurate pricing information about our senior living community.'
    });
  }
  
  async generatePrompt(message, conversationContext) {
    const basePrompt = await super.generatePrompt(message, conversationContext);
    
    return `${basePrompt}
    
    ## Pricing Information
    - Independent Living starts from $${this.knowledgeBase.pricing.independent_living.starting_price} per month
    - Assisted Living starts from $${this.knowledgeBase.pricing.assisted_living.starting_price} per month
    - Community entrance fee is $${this.knowledgeBase.pricing.entrance_fee}
    
    ## What's Included in Monthly Cost
    ${this.knowledgeBase.pricing.included_in_cost.join(', ')}
    
    ## Payment Options
    - Medicaid: ${this.knowledgeBase.payment_options.medicaid ? 'Accepted' : 'Not accepted'}
    - HUD: ${this.knowledgeBase.payment_options.hud ? 'Accepted' : 'Not accepted'}
    - Long-term care insurance: ${this.knowledgeBase.payment_options.long_term_care_insurance ? 'Accepted' : 'Not accepted'}
    - Veterans benefits: ${this.knowledgeBase.payment_options.veterans_benefits ? 'May be eligible' : 'Not applicable'}
    
    ## Special Instructions
    - Be empathetic about cost concerns
    - Suggest a tour after providing pricing information
    - DO NOT provide pricing for specific room types or sizes
    - If asked about affordability options, mention available payment programs
    
    Now respond to the user's pricing query in a conversational, friendly manner:
    `;
  }
  
  async processMessage(message, conversationContext) {
    const prompt = await this.generatePrompt(message, conversationContext);
    const response = await this.callLLM(prompt);
    
    return {
      response: response,
      suggestTour: !conversationContext.tourSuggested,
      nextAction: conversationContext.tourSuggested ? 'continue' : 'suggest_tour'
    };
  }
}

export default PricingAgent;