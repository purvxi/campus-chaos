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
      console.error('Error fetching subjects:', error.message)
    } else {
      setSubjects(data || [])
    }

    setLoading(false)
  }

  // ✅ ADD SUBJECT (Clean & Safe)
  async function addSubject(subject) {
    const total = Number(subject.total) || 0
    const attended = Number(subject.attended) || 0
    const required = Number(subject.required) || 75

    // Prevent invalid case
    if (attended > total) {
      alert("Attended classes can't be more than total classes.")
      return null
    }

    const { data, error } = await supabase
      .from('subjects')
      .insert([{
        name: subject.name.trim(),
        total,
        attended,
        required
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding subject:', error.message)
      alert("Failed to add subject. Check console for details.")
      return null
    }

    // Update local state instantly
    setSubjects(prev => [data, ...prev])

    return data
  }

  async function updateSubject(id, updates) {
    const { error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating subject:', error.message)
      return false
    }

    setSubjects(prev =>
      prev.map(s => s.id === id ? { ...s, ...updates } : s)
    )

    return true
  }

  async function deleteSubject(id) {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting subject:', error.message)
      return false
    }

    setSubjects(prev => prev.filter(s => s.id !== id))
    return true
  }

  async function markPresent(id) {
    const subject = subjects.find(s => s.id === id)
    if (!subject) return false

    return updateSubject(id, {
      attended: subject.attended + 1,
      total: subject.total + 1
    })
  }

  async function markAbsent(id) {
    const subject = subjects.find(s => s.id === id)
    if (!subject) return false

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