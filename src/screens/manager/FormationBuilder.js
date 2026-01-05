import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { getPlayers } from '../../services/firestore';
import { saveFormationOffline } from '../../services/database';
import { Ionicons } from '@expo/vector-icons';

// Professional football formations with realistic positions
const formations = {
  '4-4-2': {
    name: '4-4-2 Classic',
    rows: 4,
    positions: [
      { id: 'GK', name: 'Goalkeeper', row: 0, col: 2 },
      { id: 'RB', name: 'Right Back', row: 1, col: 1 },
      { id: 'RCB', name: 'Center Back', row: 1, col: 2 },
      { id: 'LCB', name: 'Center Back', row: 1, col: 3 },
      { id: 'LB', name: 'Left Back', row: 1, col: 4 },
      { id: 'RM', name: 'Right Mid', row: 2, col: 1 },
      { id: 'RCM', name: 'Center Mid', row: 2, col: 2 },
      { id: 'LCM', name: 'Center Mid', row: 2, col: 3 },
      { id: 'LM', name: 'Left Mid', row: 2, col: 4 },
      { id: 'RS', name: 'Striker', row: 3, col: 2 },
      { id: 'LS', name: 'Striker', row: 3, col: 3 }
    ]
  },
  '4-3-3': {
    name: '4-3-3 Attacking',
    rows: 4,
    positions: [
      { id: 'GK', name: 'Goalkeeper', row: 0, col: 2 },
      { id: 'RB', name: 'Right Back', row: 1, col: 1 },
      { id: 'RCB', name: 'Center Back', row: 1, col: 2 },
      { id: 'LCB', name: 'Center Back', row: 1, col: 3 },
      { id: 'LB', name: 'Left Back', row: 1, col: 4 },
      { id: 'CDM', name: 'Defensive Mid', row: 2, col: 2 },
      { id: 'CM', name: 'Center Mid', row: 2, col: 3 },
      { id: 'CAM', name: 'Attacking Mid', row: 2, col: 4 },
      { id: 'RW', name: 'Right Wing', row: 3, col: 1 },
      { id: 'ST', name: 'Striker', row: 3, col: 2.5 },
      { id: 'LW', name: 'Left Wing', row: 3, col: 4 }
    ]
  },
  '3-5-2': {
    name: '3-5-2 Modern',
    rows: 4,
    positions: [
      { id: 'GK', name: 'Goalkeeper', row: 0, col: 2 },
      { id: 'RCB', name: 'Center Back', row: 1, col: 1 },
      { id: 'CB', name: 'Center Back', row: 1, col: 2 },
      { id: 'LCB', name: 'Center Back', row: 1, col: 3 },
      { id: 'RWB', name: 'Wing Back', row: 2, col: 1 },
      { id: 'RCM', name: 'Center Mid', row: 2, col: 2 },
      { id: 'CM', name: 'Center Mid', row: 2, col: 2.5 },
      { id: 'LCM', name: 'Center Mid', row: 2, col: 3 },
      { id: 'LWB', name: 'Wing Back', row: 2, col: 4 },
      { id: 'RS', name: 'Striker', row: 3, col: 1.5 },
      { id: 'LS', name: 'Striker', row: 3, col: 2.5 }
    ]
  }
};

export default function FormationBuilder() {
  const [selectedFormation, setSelectedFormation] = useState('4-4-2');
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [assignedPlayers, setAssignedPlayers] = useState({});
  const [formationName, setFormationName] = useState('My Starting XI');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [playerModalVisible, setPlayerModalVisible] = useState(false);
  const [availablePositions, setAvailablePositions] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const playerList = await getPlayers();
      setTeamPlayers(playerList);
    } catch (error) {
      console.error('Error fetching players:', error);
      Alert.alert('Error', 'Failed to load players');
    }
  };

  const handlePositionPress = (positionId) => {
    const position = formations[selectedFormation].positions.find(p => p.id === positionId);
    const positionName = position ? position.name : positionId;
    
    // Get players suitable for this position
    const suitablePlayers = getPlayersForPosition(positionId);
    
    setSelectedPosition(positionId);
    setAvailablePositions(suitablePlayers);
    setPlayerModalVisible(true);
  };

  const getPlayersForPosition = (positionId) => {
    const positionType = positionId.substring(0, 2);
    let positionCategories = [];
    
    // Map position to player categories
    switch(positionType) {
      case 'GK':
        positionCategories = ['Goalkeeper'];
        break;
      case 'RB': case 'LB': case 'CB': case 'RCB': case 'LCB':
        positionCategories = ['Defender'];
        break;
      case 'RM': case 'LM': case 'CM': case 'CDM': case 'CAM': case 'RCM': case 'LCM':
        positionCategories = ['Midfielder'];
        break;
      case 'RW': case 'LW': case 'ST': case 'RS': case 'LS':
        positionCategories = ['Forward'];
        break;
      case 'RWB': case 'LWB':
        positionCategories = ['Defender', 'Midfielder'];
        break;
      default:
        positionCategories = ['Defender', 'Midfielder', 'Forward'];
    }
    
    return teamPlayers.filter(player => 
      positionCategories.includes(player.position) || 
      positionCategories.length === 0
    );
  };

  const assignPlayerToPosition = (player) => {
    if (!selectedPosition) return;
    
    setAssignedPlayers(prev => ({
      ...prev,
      [selectedPosition]: player
    }));
    
    setPlayerModalVisible(false);
    setSelectedPosition(null);
  };

  const clearPosition = (positionId) => {
    setAssignedPlayers(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[positionId];
      return newAssignments;
    });
  };

  const saveFormation = async () => {
    const assignedCount = Object.keys(assignedPlayers).length;
    if (assignedCount < 11) {
      Alert.alert(
        'Incomplete Formation',
        `You have assigned ${assignedCount}/11 players. Save anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save', onPress: saveConfirmed }
        ]
      );
    } else {
      saveConfirmed();
    }
  };

  const saveConfirmed = async () => {
    if (!formationName.trim()) {
      Alert.alert('Error', 'Please enter a formation name');
      return;
    }

    const formationData = {
      name: formationName,
      formation: selectedFormation,
      players: Object.entries(assignedPlayers).map(([positionId, player]) => ({
        position: positionId,
        playerId: player.id,
        playerName: player.name,
        playerPosition: player.position
      })),
      timestamp: new Date().toISOString()
    };

    try {
      await saveFormationOffline(formationData);
      Alert.alert('Success', 'Formation saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save formation');
    }
  };

  const resetFormation = () => {
    Alert.alert(
      'Reset Formation',
      'Are you sure you want to clear all player assignments?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => setAssignedPlayers({}) }
      ]
    );
  };

  const renderPitch = () => {
    const formation = formations[selectedFormation];
    const rows = 4;
    const positions = formation.positions;
    
    return (
      <View style={styles.pitchContainer}>
        <View style={styles.pitch}>
          {/* Pitch markings */}
          <View style={styles.centerCircle} />
          <View style={styles.centerLine} />
          <View style={styles.penaltyBoxLeft} />
          <View style={styles.penaltyBoxRight} />
          <View style={styles.goalBoxLeft} />
          <View style={styles.goalBoxRight} />
          <View style={styles.centerSpot} />
          
          {/* Position circles */}
          {positions.map((pos) => {
            const rowHeight = 100 / rows;
            const top = `${(pos.row * rowHeight) + (rowHeight / 2) - 5}%`;
            const left = `${(pos.col / 5) * 100 - 5}%`;
            const player = assignedPlayers[pos.id];
            
            return (
              <TouchableOpacity
                key={pos.id}
                style={[styles.positionCircle, { top, left }]}
                onPress={() => handlePositionPress(pos.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.positionLabel}>{pos.id}</Text>
                {player ? (
                  <View style={styles.playerAssigned}>
                    <Text style={styles.playerInitials} numberOfLines={1}>
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                    <Text style={styles.playerName} numberOfLines={1}>
                      {player.name.split(' ')[0]}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.emptyPosition}>+</Text>
                )}
                {player && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => clearPosition(pos.id)}
                  >
                    <Ionicons name="close-circle" size={14} color="#dc3545" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        
        <Text style={styles.pitchInstruction}>
          Tap a position to assign a player
        </Text>
      </View>
    );
  };

  const renderPlayerModal = () => (
    <Modal
      visible={playerModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setPlayerModalVisible(false);
        setSelectedPosition(null);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select Player for {selectedPosition}
            </Text>
            <TouchableOpacity 
              onPress={() => setPlayerModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={availablePositions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalPlayerItem}
                onPress={() => assignPlayerToPosition(item)}
                activeOpacity={0.7}
              >
                <View style={styles.modalPlayerAvatar}>
                  <Text style={styles.modalPlayerAvatarText}>
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.modalPlayerInfo}>
                  <Text style={styles.modalPlayerName}>{item.name}</Text>
                  <Text style={styles.modalPlayerPosition}>{item.position}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.noPlayersText}>
                No suitable players found for this position
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Formation Builder</Text>
      
      <View style={styles.formationSelector}>
        {Object.keys(formations).map(key => (
          <TouchableOpacity
            key={key}
            style={[styles.formationButton, selectedFormation === key && styles.selectedFormation]}
            onPress={() => {
              setSelectedFormation(key);
              setAssignedPlayers({});
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.formationButtonText, selectedFormation === key && styles.selectedFormationText]}>
              {formations[key].name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formationNameContainer}>
        <Text style={styles.label}>Formation Name</Text>
        <View style={styles.nameInputContainer}>
          <Ionicons name="text" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.formationNameInput}
            value={formationName}
            onChangeText={setFormationName}
            placeholder="Enter formation name"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {renderPitch()}

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Object.keys(assignedPlayers).length}</Text>
          <Text style={styles.statLabel}>Players Assigned</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{11 - Object.keys(assignedPlayers).length}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{teamPlayers.length}</Text>
          <Text style={styles.statLabel}>Total Players</Text>
        </View>
      </View>

      <View style={styles.assignedPlayers}>
        <Text style={styles.sectionTitle}>Starting XI</Text>
        {Object.keys(assignedPlayers).length === 0 ? (
          <Text style={styles.emptyListText}>No players assigned yet</Text>
        ) : (
          <View style={styles.assignedList}>
            {formations[selectedFormation].positions.map(pos => {
              const player = assignedPlayers[pos.id];
              if (!player) return null;
              
              return (
                <View key={pos.id} style={styles.assignedItem}>
                  <View style={styles.assignedPosition}>
                    <Text style={styles.assignedPositionText}>{pos.id}</Text>
                  </View>
                  <View style={styles.assignedPlayerInfo}>
                    <Text style={styles.assignedPlayerName}>{player.name}</Text>
                    <Text style={styles.assignedPlayerPosition}>{player.position}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => clearPosition(pos.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="trash-outline" size={18} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={saveFormation}>
          <Ionicons name="save-outline" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.saveButtonText}>Save Formation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetFormation}>
          <Ionicons name="refresh-outline" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.resetButtonText}>Reset All</Text>
        </TouchableOpacity>
      </View>

      {renderPlayerModal()}
    </ScrollView>
  );
}

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 60,
    minHeight: '100%'
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#1a1a1a',
    textAlign: 'center'
  },
  formationSelector: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 25,
    justifyContent: 'center',
    gap: 10
  },
  formationButton: { 
    backgroundColor: '#e9ecef', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8, 
    minWidth: 100
  },
  selectedFormation: { 
    backgroundColor: '#007bff' 
  },
  formationButtonText: { 
    color: '#333', 
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14
  },
  selectedFormationText: {
    color: '#fff'
  },
  formationNameContainer: {
    marginBottom: 25
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15
  },
  inputIcon: {
    marginRight: 10
  },
  formationNameInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333'
  },
  pitchContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  pitch: {
    width: '100%',
    height: 300,
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative'
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: -50,
    marginTop: -50
  },
  centerLine: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: '#fff'
  },
  centerSpot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginLeft: -4,
    marginTop: -4
  },
  penaltyBoxLeft: {
    position: 'absolute',
    left: 0,
    top: '20%',
    width: '18%',
    height: '60%',
    borderRightWidth: 2,
    borderColor: '#fff'
  },
  penaltyBoxRight: {
    position: 'absolute',
    right: 0,
    top: '20%',
    width: '18%',
    height: '60%',
    borderLeftWidth: 2,
    borderColor: '#fff'
  },
  goalBoxLeft: {
    position: 'absolute',
    left: 0,
    top: '35%',
    width: '6%',
    height: '30%',
    borderRightWidth: 2,
    borderColor: '#fff'
  },
  goalBoxRight: {
    position: 'absolute',
    right: 0,
    top: '35%',
    width: '6%',
    height: '30%',
    borderLeftWidth: 2,
    borderColor: '#fff'
  },
  positionCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007bff',
    transform: [{ translateX: -25 }, { translateY: -25 }]
  },
  positionLabel: {
    position: 'absolute',
    top: 2,
    fontSize: 10,
    color: '#007bff',
    fontWeight: 'bold'
  },
  playerAssigned: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  playerInitials: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2
  },
  playerName: {
    fontSize: 8,
    color: '#666',
    maxWidth: 40,
    textAlign: 'center'
  },
  emptyPosition: {
    fontSize: 20,
    color: '#007bff',
    fontWeight: 'bold'
  },
  clearButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  pitchInstruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  },
  assignedPlayers: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15
  },
  emptyListText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20
  },
  assignedList: {
    gap: 10
  },
  assignedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8
  },
  assignedPosition: {
    backgroundColor: '#007bff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  assignedPositionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  assignedPlayerInfo: {
    flex: 1
  },
  assignedPlayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  assignedPlayerPosition: {
    fontSize: 12,
    color: '#666'
  },
  removeButton: {
    padding: 8
  },
  actionButtons: {
    gap: 15
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  resetButton: {
    backgroundColor: '#6c757d',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonIcon: {
    marginRight: 10
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  modalCloseButton: {
    padding: 5
  },
  modalPlayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalPlayerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  modalPlayerAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  modalPlayerInfo: {
    flex: 1
  },
  modalPlayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  modalPlayerPosition: {
    fontSize: 14,
    color: '#666'
  },
  noPlayersText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 30
  }
});