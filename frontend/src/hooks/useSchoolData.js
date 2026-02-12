import { useState, useEffect } from 'react'
import dataService from '../services/dataService.js'

export function useSchoolData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await dataService.getSchoolData()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching school data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = () => fetchData()

  return {
    data,
    loading,
    error,
    refetch
  }
}

// Hook for specific data sections
export function useSchoolSection(sectionName) {
  const { data, loading, error, refetch } = useSchoolData()
  
  return {
    data: data?.[sectionName] || null,
    loading,
    error,
    refetch
  }
}