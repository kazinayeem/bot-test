
import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Assalamu Alaikum! Ami AI shopping assistant 😄 Kono product niye help lagle bolun.",
    },
  ]);

  // =========================
  // DEMO PRODUCTS
  // =========================

  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: "180000 BDT",
      stock: 3,
      warranty: "1 Year Official",
      description: "Apple flagship smartphone",
      variants: [
        {
          color: "Black",
          stock: 2,
        },
        {
          color: "White",
          stock: 1,
        },
      ],
    },

    {
      id: 2,
      name: "Samsung S24 Ultra",
      price: "145000 BDT",
      stock: 5,
      warranty: "1 Year Official",
      description: "Samsung premium flagship",
      variants: [
        {
          color: "Titanium Gray",
          stock: 2,
        },
        {
          color: "Blue",
          stock: 3,
        },
      ],
    },

    {
      id: 3,
      name: "MacBook Air M4",
      price: "165000 BDT",
      stock: 2,
      warranty: "2 Years",
      description: "Apple lightweight laptop",
      variants: [
        {
          color: "Silver",
          stock: 1,
        },
        {
          color: "Midnight",
          stock: 1,
        },
      ],
    },
  ];

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    const currentMessage = message;

    setMessage("");
    setLoading(true);

    try {
      // =========================
      // CONVERT CHAT HISTORY
      // =========================

      const history = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // =========================
      // API CALL
      // =========================

      const response = await fetch(
        "https://manpower-trial-kindly.ngrok-free.dev/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: currentMessage,
            history,
            products,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "❌ API error. Backend/server check korun.",
        },
      ]);
    }

    setLoading(false);
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="app-container">
      {/* HEADER */}
      <div className="header">
        <div className="header-content">
          <h1 className="header-title">AI Assistant</h1>
          <p className="header-subtitle">Bangla + Banglish Support</p>
        </div>
        <div className="online-badge">● Online</div>
      </div>

      {/* CHAT AREA */}
      <div className="chat-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && <div className="message assistant typing">🤖 Typing...</div>}
      </div>

      {/* QUICK QUESTIONS */}
      <div className="quick-questions">
        {[
          "iphone 15 pro price koto",
          "macbook air available ase?",
          "order korte chai",
          "kon color available?",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setMessage(item)}
            className="quick-btn"
          >
            {item}
          </button>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask about products..."
          className="input-field"
        />
        <button onClick={sendMessage} disabled={loading} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
}
