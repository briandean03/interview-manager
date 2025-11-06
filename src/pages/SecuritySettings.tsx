import React from 'react'
import { Shield, Database, Globe, Settings } from 'lucide-react'
import DatabaseStatus from '../components/DatabaseStatus'

const SecuritySettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
              <p className="text-gray-600">Database security and CORS configuration</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Database Status */}
          <DatabaseStatus />

          {/* CORS Configuration */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">CORS Configuration</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Allowed Origins</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <code className="text-sm text-gray-800">*</code>
                    <p className="text-xs text-gray-600 mt-1">All origins are allowed</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Allowed Methods</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <code className="text-sm text-gray-800">GET, POST, PUT, DELETE, OPTIONS, PATCH</code>
                    <p className="text-xs text-gray-600 mt-1">All standard HTTP methods</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Allowed Headers</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <code className="text-sm text-gray-800">
                      Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Client-Info, apikey
                    </code>
                    <p className="text-xs text-gray-600 mt-1">Standard headers for API requests</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Max Age</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <code className="text-sm text-gray-800">86400 seconds (24 hours)</code>
                    <p className="text-xs text-gray-600 mt-1">Preflight cache duration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edge Functions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Settings className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Edge Functions</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">CORS Handler</h4>
                    <p className="text-sm text-gray-600">Handles cross-origin requests and provides CORS proxy functionality</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Available
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Available Endpoints</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><code>/cors-handler/health</code> - Health check endpoint</li>
                    <li><code>/cors-handler/proxy</code> - CORS proxy for external API calls</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Security Best Practices</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">✅ Implemented</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Row Level Security (RLS) enabled on all tables</li>
                    <li>• Proper CORS headers configured</li>
                    <li>• Public access policies for read operations</li>
                    <li>• Secure API key handling</li>
                    <li>• Edge function CORS support</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">💡 Recommendations</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Consider implementing user authentication</li>
                    <li>• Add rate limiting for API endpoints</li>
                    <li>• Monitor database access patterns</li>
                    <li>• Regular security audits</li>
                    <li>• Environment-specific CORS policies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings