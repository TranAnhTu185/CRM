'use client';

import React, { useState } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onConfig: () => void;
  onConnect: () => void;
  onDelete: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onConfig, onConnect, onDelete }) => {
  return (
    <div style={{
      position: 'absolute',
      top: y,
      left: x,
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}>
      <div onClick={onConfig} style={{ padding: '8px', cursor: 'pointer' }}>Cấu hình</div>
      <div onClick={onConnect} style={{ padding: '8px', cursor: 'pointer' }}>Kết nối</div>
      <div onClick={onDelete} style={{ padding: '8px', cursor: 'pointer' }}>Xóa</div>
    </div>
  )
};

export default ContextMenu;
