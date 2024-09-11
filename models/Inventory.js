// models/Inventory.js
import { db } from '../config/firebase.js';

class Inventory {
  constructor(userId) {
    this.userId = userId;
    this.inventoryRef = db.collection('inventories').doc(this.userId);
  }

  async getInventory() {
    const inventorySnapshot = await this.inventoryRef.get();
    if (!inventorySnapshot.exists) {
      throw new Error('Inventory not found');
    }
    return inventorySnapshot.data();
  }

  async addItem(itemId, itemData) {
    await this.inventoryRef.update({
      [`items.${itemId}`]: itemData
    });
  }

  async removeItem(itemId) {
    await this.inventoryRef.update({
      [`items.${itemId}`]: firebase.firestore.FieldValue.delete()
    });
  }
}

export default Inventory;
