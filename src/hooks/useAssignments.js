import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAssignments() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  async function fetchAssignments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('due_date', { ascending: true })
    
    if (error) {
      console.error('Error fetching assignments:', error)
    } else {
      setAssignments(data || [])
    }
    setLoading(false)
  }

  async function addAssignment(assignment) {
    const { data, error } = await supabase
      .from('assignments')
      .insert([{
        title: assignment.title,
        subject: assignment.subject || '',
        due_date: assignment.due_date,
        status: 'pending'
      }])
      .select()
    
    if (error) {
      console.error('Error adding assignment:', error)
      return null
    }
    
    setAssignments(prev => [...prev, data[0]].sort((a, b) => 
      new Date(a.due_date) - new Date(b.due_date)
    ))
    return data[0]
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from('assignments')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating assignment:', error)
      return false
    }
    
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    ))
    return true
  }

  async function deleteAssignment(id) {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting assignment:', error)
      return false
    }
    
    setAssignments(prev => prev.filter(a => a.id !== id))
    return true
  }

  return {
    assignments,
    loading,
    addAssignment,
    updateStatus,
    deleteAssignment,
    refresh: fetchAssignments
  }
}