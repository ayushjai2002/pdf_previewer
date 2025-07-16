import React, { useRef, useEffect, useState } from 'react';
import { Page } from 'react-pdf';
import { useDrop } from 'react-dnd';
import Draggable from 'react-draggable';
import { TAG_TYPE } from './Sidebar';

const PDFPage = ({ pageNumber, droppedTags, onTagDrop, onTagMove }) => {
  const containerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);

  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      }
    };

    // Wait a moment after mount for layout stabilization
    const timeout = setTimeout(updateRect, 300);
    window.addEventListener('resize', updateRect);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateRect);
    };
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: TAG_TYPE,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const rect = containerRef.current?.getBoundingClientRect();

      if (!clientOffset || !rect) return;

      // ✅ Only drop if the mouse is inside this page
      if (
        clientOffset.y < rect.top ||
        clientOffset.y > rect.bottom
      ) {
        return;
      }

      const x = clientOffset.x - rect.left - 30; // adjust tag center
      const y = clientOffset.y - rect.top - 12;

      const clampedX = Math.max(0, Math.min(x, rect.width - 60));
      const clampedY = Math.max(0, Math.min(y, rect.height - 24));

      onTagDrop({
        id: Date.now(),
        label: item.label,
        x: clampedX,
        y: clampedY,
        pageNumber,
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  const handleDrag = (e, data, tagId) => {
    onTagMove(tagId, data.x, data.y, pageNumber);
  };

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        drop(node);
      }}
      style={{
        position: 'relative',
        marginBottom: '20px',
        border: isOver ? '2px dashed #007bff' : 'none',
        width: 800,
      }}
    >
      <Page key={`page_${pageNumber}`} pageNumber={pageNumber} width={800} renderAnnotationLayer={false} />

      {droppedTags.map((tag) => (
        <Draggable
          key={tag.id}
          position={{ x: tag.x, y: tag.y }}
          bounds="parent"
          onStop={(e, data) => handleDrag(e, data, tag.id)}
        >
          <div
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(255,255,0,0.85)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'move',
              userSelect: 'none',
              zIndex: 10,
            }}
          >
            {tag.label}
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default PDFPage;
