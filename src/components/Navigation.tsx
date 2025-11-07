import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Users,
  Calendar,
  ChartBar as BarChart3,
  FileText,
  UserCheck,
  Shield,
  Home
} from 'lucide-react'

const Navigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/candidates', icon: Users, label: 'Candidates' },
    { path: '/booking', icon: Calendar, label: 'Interview Booking' },
    { path: '/progress', icon: BarChart3, label: 'Progress Monitor' },
    { path: '/results', icon: FileText, label: 'Interview Results' },
    { path: '/security', icon: Shield, label: 'Security Settings' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 w-full">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        {/* Brand and menu container */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4">
          {/* Brand */}
          <div className="flex items-center justify-between mb-2 sm:mb-0">
            <div className="flex items-center gap-2">
              <UserCheck className="h-7 w-7 text-blue-600" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Interview Manager
              </h1>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex overflow-x-auto sm:overflow-visible no-scrollbar gap-2 sm:gap-4 md:gap-6 lg:gap-8 pb-1 sm:pb-0">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  location.pathname === path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar utility */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </nav>
  )
}

export default Navigation
