import React from 'react'
import { Calendar, Users, FileText, ChartBar as BarChart3, Plus, Clock } from 'lucide-react'
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{candidateCount} candidates</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{appointmentCount} appointments</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const ActionComponent = action.link ? Link : 'button'
          const actionProps = action.link
            ? { to: action.link }
            : { onClick: action.onClick }

          return (
            <ActionComponent
              key={index}
              {...actionProps}
              className={`${action.color} text-white p-4 rounded-lg transition-colors group text-left block min-h-[100px]`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <action.icon className="h-6 w-6 flex-shrink-0" />
                <h4 className="font-medium text-base leading-tight">{action.title}</h4>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">{action.description}</p>
            </ActionComponent>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions