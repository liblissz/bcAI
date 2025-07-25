// import React, { useRef, useState, useEffect } from 'react';
// import './Chartsection.css';
// import ReactMarkdown from "react-markdown"; 


// const ChatSection = ({ isOpen, currentMessages ,sendMessage, loading, setInput}) => {
//   const textareaRef = useRef(null);
//   const [inputText, setInputText] = useState('');
//   // const [messages, setMessages] = useState([]);
//   // const [loading, setLoading] = useState(false);
//   // const [conversationId, setConversationId] = useState(() => uuidv4());

//   // Auto-resize textarea
//   useEffect(() => {
//     const textarea = textareaRef.current;
//     const resize = () => {
//       textarea.style.height = 'auto';
//       textarea.style.height = textarea.scrollHeight + 'px';
//     };

//     textarea.addEventListener('input', resize);
//     return () => textarea.removeEventListener('input', resize);
//   }, []);

//   // Handle sending messages
//   const handleSend = async () => {
//     if (inputText.trim() === '') return;

//     const userMessage = inputText.trim();

//     // Add user message to chat UI immediately
//     // setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
//     // setInputText('');
//     // textareaRef.current.style.height = 'auto';
//     // setLoading(true);

//     // try {
//     //   const response = await axios.post('http://localhost:2500/ai/chat', { userMessage, conversationId });

//     //   const data = response.data; // axios auto parses JSON

//     //   if (response.status === 200) {
//     //     // Add AI response to chat UI
//     //     setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
//     //   } else {
//     //     setMessages((prev) => [
//     //       ...prev,
//     //       { role: 'assistant', content: '⚠️ Error: Failed to get AI response.' },
//     //     ]);
//     //   }
//     // } catch (error) {
//     //   setMessages((prev) => [
//     //     ...prev,
//     //     { role: 'assistant', content: '❌ Network error. Please try again.' },
//     //   ]);
//     //   console.error('Error:', error);
//     // }

//     // setLoading(false);
//   };

//   return (
//     <div className="chat-wrapper">
//       <div className="messages" id="messages">
//         <div className="intro-message">
//           <h1>Welcome to BtC AI</h1>
//           <p>Ask me anything. I'm powered by Che Fortune Orsa</p>
//           <div className="suggestion-chips">
//             {["Tell me a story", "Explain quantum computing", "Write a poem", "Help me learn JavaScript"].map((text) => (
//               <button
//                 key={text}
//                 className="suggestion-chip"
//                 onClick={() => {
//                   setInputText(text);
//                   // wait a moment for state update before sending
//                   setTimeout(() => {
//                     handleSend();
//                   }, 100);
//                 }}
//               >
//                 {text}
//               </button>
//             ))}
//           </div>
//         </div>
//          {currentMessages.map((msg, i) => (
//                     <div
//                        key={i} 
//                        className={`message ${msg.role}`}
//                       // className={msg.role === "assistant" ? "ai-message" : ""}
//                     >
//                       <div className="message-content"><ReactMarkdown >{msg.content}</ReactMarkdown> </div>
//                       {/* <-- render markdown */}
                    
//                     </div>
//                   ))}

//         {/* {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.role}`}>
          
            
//           </div>
//         ))} */}

//         {loading && (
//           <div className="message assistant">
//             <div className="message-content">Typing...</div>
//           </div>
//         )}
//       </div>


//       {!isOpen && (
//         <div className="input-area">
//           <div className="input-container">
//             <button
//               id="file-upload-button"
//               title="Upload File"
//               onClick={() => document.getElementById("file-upload").click()}
//             >
//               <i className="fas fa-paperclip"></i>
//             </button>
//             <button
//               id="file-upload-button"
//               title="Upload File"
//               onClick={() => document.getElementById("file-upload").click()}
//             >
//               <i className="fas fa-microphone"></i>
//             </button>
//             <textarea
//               ref={textareaRef}
//               id="user-input"
//               placeholder="Type your message here..."
//               value={inputText}
//              onChange={(e) => setInput(e.target.value)}
//               rows="1"
//               style={{ overflow: 'hidden', resize: 'none' }}
//               // onKeyDown={e => {
//               //   if (e.key === 'Enter' && !e.shiftKey) {
//               //     e.preventDefault();
//               // sendMessage()
//               //   }
//               // }}
//                 // onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             // disabled={loading}
//             />
//             <button id="send-button" title="Send message" onClick={sendMessage} disabled={loading}>
//               <i className="fas fa-paper-plane"></i>
//             </button>
//           </div>
//           <div className="disclaimer">
//             BtC produces accurate information but it can make mistakes.
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatSection;










import React, { useRef, useEffect } from 'react';
import './Chartsection.css';
import ReactMarkdown from 'react-markdown'; // ✅ required for markdown rendering
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
const ChatSection = ({ isOpen, currentMessages, sendMessage, loading, setInput, input }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    const resize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    };

    textarea.addEventListener('input', resize);
    return () => textarea.removeEventListener('input', resize);
  }, []);

  // Reset textarea height on input clear
  useEffect(() => {
    if (textareaRef.current && input === '') {
      textareaRef.current.style.height = 'auto';
    }
  }, [input]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    const messageContainer = document.getElementById('messages');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [currentMessages, loading]);

  return (
    <div className="chat-wrapper">
      <div className="messages" id="messages">
        <div className="intro-message">
          <h1>Welcome to BtC AI</h1>
          <p>Ask me anything. I'm powered by Che Fortune Orsa</p>
          <div className="suggestion-chips">
            {["How many drug do we have in stock?", "give me advice on how to grow the stock", "tell me more about medicines?", "what is the latest medicine out now?"].map((text) => (
              <button
                key={text}
                className="suggestion-chip"
                onClick={() => {
                  setInput(text);
                  setTimeout(() => {
                    sendMessage();
                  }, 100);
                }}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {currentMessages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-content">
              <ReactMarkdown  style={{color: "white"}} rehypePlugins={[rehypeRaw, rehypeSanitize]}>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div className="message-content">Typing...</div>
          </div>
        )}
      </div>

      {!isOpen && (
        <div className="input-area">
          <div className="input-container">
            <button
              id="file-upload-button"
              title="Upload File"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <i className="fas fa-paperclip"></i>
            </button>
           
            <textarea
              ref={textareaRef}
              id="user-input"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows="1"
              style={{ overflow: 'hidden', resize: 'none' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={loading}
            />
            <button
              id="send-button"
              title="Send message"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
          <div className="disclaimer">
            BtC produces accurate information but it can make mistakes.
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSection;




















