import React from 'react';

const MessageInput = ({ onSendMessage, setMessage, message }) => {
  const handleSubmit = e => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
        required
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
