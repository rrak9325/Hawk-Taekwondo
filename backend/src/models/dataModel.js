// Data Model
// Data access for school data

import { db } from '../config/database.js'

export class DataModel {
  async read() {
    try {
      return db.read()
    } catch (error) {
      console.error('Data model read error:', error)
      throw error
    }
  }

  async write(data) {
    try {
      return db.write(data)
    } catch (error) {
      console.error('Data model write error:', error)
      throw error
    }
  }

  exists() {
    return db.exists()
  }
}

export const dataModel = new DataModel()
export default dataModel