import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ 
      padding: '1rem', 
      background: '#333', 
      color: 'white',
      textAlign: 'center',
      position: 'fixed',
      bottom: 0,
      width: '100%'
    }}>
      <p>© 2025 Admin Panel</p>
    </footer>
  );
};

export default Footer;