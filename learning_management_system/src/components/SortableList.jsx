import { useState } from "react";

export default function SortableList({
  items = [],
  editable = false,
  onReorder,
  renderItem,
  className = "",
  itemClassName = "",
}) {
  const [dragged, setDragged] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  function handleDragStart(e, elId) {
    if (!editable) return;
    setDragged(elId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e, elId) {
    if (!editable) return;
    e.preventDefault();
    if (elId !== dragOver) {
      setDragOver(elId);
    }
  }

  function handleDragLeave() {
    if (!editable) return;
    setDragOver(null);
  }

  function handleDrop(e, elId) {
    if (!editable) return;
    e.preventDefault();
    if (!dragged || dragged === elId) return;

    if (onReorder) {
      onReorder(dragged, elId);
    }

    setDragged(null);
    setDragOver(null);
  }

  function handleDragEnd() {
    if (!editable) return;
    setDragged(null);
    setDragOver(null);
  }

  return (
    <div className={`sortable-list ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className={
            `${itemClassName}` +
            (editable && item.id === dragOver ? " module-card--drag-over" : "")
          }
          draggable={editable}
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item.id)}
          onDragEnd={handleDragEnd}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
