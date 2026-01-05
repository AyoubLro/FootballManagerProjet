import app from './firebase';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  addDoc,
  orderBy 
} from 'firebase/firestore';

const db = getFirestore(app);

// Collections
export const playersCollection = collection(db, 'players');
export const matchesCollection = collection(db, 'matches');
export const usersCollection = collection(db, 'users');
export const trainingCollection = collection(db, 'training_sessions');
export const logsCollection = collection(db, 'logs');

// ==================== PLAYER OPERATIONS ====================
export const addPlayer = async (playerData) => {
  try {
    const docRef = await addDoc(playersCollection, {
      ...playerData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
};

export const getPlayers = async () => {
  try {
    const snapshot = await getDocs(playersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting players:', error);
    throw error;
  }
};

export const updatePlayer = async (playerId, playerData) => {
  try {
    const playerRef = doc(db, 'players', playerId);
    await updateDoc(playerRef, playerData);
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
};

export const deletePlayer = async (playerId) => {
  try {
    const playerRef = doc(db, 'players', playerId);
    await deleteDoc(playerRef);
  } catch (error) {
    console.error('Error deleting player:', error);
    throw error;
  }
};

export const getPlayerById = async (playerId) => {
  try {
    const playerRef = doc(db, 'players', playerId);
    const playerSnap = await getDoc(playerRef);
    return playerSnap.exists() ? { id: playerSnap.id, ...playerSnap.data() } : null;
  } catch (error) {
    console.error('Error getting player:', error);
    throw error;
  }
};

// ==================== MATCH OPERATIONS ====================
export const addMatch = async (matchData) => {
  try {
    const docRef = await addDoc(matchesCollection, {
      ...matchData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding match:', error);
    throw error;
  }
};

export const getMatches = async () => {
  try {
    const snapshot = await getDocs(matchesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
};

export const updateMatch = async (matchId, matchData) => {
  try {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, matchData);
  } catch (error) {
    console.error('Error updating match:', error);
    throw error;
  }
};

export const deleteMatch = async (matchId) => {
  try {
    const matchRef = doc(db, 'matches', matchId);
    await deleteDoc(matchRef);
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};

export const getUpcomingMatches = async () => {
  try {
    const q = query(matchesCollection, where('date', '>=', new Date().toISOString()));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting upcoming matches:', error);
    throw error;
  }
};

// ==================== USER OPERATIONS ====================
export const getUsers = async () => {
  try {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// ==================== TRAINING SESSION OPERATIONS ====================
export const addTrainingSession = async (sessionData) => {
  try {
    const docRef = await addDoc(trainingCollection, {
      ...sessionData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding training session:', error);
    throw error;
  }
};

export const getTrainingSessions = async () => {
  try {
    const snapshot = await getDocs(trainingCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting training sessions:', error);
    throw error;
  }
};

// ==================== LOG OPERATIONS ====================
export const addLog = async (logData) => {
  try {
    const docRef = await addDoc(logsCollection, {
      ...logData,
      timestamp: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding log:', error);
    throw error;
  }
};

export const getLogs = async () => {
  try {
    const q = query(logsCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting logs:', error);
    throw error;
  }
};

// ==================== QUERY OPERATIONS ====================
export const getPlayersByPosition = async (position) => {
  try {
    const q = query(playersCollection, where('position', '==', position));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting players by position:', error);
    throw error;
  }
};

export const searchPlayers = async (searchTerm) => {
  try {
    const allPlayers = await getPlayers();
    return allPlayers.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching players:', error);
    throw error;
  }
};

export default db;