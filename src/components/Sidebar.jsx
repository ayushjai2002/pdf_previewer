// client/src/components/Sidebar.jsx
import React from 'react';
import { useDrag } from 'react-dnd';

const TAG_TYPE = 'TAG';

const Tag = ({ label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: TAG_TYPE,
    item: { label, isNew: true },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        padding: '8px 12px',
        margin: '8px 0',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '4px',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      {label}
    </div>
  );
};

const Sidebar = () => {
  const tags = ['Name', 'Email', 'Phone', 'Skills'];

  return (
    <div
      style={{
        width: '200px',
        padding: '20px',
        borderRight: '1px solid #ccc',
        backgroundColor: '#f5f5f5',
        height: '100vh',
      }}
    >
      <h3>Tags</h3>
      {tags.map((tag, index) => (
        <Tag key={index} label={tag} />
      ))}
    </div>
  );
};

export default Sidebar;
export { TAG_TYPE };
