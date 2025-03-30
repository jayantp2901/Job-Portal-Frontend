import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { BsRobot } from "react-icons/bs";
import { IoClose } from "react-icons/io5"; // Import close icon

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChatbot = () => setIsOpen(!isOpen);
  const closeChat = () => setIsOpen(false); // Close chat function

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error fetching response." }]);
    }
  };

  return (
    <div>
      {/* Floating Chatbot Icon */}
      <div
        className="fixed bottom-6 right-6 bg-blue-500 p-3 rounded-full cursor-pointer text-white shadow-lg hover:bg-blue-600"
        onClick={toggleChatbot}
      >
        <BsRobot size={30} />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-6 bg-white w-80 h-96 shadow-lg rounded-lg flex flex-col overflow-hidden border">
          {/* Header with Close Button */}
          <div className="bg-blue-500 text-white p-3 font-semibold flex justify-between items-center">
            <span>Job-Genie</span>
            <button onClick={closeChat} className="text-white hover:text-gray-300">
              <IoClose size={22} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span className={`px-3 py-2 rounded-lg inline-block ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="p-2 flex border-t">
            <input
              type="text"
              className="flex-1 border rounded-lg p-2"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="ml-2 bg-blue-500 p-2 rounded-lg text-white">
              <IoMdSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
