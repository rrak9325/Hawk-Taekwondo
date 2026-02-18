import { useState, useEffect, useCallback } from 'react'
import dataService from '../services/dataService.js'

export function useSchoolData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    let isMounted = true
    
    try {
      setLoading(true)
      setError(null)
      const result = await dataService.getSchoolData()
      
      if (isMounted) {
        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error)
        }
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message)
        console.error('Error fetching school data:', err)
      }
    } finally {
      if (isMounted) {
        setLoading(false)
      }
    }
    
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const cleanup = fetchData()
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup()
      }
    }
  }, [fetchData])

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