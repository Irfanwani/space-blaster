import React from 'react';
import { View } from 'react-native';
import { BulletEntity } from '../types';

interface BulletViewProps {
  bullet: BulletEntity;
}

export const BulletView: React.FC<BulletViewProps> = ({ bullet }) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: bullet.position.x - bullet.width / 2,
        top: bullet.position.y - bullet.height / 2,
        width: bullet.width,
        height: bullet.height,
        backgroundColor: bullet.color,
        borderRadius: bullet.width / 2,
        shadowColor: bullet.color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
      }}
    />
  );
};
