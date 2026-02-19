import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useExams() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExams()
  }, [])

  async function fetchExams() {
    setLoading(true)
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('exam_date', { ascending: true })
    
    if (error) {
      console.error('Error fetching exams:', error)
    } else {
      setExams(data || [])
    }
    setLoading(false)
  }

  async function addExam(exam) {
    const { data, error } = await supabase
      .from('exams')
      .insert([{
        subject: exam.subject,
        exam_type: exam.exam_type || '',
        exam_date: exam.exam_date,
        prep_status: exam.prep_status || 'not_started'
      }])
      .select()
    
    if (error) {
      console.error('Error adding exam:', error)
      return null
    }
    
    setExams(prev => [...prev, data[0]].sort((a, b) => 
      new Date(a.exam_date) - new Date(b.exam_date)
    ))
    return data[0]
  }

  async function updatePrepStatus(id, newStatus) {
    const { error } = await supabase
      .from('exams')
      .update({ prep_status: newStatus })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating exam:', error)
      return false
    }
    
    setExams(prev => prev.map(e => 
      e.id === id ? { ...e, prep_status: newStatus } : e
    ))
    return true
  }

  async function deleteExam(id) {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting exam:', error)
      return false
    }
    
    setExams(prev => prev.filter(e => e.id !== id))
    return true
  }

  return {
    exams,
    loading,
    addExam,
    updatePrepStatus,
    deleteExam,
    refresh: fetchExams
  }
}