// client/src/App.jsx
import React from 'react';
import PdfViewer from './components/PdfViewer';
import Sidebar from './components/Sidebar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <PdfViewer />
      </div>
    </DndProvider>
  );
};

export default App;
