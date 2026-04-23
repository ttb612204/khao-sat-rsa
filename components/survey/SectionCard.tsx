'use client';

import React from 'react';
import { Card } from 'antd';

interface SectionCardProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ id, title, description, children }) => {
  return (
    <Card 
      id={id}
      title={title} 
      className="section-card"
      styles={{ header: { borderBottom: '1px solid #f0f0f0', background: '#fafafa' } }}
    >
      {description && (
        <p style={{ marginBottom: 24, fontStyle: 'italic', color: '#8c8c8c' }}>
          {description}
        </p>
      )}
      {children}
    </Card>
  );
};

export default SectionCard;
