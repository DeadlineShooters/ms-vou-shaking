// models/Player.js
import { db } from '../config/firebase.js';

class Player {
  constructor(userId) {
    this.userId = userId;
    this.userRef = db.collection('users').doc(this.userId);
  }

  async getPlayerInfo() {
    const playerSnapshot = await this.userRef.get();
    if (!playerSnapshot.exists) {
      throw new Error('Player not found');
    }
    return playerSnapshot.data();
  }

  async createPlayer({ username, email, phoneNumber }) {
    const createdAt = new Date().toISOString();
    await this.userRef.set({
      username,
      email,
      phoneNumber,
      remainingPlays: 10, // Default initial plays
      friends: {},
      createdAt
    });
  }

  async updateRemainingPlays(plays) {
    await this.userRef.update({
      remainingPlays: plays
    });
  }

  async addFriend(friendUserId) {
    await this.userRef.update({
      [`friends.${friendUserId}`]: true
    });
  }

  async removeFriend(friendUserId) {
    await this.userRef.update({
      [`friends.${friendUserId}`]: firebase.firestore.FieldValue.delete()
    });
  }
}

export default Player;
