# ACME Senior Living Assistant

A 3-hour hackathon multi-agent AI system for senior living community sales and inquiries.
This application demonstrates a modern approach to conversational AI by breaking down a complex task into specialized agents with clear separation of concerns.

## Features

- **Multi-Agent Architecture**: Routes user inquiries to specialized agents for accurate responses
- **Knowledge-Based Responses**: All information is drawn from a structured knowledge base
- **Validation Layer**: Ensures responses are accurate and consistent
- **Conversational UI**: User-friendly chat interface
- **Debug Panel**: Visualize the inner workings of the multi-agent system

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:

git clone https://github.com/wglickman33/furtherAgent.git
cd furtherAgent

2. Install dependencies:

npm install OR npm i

3. Create a `.env` file in the root directory:

VITE_OPENAI_API_KEY=your_openai_api_key_here

4. Start the development server:

npm run dev

5. Open your browser and navigate to:

http://localhost:5173
Or your default localhost

## System Architecture

The application is built around a multi-agent architecture:

- **Router Agent**: Analyzes user queries and directs them to specialized agents
- **Pricing Agent**: Handles cost-related questions
- **Tour Agent**: Manages tour scheduling
- **Amenities Agent**: Provides information about facility features and services
- **Policy Agent**: Answers questions about rules and guidelines
- **Validator Agent**: Ensures factual accuracy of all responses

All agents access a central knowledge base containing community information.

## Usage

1. Type a question in the chat input
2. The system will automatically route your question to the appropriate specialized agent
3. Toggle the debug panel to see which agent is handling each response
4. Try different types of questions to see how the system routes between agents

Example questions to try:

- "How much does it cost to live here?"
- "What amenities do you offer?"
- "Can I schedule a tour next week?"
- "Do you allow pets in the community?"
- "What types of rooms are available?"

## Development

### Project Structure

/src
/agents # Agent definitions
baseAgent.js # Base agent class
routerAgent.js # Intent routing agent
pricingAgent.js # Pricing specialist
tourAgent.js # Tour scheduling specialist
amenitiesAgent.js # Amenities information agent
policyAgent.js # Policy information agent
validatorAgent.js # Response validation agent
/lib # Utility functions and data
knowledgeBase.js # Structured information about the community
conversationManager.js # Orchestrates agent interactions
config.js # System configuration
App.jsx # Main UI component
App.css # UI styling
main.jsx # Application entry point

## License

MIT
