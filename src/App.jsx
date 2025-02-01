import React, { useState } from 'react';
import './App.css';
import Login from './Login.jsx';
import Chat from './Chat.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  const handleLogin = (idInstance, apiTokenInstance) => {
    setIdInstance(idInstance);
    setApiTokenInstance(apiTokenInstance);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat idInstance={idInstance} apiTokenInstance={apiTokenInstance} />
      )}
    </div>
  );
}

export default App;
