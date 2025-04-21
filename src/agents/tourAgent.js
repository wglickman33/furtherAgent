import BaseAgent from './baseAgent';

class TourAgent extends BaseAgent {
  constructor(config) {
    super({
      ...config,
      name: 'TourAgent',
      role: 'You help schedule tours of the senior living community.'
    });
  }
  
  async generatePrompt(message, conversationContext) {
    const basePrompt = await super.generatePrompt(message, conversationContext);
    
    const currentDate = new Date();
    
    return `${basePrompt}
    
    ## Tour Scheduling Information
    - Community is open for tours: Monday to Friday, 9:00 AM to 6:00 PM
    - Current date and time: ${currentDate.toLocaleString()}
    - We are closed on weekends and holidays
    
    ## Special Instructions
    - First ask about the prospective resident's availability before offering specific times
    - Resolve relative dates like "next Monday" based on the current date
    - If their preferred time is outside operating hours, suggest alternative times
    - After scheduling a tour, collect their contact information
    - If no suitable time can be found, offer to have someone call them
    
    Now respond to the user's tour scheduling request in a conversational, friendly manner:
    `;
  }
  
  isWeekday(date) {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }
  
  isWithinOperatingHours(date) {
    const hours = date.getHours();
    return hours >= 9 && hours < 18;
  }
  
  async processMessage(message, conversationContext) {
    const prompt = await this.generatePrompt(message, conversationContext);
    const response = await this.callLLM(prompt);
    
    let nextAction = 'continue';
    if (response.toLowerCase().includes('confirm') || response.toLowerCase().includes('schedule')) {
      nextAction = 'collect_contact_info';
    }
    
    return {
      response: response,
      nextAction: nextAction
    };
  }
}

export default TourAgent;