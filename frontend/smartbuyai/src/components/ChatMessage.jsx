import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ role, text }) {
  return (
    <div className={`message ${role}`}>
      <span>{role === "bot" ? "🤖" : "👤"}</span>
      <div className="message-content">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
};