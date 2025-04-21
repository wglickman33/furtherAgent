import knowledgeBase from './knowledgeBase';
import RouterAgent from '../agents/routerAgent';
import PricingAgent from '../agents/pricingAgent';
import TourAgent from '../agents/tourAgent';
import AmenitiesAgent from '../agents/amenitiesAgent';
import PolicyAgent from '../agents/policyAgent';
import ValidatorAgent from '../agents/validatorAgent';
import ConversationManager from './conversationManager';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

function validateConfig() {
  if (!apiKey) {
    console.error("API key not found! Please add VITE_OPENAI_API_KEY to your .env file");
    throw new Error("Missing API key");
  }
}

export async function initializeApp() {
  validateConfig();
  
  const agents = [
    new RouterAgent({ knowledgeBase, apiKey }),
    new PricingAgent({ knowledgeBase, apiKey }),
    new TourAgent({ knowledgeBase, apiKey }),
    new AmenitiesAgent({ knowledgeBase, apiKey }),
    new PolicyAgent({ knowledgeBase, apiKey }),
    new ValidatorAgent({ knowledgeBase, apiKey })
  ];
  
  const conversationManager = new ConversationManager({
    agents,
    knowledgeBase
  });
  
  return conversationManager;
}

export async function handleUserMessage(conversationManager, message) {
  try {
    const response = await conversationManager.processUserMessage(message);
    console.log("Agent Response:", response);
    return response;
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
}