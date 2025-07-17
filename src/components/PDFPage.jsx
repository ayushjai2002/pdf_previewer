import React, { useRef, useEffect } from 'react';
import { Page } from 'react-pdf';
import { useDrop, useDrag, useDragLayer } from 'react-dnd';
import { TAG_TYPE } from './Sidebar';

// Tag component with real-time movement
const Tag = ({ tag, onTagMove, containerRef }) => {
  const [{ isDragging }, drag] = useDrag({
    type: TAG_TYPE,
    item: { id: tag.id, label: tag.label, x: tag.x, y: tag.y, pageNumber: tag.pageNumber },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const { currentOffset, isDragging: isDragLayerActive, item } = useDragLayer((monitor) => ({
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
  }));

  useEffect(() => {
    if (
      isDragLayerActive &&
      item?.id === tag.id &&
      currentOffset &&
      containerRef.current
    ) {
      const rect = containerRef.current.getBoundingClientRect();
      const newX = currentOffset.x - rect.left - 30;
      const newY = currentOffset.y - rect.top - 12;

      const clampedX = Math.max(0, Math.min(newX, rect.width - 60));
      const clampedY = Math.max(0, Math.min(newY, rect.height - 24));

      // Real-time move
      onTagMove(tag.id, clampedX, clampedY, tag.pageNumber);
    }
  }, [currentOffset, isDragLayerActive]);

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: tag.x,
        top: tag.y,
        opacity: isDragging ? 0.5 : 1,
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
  );
};

const PDFPage = ({ pageNumber, droppedTags, onTagDrop, onTagMove }) => {
  const containerRef = useRef(null);

  const [, drop] = useDrop(() => ({
    accept: TAG_TYPE,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const rect = containerRef.current?.getBoundingClientRect();

      if (!clientOffset || !rect) return;

      const x = clientOffset.x - rect.left - 30;
      const y = clientOffset.y - rect.top - 12;

      const clampedX = Math.max(0, Math.min(x, rect.width - 60));
      const clampedY = Math.max(0, Math.min(y, rect.height - 24));

      if (item.isNew) {
        onTagDrop({
          id: Date.now(),
          label: item.label,
          x: clampedX,
          y: clampedY,
          pageNumber,
        });
      }
    },
  }));

  useEffect(() => {
    console.log('Rendered Page:', pageNumber);
  }, [pageNumber]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        drop(node);
      }}
      style={{
        position: 'relative',
        marginBottom: '20px',
        width: 800,
        border: '1px solid #ccc',
      }}
    >
      <Page
        key={`page_${pageNumber}`}
        pageNumber={pageNumber}
        width={800}
        renderAnnotationLayer={false}
      />

      {droppedTags.map((tag) =>
        tag.pageNumber === pageNumber ? (
          <Tag
            key={tag.id}
            tag={tag}
            onTagMove={onTagMove}
            containerRef={containerRef}
          />
        ) : null
      )}
    </div>
  );
};

export default PDFPage;
