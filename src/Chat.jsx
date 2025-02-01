import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';

const Chat = ({ idInstance, apiTokenInstance }) => {
  const [messages, setMessages] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const lastMessageRef = useRef(null); // Реф для доступа к последнему сообщению
  const receiptIdListRef = useRef(new Set()); // Используем useRef для хранения receiptIdList
  const [isProcessing, setIsProcessing] = useState(false); // Флаг для блокировки обработки

  useEffect(() => {
    const fetchMessages = async () => {
      if (isProcessing) {
        console.log('Processing in progress, skipping fetch.');
        return;
      }

      setIsProcessing(true);

      try {
        const response = await axios.get(
          `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
        );
        console.log('Fetch messages response:', response.data); // Логируем полный ответ

        if (response.data) {
          const receiptId = response.data.receiptId;
          const messageText =
            response?.data?.body?.messageData?.textMessageData?.textMessage;

          if (messageText && !receiptIdListRef.current.has(receiptId)) {
            const newMessage = {
              text: messageText,
              sender: 'other',
              receiptId: receiptId,
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            receiptIdListRef.current.add(receiptId);
            console.log('Added receiptId to list:', receiptId);
          }

          // Удаляем уведомление после обработки, независимо от наличия сообщения
          await deleteNotification(receiptId);
        }
      } catch (error) {
        console.error(
          'Error fetching messages:',
          error.response ? error.response.data : error.message,
        );
      } finally {
        setIsProcessing(false);
      }
    };

    const deleteNotification = async receiptId => {
      try {
        const response = await axios.delete(
          `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
        );
        console.log('Notification deleted:', response.data);
        if (response.data.result) {
          receiptIdListRef.current.delete(receiptId);
          console.log('Deleted receiptId from list:', receiptId);
        }
      } catch (error) {
        console.error(
          'Error deleting notification:',
          error.response ? error.response.data : error.message,
        );
        // Повторная попытка удаления через 1 секунду
        setTimeout(() => deleteNotification(receiptId), 1000);
      }
    };

    const interval = setInterval(fetchMessages, 1000); // Обновляем каждую секунду

    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, [idInstance, apiTokenInstance, isProcessing]);

  useLayoutEffect(() => {
    // Проматываем к последнему сообщению при обновлении списка сообщений
    if (lastMessageRef.current) {
      requestAnimationFrame(() => {
        lastMessageRef.current.scrollIntoView({
          behavior: 'auto',
          block: 'end',
        });
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!phoneNumber || !message) {
      alert('Please enter a phone number and a message.');
      return;
    }

    const chatId = `${phoneNumber}@c.us`;
    const data = {
      chatId: chatId,
      message: message,
    };

    try {
      console.log('Sending message:', data); // Логируем данные запроса
      const response = await axios.post(
        `https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`,
        data,
      );
      console.log('Message sent:', response.data); // Логируем ответ
      setMessages(prevMessages => [
        ...prevMessages,
        { text: message, sender: 'self', receiptId: response.data.receiptId },
      ]);
      setMessage(''); // Очищаем поле ввода после отправки
    } catch (error) {
      console.error(
        'Error sending message:',
        error.response ? error.response.data : error.message,
      ); // Логируем детали ошибки
    }
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <h2>Chat with {phoneNumber}</h2>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <div className="chat-body">
        <MessageList messages={messages} lastMessageRef={lastMessageRef} />
      </div>
      <div className="chat-footer">
        <MessageInput
          onSendMessage={sendMessage}
          setMessage={setMessage}
          message={message}
        />
      </div>
    </div>
  );
};

export default Chat;
