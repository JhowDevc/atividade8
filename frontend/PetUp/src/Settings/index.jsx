import React, { useState, useEffect } from 'react';
import './style.css'; // Se precisar de estilos específicos para esta página

function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notificationsEnabled') === 'true'
  );

  // Aplica o tema no body e salva a preferência
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notificationsEnabled', newValue);
  };

  return (
    <div className="settings-container" style={{ padding: '2rem' }}>
      <h2>Configurações</h2>
      <div className="setting-item" style={{ marginBottom: '1rem' }}>
        <label htmlFor="theme-select" style={{ marginRight: '1rem' }}>
          Escolha o tema:
        </label>
        <select id="theme-select" value={theme} onChange={handleThemeChange}>
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
        </select>
      </div>
      <div className="setting-item">
        <label htmlFor="notifications-toggle">
          <input
            type="checkbox"
            id="notifications-toggle"
            checked={notificationsEnabled}
            onChange={toggleNotifications}
            style={{ marginRight: '0.5rem' }}
          />
          Ativar Notificações
        </label>
      </div>
    </div>
  );
}

export default Settings;
