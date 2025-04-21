class ConversationManager {
    constructor(config) {
      this.agents = config.agents;
      this.knowledgeBase = config.knowledgeBase;
      this.conversationContext = {
        isFirstMessage: true,
        tourSuggested: false,
        contactInfoCollected: false,
        currentStep: 1,
        userInfo: {
          name: null,
          email: null,
          phone: null,
          address: null
        },
        messageHistory: []
      };
    }
    
    async processUserMessage(message) {
      this.conversationContext.messageHistory.push({
        role: 'user',
        content: message
      });
      
      const routerAgent = this.agents.find(agent => agent.name === 'RouterAgent');
      const routingResult = await routerAgent.processMessage(message, this.conversationContext);
      
      this.conversationContext.currentStep = routingResult.routingStep;
      
      const targetAgentName = this.mapIntentToAgent(routingResult.intent);
      const targetAgent = this.agents.find(agent => agent.name === targetAgentName);
      
      if (!targetAgent) {
        throw new Error(`No agent found for intent: ${routingResult.intent}`);
      }
      
      this.addStepInstructions(routingResult.routingStep, routingResult.intent);
      
      const agentResponse = await targetAgent.processMessage(message, this.conversationContext);
      
      const validatorAgent = this.agents.find(agent => agent.name === 'ValidatorAgent');
      const validatedResponse = await validatorAgent.validateResponse(
        agentResponse.response, 
        this.conversationContext,
        targetAgent.name
      );
      
      this.conversationContext.isFirstMessage = false;
      if (agentResponse.suggestTour) {
        this.conversationContext.tourSuggested = true;
      }
      
      const finalResponse = this.processNextSteps(
        validatedResponse, 
        routingResult.routingStep, 
        routingResult.intent
      );
      
      this.conversationContext.messageHistory.push({
        role: 'assistant',
        content: finalResponse,
        agent: targetAgent.name,
        step: routingResult.routingStep
      });
      
      if (routingResult.needsDisclosure) {
        return `${routingResult.responsePrefix}\n\n[10 second pause]\n\nOur sales director is not currently available, but I am a virtual assistant, and I am able to answer basic questions about our community. Would you like to speak with me, or leave a message for Jami?\n\nBefore I answer, just so you know—This conversation is being recorded for quality purposes and you can leave a voicemail at anytime by pressing 0.\n\n[1 second pause]\n\nAbout your query on ${routingResult.intent.replace('_', ' ')}: ${finalResponse}`;
      }
      
      return finalResponse;
    }
    
    mapIntentToAgent(intent) {
      const intentToAgentMap = {
        'pricing': 'PricingAgent',
        'pricing_included': 'PricingAgent',
        'tour_scheduling': 'TourAgent',
        'amenities': 'AmenitiesAgent',
        'dietary_options': 'AmenitiesAgent',
        'services': 'AmenitiesAgent',
        'activities': 'AmenitiesAgent',
        'room_amenities': 'AmenitiesAgent',
        'religious_services': 'AmenitiesAgent',
        'dining_areas': 'AmenitiesAgent',
        'outdoor_activities': 'AmenitiesAgent',
        'outdoor_areas': 'AmenitiesAgent',
        'fitness_exercise': 'AmenitiesAgent',
        'rooms': 'AmenitiesAgent',
        'policies': 'PolicyAgent',
        'care_options': 'PolicyAgent',
        'payment_options': 'PricingAgent',
        'floor_plans': 'PolicyAgent',
        'images': 'PolicyAgent',
        'brochures': 'PolicyAgent',
        'jobs': 'PolicyAgent',
        'contact_information': 'PolicyAgent',
        'bot_question': 'PolicyAgent',
        'general_information': 'PolicyAgent'
      };
      
      return intentToAgentMap[intent] || 'PolicyAgent';
    }
    
    addStepInstructions(step, intent) {
      switch(step) {
        case 2:
          this.conversationContext.handlingTourScheduling = true;
          break;
        case 3:
          this.conversationContext.collectingContactInfo = true;
          break;
        case 5:
          this.conversationContext.discussingPricing = true;
          break;
        case 6:
          this.conversationContext.discussingAmenities = true;
          this.conversationContext.amenityCategory = intent;
          break;
        case 7:
          this.conversationContext.discussingPaymentOptions = true;
          break;
        case 9:
          this.conversationContext.requestingImages = true;
          break;
        case 10:
          this.conversationContext.sendingBrochure = true;
          break;
        case 11:
          this.conversationContext.discussingCareers = true;
          break;
        default:
          break;
      }
    }
    
    processNextSteps(response, step, intent) {
      switch(step) {
        case 5:
          if (!this.conversationContext.tourSuggested) {
            return `${response}\n\nWould you like to schedule a tour to see our community and amenities in person?`;
          }
          break;
        case 11:
          return `${response}\n\nYou can find more information about career opportunities at: ${this.knowledgeBase.careers_link}`;
        case 9:
          return `${response}\n\nI'd be happy to have someone send you some images of our community. Let me collect some information to get those sent to you.`;
        default:
          break;
      }
      
      return response;
    }
  }
  
  export default ConversationManager;