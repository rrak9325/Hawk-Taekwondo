// Data Model
// Data access for school data - Direct file implementation

export class DataModel {
  async read() {
    try {
      const fs = await import('fs')
      const path = await import('path')
      const { fileURLToPath } = await import('url')
      
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const mockDataPath = path.join(__dirname, '../../../public/mockData.json')
      
      if (!fs.existsSync(mockDataPath)) {
        console.error('mockData.json not found')
        return null
      }
      
      const data = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'))
      return data
    } catch (error) {
      console.error('Data model read error:', error)
      throw error
    }
  }

  async write(data) {
    try {
      const fs = await import('fs')
      const path = await import('path')
      const { fileURLToPath } = await import('url')
      
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const mockDataPath = path.join(__dirname, '../../../public/mockData.json')
      
      // Write data directly to mockData.json
      fs.writeFileSync(mockDataPath, JSON.stringify(data, null, 2), 'utf8')
      
      return true
    } catch (error) {
      console.error('Failed to save data:', error)
      throw error
    }
  }

  async exists() {
    try {
      const fs = await import('fs')
      const path = await import('path')
      const { fileURLToPath } = await import('url')
      
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const mockDataPath = path.join(__dirname, '../../../public/mockData.json')
      
      return fs.existsSync(mockDataPath) && fs.statSync(mockDataPath).size > 0
    } catch (error) {
      console.error('Data model exists check error:', error)
      return false
    }
  }
}

export const dataModel = new DataModel()
export default dataModel