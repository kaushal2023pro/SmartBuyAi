import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import Loader from "./Loader";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 Tell me your budget and purpose (gaming, coding, editing)." }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    setMessages([...messages, { role: "user", text }]);
    setLoading(true);

    try {
      const response = await fetch("https://smartbuybacekend.onrender.com/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      const data = await response.json();

      if (data.success) {
        let botResponse = "Here are my recommendations:\n\n";
        data.data.laptops.forEach((laptop, index) => {
          botResponse += `${index + 1}. ${laptop.name}\n   💰 ${laptop.price}\n   🛠 ${laptop.specs}\n   🔗 [View Link](${laptop.link})\n\n`;
        });

        setMessages((prev) => [
          ...prev,
          { role: "bot", text: botResponse },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "Sorry, something went wrong. Please try again." },
        ]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to server." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} text={msg.text} />
        ))}
        {loading && <Loader />}
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  );
};
