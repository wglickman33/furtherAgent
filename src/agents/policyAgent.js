import BaseAgent from './baseAgent';

class PolicyAgent extends BaseAgent {
  constructor(config) {
    super({
      ...config,
      name: 'PolicyAgent',
      role: 'You provide information about community policies and guidelines.'
    });
  }
  
  async generatePrompt(message, conversationContext) {
    const basePrompt = await super.generatePrompt(message, conversationContext);
    
    return `${basePrompt}
    
    ## Community Policies
    
    ### Age Requirements
    - Minimum age to live in the community: ${this.knowledgeBase.policies.minimum_age} years
    
    ### Pet Policy
    - Pets allowed: ${this.knowledgeBase.policies.pets.allowed ? 'Yes' : 'No'}
    - Pet types allowed: ${this.knowledgeBase.policies.pets.details.join(', ')}
    
    ### Smoking Policy
    - ${this.knowledgeBase.policies.smoking}
    
    ### Vehicle Policy
    - Residents allowed to have cars: ${this.knowledgeBase.policies.cars.allowed ? 'Yes' : 'No'}
    - Parking available: ${this.knowledgeBase.policies.cars.parking_available ? 'Yes' : 'No'}
    
    ### Living Arrangements
    - Couples allowed to live together: ${this.knowledgeBase.policies.couples.allowed ? 'Yes' : 'No'}
    - Men and women separated: No
    
    ### Visiting
    - ${this.knowledgeBase.policies.visiting.join(', ')}
    
    ### Lease Terms
    - Lease term: ${this.knowledgeBase.policies.lease_term} months
    
    ### Care Services
    - Skilled nursing: ${this.knowledgeBase.policies.skilled_nursing ? 'Available' : 'Not available'}
    - Respite care: ${this.knowledgeBase.policies.respite_care ? 'Provided' : 'Not provided'}
    - Adult day care: ${this.knowledgeBase.policies.adult_day_care ? 'Provided' : 'Not provided'}
    - Hospice: ${this.knowledgeBase.policies.hospice ? 'Provided' : 'Not provided'}
    - Physical therapy: ${this.knowledgeBase.policies.physical_therapy}
    - Speech therapy: ${this.knowledgeBase.policies.speech_therapy ? 'Available' : 'Information not available'}
    - Private aides: ${this.knowledgeBase.policies.private_aides_allowed ? 'Allowed' : 'Not allowed'}
    
    ### Accessibility
    - Vision impaired friendly: ${this.knowledgeBase.policies.vision_impaired_friendly ? 'Yes' : 'No'}
    - Wheelchair accessible: ${this.knowledgeBase.policies.wheelchair_accessible ? 'Fully' : 'Limited'}
    
    ### Security
    - Security measures: ${this.knowledgeBase.policies.security_measures.join(', ')}
    
    ## Community Information
    - Name: ${this.knowledgeBase.community.name}
    - Phone: ${this.knowledgeBase.community.phone}
    - Address: ${this.knowledgeBase.community.address}
    - Capacity: ${this.knowledgeBase.community.capacity}
    - Languages spoken: ${this.knowledgeBase.community.languages.join(', ')}
    
    ## Special Instructions
    - Answer policy questions directly and accurately
    - If they ask about a policy not in our knowledge base, offer to connect them with a team member
    - Be sensitive when discussing policies that might impact their loved one's situation
    
    Now respond to the user's policy question in a conversational, friendly manner:
    `;
  }
  
  async processMessage(message, conversationContext) {
    const prompt = await this.generatePrompt(message, conversationContext);
    const response = await this.callLLM(prompt);
    
    return {
      response: response
    };
  }
}

export default PolicyAgent;