import React, { useRef, useEffect } from 'react';
import { useDragLayer, useDrag } from 'react-dnd';
import { TAG_TYPE } from './Sidebar';

const Tag = ({ tag, onTagMove, containerRef }) => {
  const tagRef = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: TAG_TYPE,
    item: { id: tag.id, label: tag.label, originalX: tag.x, originalY: tag.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Use dragLayer to track pointer offset in real time
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

export default Tag;
