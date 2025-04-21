import { useState, useEffect } from "react";
import "./App.css";
import { initializeApp, handleUserMessage } from "./lib/config";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, this is ACME Senior Living. My name is Sophie. How may I help you today?",
      agent: "System",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [conversationManager, setConversationManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    currentAgent: "None",
    currentStep: 1,
    agentResponses: [],
  });

  useEffect(() => {
    async function setup() {
      try {
        const manager = await initializeApp();
        setConversationManager(manager);
        setLoading(false);
      } catch (error) {
        console.error("Failed to initialize:", error);
        setLoading(false);
      }
    }

    setup();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !conversationManager) return;

    setMessages((prev) => [...prev, { role: "user", content: inputText }]);
    const currentInput = inputText;
    setInputText("");
    setLoading(true);

    try {
      setDebugInfo((prev) => ({
        ...prev,
        status: "processing",
        message: currentInput,
        timestamp: new Date().toISOString(),
      }));

      const response = await handleUserMessage(
        conversationManager,
        currentInput
      );

      const currentContext = conversationManager.conversationContext;
      const lastMessage =
        currentContext.messageHistory[currentContext.messageHistory.length - 1];

      setDebugInfo((prev) => ({
        currentAgent: lastMessage.agent || "Unknown",
        currentStep: currentContext.currentStep || 0,
        status: "completed",
        agentResponses: [
          ...prev.agentResponses,
          {
            agent: lastMessage.agent || "Unknown",
            step: currentContext.currentStep || 0,
            timestamp: new Date().toISOString(),
            message: currentInput,
            response: response,
          },
        ],
      }));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          agent: lastMessage.agent || "Unknown",
        },
      ]);
    } catch (error) {
      console.error("Error processing message:", error);

      setDebugInfo((prev) => ({
        ...prev,
        status: "error",
        error: error.message,
      }));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble processing your request. Would you like to be connected to a team member?",
          agent: "Error Handler",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-header">
        <h1>ACME Senior Living Assistant</h1>
        <button onClick={() => setShowDebug(!showDebug)}>
          {showDebug ? "Hide Debug" : "Show Debug"}
        </button>
      </div>

      <div className="main-content">
        <div className="chat-interface">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.content}
                  {msg.role === "assistant" && showDebug && (
                    <div className="agent-tag">Agent: {msg.agent}</div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="input-area">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message here..."
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !inputText.trim()}
            >
              Send
            </button>
          </div>
        </div>

        {showDebug && (
          <div className="debug-panel">
            <h3>Debug Information</h3>
            <div className="debug-section">
              <h4>Current State</h4>
              <div className="debug-item">
                <span className="debug-label">Current Agent:</span>
                <span className="debug-value">{debugInfo.currentAgent}</span>
              </div>
              <div className="debug-item">
                <span className="debug-label">Current Step:</span>
                <span className="debug-value">{debugInfo.currentStep}</span>
              </div>
            </div>

            <div className="debug-section">
              <h4>Agent Response History</h4>
              <div className="agent-history">
                {debugInfo.agentResponses.map((item, index) => (
                  <div key={index} className="agent-history-item">
                    <div className="history-header">
                      <span className="agent-name">{item.agent}</span>
                      <span className="timestamp">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="history-details">
                      <div>Step: {item.step}</div>
                    </div>
                    <div className="history-message">
                      <div>User: {item.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
