import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const FormationPitch = ({ formation, players, onPlayerDrop }) => {
  const renderPositions = () => {
    const positions = [];
    let top = 10;
    
    formation.forEach((rowCount, rowIndex) => {
      const rowHeight = 80 / formation.length;
      for (let i = 0; i < rowCount; i++) {
        const left = (100 / (rowCount + 1)) * (i + 1);
        positions.push(
          <View
            key={`${rowIndex}-${i}`}
            style={[styles.positionCircle, { top: `${top}%`, left: `${left}%` }]}
            onStartShouldSetResponder={() => true}
            onResponderRelease={() => onPlayerDrop(`${rowIndex}-${i}`, { id: Date.now() })}
          >
            <Text style={styles.positionText}>+</Text>
          </View>
        );
      }
      top += rowHeight;
    });
    
    return positions;
  };

  return (
    <View style={styles.pitchContainer}>
      <View style={styles.pitch}>
        {renderPositions()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pitchContainer: { alignItems: 'center', marginVertical: 20 },
  pitch: {
    width: '100%',
    aspectRatio: 0.7,
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#fff',
  },
  positionCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007bff',
  },
  positionText: { fontSize: 20, color: '#007bff', fontWeight: 'bold' },
});

export default FormationPitch;