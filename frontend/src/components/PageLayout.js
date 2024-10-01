import React from 'react';

const PageLayout = ({ children }) => {
  return (
    <div style={pageStyle}>
      {children}
    </div>
  );
};

const pageStyle = {
  background:`url("images/space1.jpg")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
};

export default PageLayout;