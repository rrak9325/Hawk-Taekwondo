import { useState, useEffect } from 'react'
import apiService from '../services/api.js'

export function useSchoolData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async (useCache = true) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.getData(useCache)
      setData(result)
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

  const refetch = () => fetchData(false)

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