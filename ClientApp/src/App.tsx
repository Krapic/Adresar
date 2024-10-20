// ClientApp/src/App.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ContactList from './components/ContactList';

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/:id" element={<ContactList />} />
      </Routes>
    </div>
  );
};

export default App;