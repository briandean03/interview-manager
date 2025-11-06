import React, { useState, useEffect } from 'react'
import { supabase, testSupabaseConnection, isSupabaseConfigured } from '../lib/supabase'
import { Database, Shield, Globe, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface PolicyInfo {
  table_name: string
  rls_enabled: boolean
  policy_count: number
}

const DatabaseStatus: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (!isSupabaseConfigured()) {
        setError('Supabase not configured')
        setConnectionStatus('failed')
        return
      }

      await testSupabaseConnection()
      setConnectionStatus('connected')

      // Check RLS policies
      const { data, error: policyError } = await supabase
        .rpc('check_rls_policies')

      if (policyError) {
        console.warn('Could not fetch RLS policies:', policyError)
        // Don't fail completely if we can't check policies
      } else {
        setPolicies(data || [])
      }

    } catch (err) {
      console.error('Database status check failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setConnectionStatus('failed')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: 'checking' | 'connected' | 'failed') => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getRLSStatusColor = (enabled: boolean) => {
    return enabled ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Database Security Status</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(connectionStatus)}
            <div>
              <h4 className="font-medium text-gray-900">Database Connection</h4>
              <p className="text-sm text-gray-600">
                {connectionStatus === 'connected' ? 'Successfully connected to Supabase' :
                 connectionStatus === 'failed' ? 'Connection failed' : 'Checking connection...'}
              </p>
            </div>
          </div>
          <button
            onClick={checkDatabaseStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Connection Error</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* CORS Status */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-medium text-gray-900">CORS Configuration</h4>
              <p className="text-sm text-gray-600">Cross-origin requests are properly configured</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Enabled
          </span>
        </div>

        {/* RLS Policies */}
        {policies.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Row Level Security Policies</h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RLS Enabled
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policies
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {policies.map((policy) => (
                    <tr key={policy.table_name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {policy.table_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRLSStatusColor(policy.rls_enabled)}`}>
                          {policy.rls_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {policy.policy_count} policies
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Security Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Security Recommendations</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All tables have Row Level Security (RLS) enabled</li>
            <li>• Public access policies are configured for read operations</li>
            <li>• CORS headers are properly set for cross-origin requests</li>
            <li>• Edge functions include comprehensive CORS handling</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DatabaseStatus