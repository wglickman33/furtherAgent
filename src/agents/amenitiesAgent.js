import BaseAgent from './baseAgent';

class AmenitiesAgent extends BaseAgent {
  constructor(config) {
    super({
      ...config,
      name: 'AmenitiesAgent',
      role: 'You provide information about amenities and services at our senior living community.'
    });
  }
  
  async generatePrompt(message, conversationContext) {
    const basePrompt = await super.generatePrompt(message, conversationContext);
    
    const messageLC = message.toLowerCase();
    
    const categoryMapping = {
      'amenities': 'amenities',
      'services': 'services',
      'cleaning': 'cleaning_services',
      'activities': 'activities',
      'diet': 'dietary_options',
      'food': 'dietary_options',
      'room': 'room_amenities',
      'religious': 'religious_services',
      'dining': 'dining_areas',
      'outdoor activities': 'outdoor_activities',
      'outdoor areas': 'outdoor_areas',
      'fitness': 'fitness_exercise_options',
      'exercise': 'fitness_exercise_options',
      'gym': 'fitness_exercise_options',
      'included': 'pricing.included_in_cost'
    };
    
    let targetCategory = 'general';
    for (const [keyword, category] of Object.entries(categoryMapping)) {
      if (messageLC.includes(keyword)) {
        targetCategory = category;
        break;
      }
    }
    
    let categoryInformation = '';
    if (targetCategory === 'general') {
      categoryInformation = `
      ### Amenities
      ${this.knowledgeBase.amenities.join(', ')}
      
      ### Services
      ${this.knowledgeBase.services.join(', ')}
      `;
    } else if (targetCategory === 'pricing.included_in_cost') {
      categoryInformation = `
      ### What's Included in Monthly Cost
      ${this.knowledgeBase.pricing.included_in_cost.join(', ')}
      `;
    } else if (this.knowledgeBase[targetCategory]) {
      categoryInformation = `
      ### ${targetCategory.charAt(0).toUpperCase() + targetCategory.slice(1).replace('_', ' ')}
      ${this.knowledgeBase[targetCategory].join(', ')}
      `;
    }
    
    return `${basePrompt}
    
    ## Community Information for ${targetCategory.replace('_', ' ')}
    ${categoryInformation}
    
    ## Special Instructions
    - The user appears to be asking about: ${targetCategory.replace('_', ' ')}
    - If the requested item is in our knowledge base, provide specifics
    - If not, mention related items but clarify you don't have specific information
    - Suggest a tour if you haven't already
    - If they ask about something not in our knowledge base, offer to connect them with a team member
    
    Now respond to the user's query about amenities in a conversational, friendly manner:
    `;
  }
  
  async processMessage(message, conversationContext) {
    const prompt = await this.generatePrompt(message, conversationContext);
    const response = await this.callLLM(prompt);
    
    return {
      response: response,
      suggestTour: !conversationContext.tourSuggested,
    };
  }
}

export default AmenitiesAgent;