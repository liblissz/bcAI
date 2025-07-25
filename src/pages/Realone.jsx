
import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import Header from '../Components/Header/Header';
import ChatSection from '../Components/ChartSection/Chartsection'; // ✅ Correct import name
import axios from 'axios';

const Realone = () => {
  const API_BASE = "https://btcbackend-e7yt.onrender.com/ai/chat";

  const [opennav, setopennav] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setopennav(!opennav);
  };

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/conversations`);
      if (res.data.length === 0) {
        await createConversation();
      } else {
        setConversations(res.data);
      }
    } catch (error) {
      console.error("Fetch conversations error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new conversation
  const createConversation = async () => {
    try {
      const res = await axios.post(`${API_BASE}/conversations`);
      const newConvs = [res.data, ...conversations];
      setConversations(newConvs);
      setCurrentIndex(0);
      setCurrentMessages([]);
    } catch (error) {
      console.error("Create conversation error:", error);
    }
  };

  // Select conversation
  const selectConversation = async (index, convs = conversations) => {
    const conv = convs[index];
    if (!conv) return;

    setCurrentIndex(index);
    try {
      const res = await axios.get(`${API_BASE}/messages/${conv._id}`);
      setCurrentMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setCurrentMessages([]);
    }
  };

  // Clear all history
  const clearHistory = async () => {
    try {
      await axios.delete("https://btcbackend-e7yt.onrender.com/api/chat/conversations");
      setConversations([]);
      setCurrentMessages([]);
      setCurrentIndex(null);
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  // Send user message
  const sendMessage = async () => {
    if (!input.trim() || currentIndex === null) return;

    const conversationId = conversations[currentIndex]._id;
    const userMessage = { role: "user", content: input.trim() };

    setCurrentMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}`, {
        userMessage: userMessage.content,
        conversationId,
      });

      const assistantMessage = {
        role: "assistant",
        content: res.data.message || "⚠️ AI returned no message.",
      };

      setCurrentMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Send message error:", error);
      setCurrentMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Server error, try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="app-container">
        <Sidebar
          isOpen={opennav}
          loading={loading}
          conversations={conversations}
          currentIndex={currentIndex}
          selectConversation={selectConversation}
          clearHistory={clearHistory}
          createConversation={createConversation}
          fetchConversations={fetchConversations}
          onToggleSidebar={toggleSidebar}
        />

        <div className="chat-container">
          <Header onToggleSidebar={toggleSidebar} />
          <ChatSection
            isOpen={opennav}
            currentMessages={currentMessages}
            sendMessage={sendMessage}
            setInput={setInput}
            input={input}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Realone;











