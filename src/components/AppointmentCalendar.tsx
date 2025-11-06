import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfWeek, endOfWeek } from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react'

interface Appointment {
  id: number
  candidate_id: string
  appointment_time: string
  position_code?: string
  candidate?: {
    first_name: string
    last_name: string
    email: string
  }
}

interface AppointmentCalendarProps {
  onAppointmentSelect?: (appointment: Appointment) => void
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  onAppointmentSelect,
  selectedDate = new Date(),
  onDateSelect
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [currentMonth])

  const fetchAppointments = async () => {
    try {
      const monthStart = startOfMonth(currentMonth)
      const monthEnd = endOfMonth(currentMonth)

      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('hrta_cd00-03_appointment_info')
        .select('*')
        .gte('appointment_time', monthStart.toISOString())
        .lte('appointment_time', monthEnd.toISOString())
        .order('appointment_time', { ascending: true })

      if (appointmentsError) throw appointmentsError

      const { data: candidatesData, error: candidatesError } = await supabase
        .from('hrta_cd00-01_resume_extraction')
        .select('candidate_id, first_name, last_name, email')

      if (candidatesError) throw candidatesError

      // Merge appointment data with candidate data
      const appointmentsWithCandidates = (appointmentsData || []).map(appointment => ({
        ...appointment,
        candidate: candidatesData?.find(c => c.candidate_id === appointment.candidate_id)
      }))

      setAppointments(appointmentsWithCandidates)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => {
      if (!appointment.appointment_time) return false
      try {
        return isSameDay(parseISO(appointment.appointment_time), date)
      } catch {
        return false
      }
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const isToday = (date: Date) => {
    return isSameDay(date, new Date())
  }

  const isSelected = (date: Date) => {
    return isSameDay(date, selectedDate)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(day => {
            const dayAppointments = getAppointmentsForDate(day)
            const isCurrentMonthDay = isCurrentMonth(day)
            const isTodayDay = isToday(day)
            const isSelectedDay = isSelected(day)

            return (
              <button
                key={day.toString()}
                onClick={() => onDateSelect?.(day)}
                className={`
                  h-20 p-1 rounded-lg border transition-colors text-left relative
                  ${isCurrentMonthDay 
                    ? 'border-gray-200 hover:bg-gray-50' 
                    : 'border-gray-100 text-gray-400'
                  }
                  ${isTodayDay ? 'bg-blue-50 border-blue-200' : ''}
                  ${isSelectedDay ? 'bg-blue-100 border-blue-300' : ''}
                `}
              >
                <div className="text-sm font-medium">
                  {format(day, 'd')}
                </div>
                
                {/* Appointment indicators */}
                <div className="mt-1 space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment, index) => (
                    <div
                      key={appointment.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onAppointmentSelect?.(appointment)
                      }}
                      className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate hover:bg-blue-200 transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <Clock className="h-2 w-2" />
                        <span>
                          {appointment.appointment_time ? 
                            format(parseISO(appointment.appointment_time), 'HH:mm')
                            : 'No time'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayAppointments.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AppointmentCalendar