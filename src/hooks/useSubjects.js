import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSubjects() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubjects()
  }, [])

  async function fetchSubjects() {
    setLoading(true)
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching subjects:', error)
    } else {
      setSubjects(data || [])
    }
    setLoading(false)
  }

  async function addSubject(subject) {
    const { data, error } = await supabase
      .from('subjects')
      .insert([{
        name: subject.name,
        total: subject.total || 0,
        attended: subject.attended || 0,
        required: subject.required || 75
      }])
      .select()
    
    if (error) {
      console.error('Error adding subject:', error)
      return null
    }
    
    setSubjects(prev => [data[0], ...prev])
    return data[0]
  }

  async function updateSubject(id, updates) {
    const { error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating subject:', error)
      return false
    }
    
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    return true
  }

  async function deleteSubject(id) {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting subject:', error)
      return false
    }
    
    setSubjects(prev => prev.filter(s => s.id !== id))
    return true
  }

  async function markPresent(id) {
    const subject = subjects.find(s => s.id === id)
    if (!subject) return
    
    return updateSubject(id, {
      attended: subject.attended + 1,
      total: subject.total + 1
    })
  }

  async function markAbsent(id) {
    const subject = subjects.find(s => s.id === id)
    if (!subject) return
    
    return updateSubject(id, {
      total: subject.total + 1
    })
  }

  return {
    subjects,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    markPresent,
    markAbsent,
    refresh: fetchSubjects
  }
}