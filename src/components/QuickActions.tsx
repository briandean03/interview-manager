import React from 'react'
import { Calendar, Users, FileText, ChartBar as BarChart3, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

interface QuickActionsProps {
  onNewAppointment?: () => void
  candidateCount?: number
  appointmentCount?: number
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onNewAppointment,
  candidateCount = 0,
  appointmentCount = 0
}) => {
  const actions = [
    {
      title: 'Schedule Interview',
      description: 'Book a new interview appointment',
      icon: Calendar,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: onNewAppointment
    },
    {
      title: 'View Candidates',
      description: `${candidateCount} candidates available`,
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700',
      link: '/candidates'
    },
    {
      title: 'Interview Results',
      description: 'Review evaluation results',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700',
      link: '/results'
    },
    {
      title: 'Progress Monitor',
      description: 'Track interview progress',
      icon: BarChart3,
      color: 'bg-orange-600 hover:bg-orange-700',
      link: '/progress'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <h3 className="text-lg font-semibold text-gray-900 text-center sm:text-left">
          Quick Actions
        </h3>
        <div className="flex justify-center sm:justify-end flex-wrap gap-3 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{candidateCount} candidates</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{appointmentCount} appointments</span>
          </div>
        </div>
      </div>

      {/* Action grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((action, index) => {
          const ActionComponent = action.link ? Link : 'button'
          const actionProps = action.link ? { to: action.link } : { onClick: action.onClick }

          return (
            <ActionComponent
              key={index}
              {...actionProps}
              className={`${action.color} text-white rounded-lg p-3 sm:p-4 flex flex-col justify-center items-start text-left transition-colors duration-200 shadow-sm hover:shadow group`}
            >
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <action.icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <h4 className="font-medium text-sm sm:text-base leading-tight">{action.title}</h4>
              </div>
              <p className="text-[12px] sm:text-sm opacity-90 leading-snug">
                {action.description}
              </p>
            </ActionComponent>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
