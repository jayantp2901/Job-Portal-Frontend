import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isVisible, setIsVisible] = useState(true); // ✅ Toggle chatbot visibility

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  return (
    <div>
        <h1>Chatbot</h1>
      {/* Chatbot Icon (Toggles Chatbot) */}
      <div className="chatbot" onClick={() => setIsVisible(!isVisible)}>
        <i className="fa-brands fa-rocketchat chatbot-icon"></i>
      </div>

      {/* Chatbot Window */}
      {isVisible && (
        <div className="chatbot-div">
          <div className="chatbot-header">
            <h5>EduX AI Chatbot</h5>
            <i className="fa-solid fa-times close-chatbot" onClick={() => setIsVisible(false)}></i>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="chatbot-form">
            <input
              type="text"
              id="chatbot-input"
              className="form-control chatbot-search"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-success">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
    
  );
};

export default Chatbot;
