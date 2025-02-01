import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onLogin(idInstance, apiTokenInstance);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="ID Instance"
        value={idInstance}
        onChange={e => setIdInstance(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="API Token Instance"
        value={apiTokenInstance}
        onChange={e => setApiTokenInstance(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
