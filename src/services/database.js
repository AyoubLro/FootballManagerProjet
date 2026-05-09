import * as SQLite from 'expo-sqlite';

// Initialize database with new API
const db = SQLite.openDatabaseSync('football_manager.db');

export const initDatabase = async () => {
  try {
   
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firebaseId TEXT,
        name TEXT NOT NULL,
        position TEXT,
        phone TEXT,
        email TEXT,
        synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firebaseId TEXT,
        opponent TEXT NOT NULL,
        date TEXT,
        location TEXT,
        result TEXT DEFAULT 'Upcoming',
        synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionId TEXT,
        playerId TEXT,
        status TEXT CHECK(status IN ('present', 'absent', 'late')),
        date TEXT,
        synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS formations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firebaseId TEXT,
        name TEXT,
        formation TEXT,
        players TEXT,
        synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        body TEXT,
        type TEXT,
        read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// ==================== PLAYER OPERATIONS ====================
export const addPlayerOffline = async (player) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO players (name, position, phone, email, synced) VALUES (?, ?, ?, ?, 0);`,
      [player.name, player.position, player.phone, player.email]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
};

export const getOfflinePlayers = async () => {
  try {
    const players = await db.getAllAsync(
      `SELECT * FROM players ORDER BY name;`
    );
    return players;
  } catch (error) {
    console.error('Error getting players:', error);
    throw error;
  }
};

export const getUnsyncedPlayers = async () => {
  try {
    const players = await db.getAllAsync(
      `SELECT * FROM players WHERE synced = 0;`
    );
    return players;
  } catch (error) {
    console.error('Error getting unsynced players:', error);
    throw error;
  }
};

export const markPlayerAsSynced = async (playerId) => {
  try {
    await db.runAsync(
      `UPDATE players SET synced = 1 WHERE id = ?;`,
      [playerId]
    );
  } catch (error) {
    console.error('Error marking player as synced:', error);
    throw error;
  }
};

// ==================== MATCH OPERATIONS ====================
export const addMatchOffline = async (match) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO matches (opponent, date, location, result, synced) VALUES (?, ?, ?, ?, 0);`,
      [match.opponent, match.date, match.location, match.result || 'Upcoming']
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding match:', error);
    throw error;
  }
};

export const getOfflineMatches = async () => {
  try {
    const matches = await db.getAllAsync(
      `SELECT * FROM matches ORDER BY date DESC;`
    );
    return matches;
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
};

export const getUnsyncedMatches = async () => {
  try {
    const matches = await db.getAllAsync(
      `SELECT * FROM matches WHERE synced = 0;`
    );
    return matches;
  } catch (error) {
    console.error('Error getting unsynced matches:', error);
    throw error;
  }
};

export const markMatchAsSynced = async (matchId) => {
  try {
    await db.runAsync(
      `UPDATE matches SET synced = 1 WHERE id = ?;`,
      [matchId]
    );
  } catch (error) {
    console.error('Error marking match as synced:', error);
    throw error;
  }
};

// ==================== ATTENDANCE OPERATIONS ====================
export const markAttendance = async (sessionId, playerId, status) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO attendance (sessionId, playerId, status, date) VALUES (?, ?, ?, ?);`,
      [sessionId, playerId, status, new Date().toISOString()]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};

export const getAttendanceBySession = async (sessionId) => {
  try {
    const attendance = await db.getAllAsync(
      `SELECT * FROM attendance WHERE sessionId = ?;`,
      [sessionId]
    );
    return attendance;
  } catch (error) {
    console.error('Error getting attendance:', error);
    throw error;
  }
};

// ==================== FORMATION OPERATIONS ====================
export const saveFormationOffline = async (formationData) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO formations (name, formation, players) VALUES (?, ?, ?);`,
      [formationData.name, formationData.formation, JSON.stringify(formationData.players)]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error saving formation:', error);
    throw error;
  }
};

export const getSavedFormations = async () => {
  try {
    const formations = await db.getAllAsync(
      `SELECT * FROM formations ORDER BY created_at DESC;`
    );
    return formations;
  } catch (error) {
    console.error('Error getting formations:', error);
    throw error;
  }
};

// ==================== NOTIFICATION OPERATIONS ====================
export const saveNotificationOffline = async (notification) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO notifications (title, body, type) VALUES (?, ?, ?);`,
      [notification.title, notification.body, notification.type || 'general']
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error saving notification:', error);
    throw error;
  }
};

export const getUnreadNotifications = async () => {
  try {
    const notifications = await db.getAllAsync(
      `SELECT * FROM notifications WHERE read = 0 ORDER BY created_at DESC;`
    );
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await db.runAsync(
      `UPDATE notifications SET read = 1 WHERE id = ?;`,
      [notificationId]
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// ==================== SYNC OPERATIONS ====================
export const syncAllData = async () => {
  try {
    console.log('Starting data sync...');
    
    const unsyncedPlayers = await getUnsyncedPlayers();
    const unsyncedMatches = await getUnsyncedMatches();
    
    console.log(`Found ${unsyncedPlayers.length} unsynced players and ${unsyncedMatches.length} unsynced matches`);
    
    return {
      playersSynced: unsyncedPlayers.length,
      matchesSynced: unsyncedMatches.length,
    };
  } catch (error) {
    console.error('Error syncing data:', error);
    throw error;
  }
};

export const clearAllData = async () => {
  try {
    await db.execAsync(`DELETE FROM players;`);
    await db.execAsync(`DELETE FROM matches;`);
    await db.execAsync(`DELETE FROM attendance;`);
    await db.execAsync(`DELETE FROM formations;`);
    await db.execAsync(`DELETE FROM notifications;`);
    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

// ==================== DATABASE UTILITIES ====================
export const closeDatabase = async () => {
  try {
    await db.closeAsync();
    console.log('Database closed successfully');
  } catch (error) {
    console.error('Error closing database:', error);
    throw error;
  }
};

export const deleteDatabase = async () => {
  try {
    await db.closeAsync();
    await SQLite.deleteDatabaseAsync('football_manager.db');
    console.log('Database deleted successfully');
  } catch (error) {
    console.error('Error deleting database:', error);
    throw error;
  }
};