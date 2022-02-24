import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/info');
  }, []);
  return (
    <div>
      <h1>Main</h1>
    </div>
  );
}

export default Main;
