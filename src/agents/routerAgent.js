import BaseAgent from './baseAgent';

class RouterAgent extends BaseAgent {
  constructor(config) {
    super({
      ...config,
      name: 'RouterAgent',
      role: 'You identify the primary intent of user messages and route to appropriate specialist agents.'
    });
    
    this.intentCategories = {
      pricing: "Questions about costs, fees, monthly rates, or affordability",
      tour_scheduling: "Requests to visit, schedule tours, or see the community",
      amenities: "Questions about facilities, features, services, or amenities",
      dietary_options: "Questions about meal options, special diets, or food services",
      services: "Questions about care services, assistance, or support offered",
      activities: "Questions about recreational activities, events, or programs",
      room_amenities: "Questions about features of living spaces or room facilities",
      religious_services: "Questions about religious or spiritual services",
      dining_areas: "Questions about dining facilities or meal locations",
      outdoor_activities: "Questions about activities outside the facility",
      outdoor_areas: "Questions about gardens, grounds, or outdoor spaces",
      fitness_exercise: "Questions about gym, fitness, or exercise options",
      pricing_included: "Questions about what's included in the monthly cost",
      policies: "Questions about rules, allowed items/activities, or community guidelines",
      care_options: "Questions about medical care, assistance levels, or health services",
      payment_options: "Questions about payment methods, financial assistance, or insurance",
      floor_plans: "Questions about floor plans, layouts, or room designs",
      images: "Requests to see pictures or images of the community",
      brochures: "Requests for brochures or detailed information by mail",
      jobs: "Questions about employment, careers, or job opportunities",
      general_information: "Basic information or questions that don't fit other categories",
      bot_question: "Questions about whether the assistant is a bot or AI"
    };
  }
  
  async processMessage(message, conversationContext) {
    const classificationPrompt = `
      ## Task
      You are a specialized intent classifier for a senior living community. 
      Identify which of the following categories best matches the user's message intent.
      
      ## Intent Categories
      ${Object.entries(this.intentCategories).map(([intent, description]) => 
        `- ${intent}: ${description}`
      ).join('\n')}
      
      ## Conversation Context
      ${conversationContext.messageHistory.map(msg => 
        `${msg.role}: ${msg.content}`
      ).join('\n')}
      
      ## Latest User Message
      "${message}"
      
      ## Special Routing Rules
      - If the message asks about floor plans, categorize as "floor_plans"
      - If the message asks for images or pictures, categorize as "images"
      - If the message asks for brochures or information by mail, categorize as "brochures"
      - If the message is about jobs or careers, categorize as "jobs"
      - If the message asks if you are a bot/AI, categorize as "bot_question"
      
      ## Output Format
      Return only the intent category name, nothing else. Choose the single best matching category.
    `;
    
    const detectedIntent = await this.callLLM(classificationPrompt);
    const cleanIntent = detectedIntent.trim().toLowerCase();
    
    let routingStep = 4;
    
    if (cleanIntent === 'tour_scheduling') {
      routingStep = 2;
    } else if (cleanIntent === 'pricing' || cleanIntent === 'pricing_included') {
      routingStep = 5;
    } else if (['amenities', 'dietary_options', 'services', 'activities', 
                'room_amenities', 'religious_services', 'dining_areas', 
                'outdoor_activities', 'outdoor_areas', 'fitness_exercise'].includes(cleanIntent)) {
      routingStep = 6;
    } else if (['payment_options', 'medicaid'].includes(cleanIntent)) {
      routingStep = 7;
    } else if (cleanIntent === 'floor_plans' || cleanIntent === 'brochures') {
      routingStep = 10;
    } else if (cleanIntent === 'images') {
      routingStep = 9;
    } else if (cleanIntent === 'jobs') {
      routingStep = 11;
    } else if (cleanIntent === 'bot_question') {
      routingStep = 4;
    }
    
    if (conversationContext.isFirstMessage) {
      return {
        intent: cleanIntent,
        routingStep: routingStep,
        needsDisclosure: true,
        responsePrefix: "Got it! I can definitely help with that. Let me check if my director of sales is available for a conversation. Please hold."
      };
    }
    
    return {
      intent: cleanIntent,
      routingStep: routingStep,
      needsDisclosure: false
    };
  }
}

export default RouterAgent;