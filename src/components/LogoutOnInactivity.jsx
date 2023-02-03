import React, { useState, useEffect, useRef } from 'react';

const LogoutOnInactivity = () => {
  const [lastActive, setLastActive] = useState(Date.now());
  const intervalId = useRef(null);

  useEffect(() => {
    const handleUserActivity = () => {
      setLastActive(Date.now());
    };

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);

    return () => {
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
    };
  }, []);

  useEffect(() => {
    const logoutIfInactive = () => {
      if (Date.now() - lastActive >= 300000) {
        // aquí va la función o endpoint que él esté utiliando para que los usuarios se salgan del sistema.
      }
    };

    intervalId.current = setInterval(logoutIfInactive, 60000);
    return () => clearInterval(intervalId.current);
  }, [lastActive]);

  return null;
};

export default LogoutOnInactivity;
