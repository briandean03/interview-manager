import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

const createSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://unynvfttpzhjhcdzwspr.supabase.co'
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueW52ZnR0cHpoamhjZHp3c3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjE4NjAsImV4cCI6MjA3MDIzNzg2MH0.rcmn4R6tIxbg6ome9_kY3Y7jsVc289DeM84Eugw36Io'

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found')
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

// Function to reset the connection
export const resetSupabaseConnection = () => {
  console.log('Resetting Supabase connection...')
  
  // Clear the existing instance
  if (supabaseInstance) {
    // Close any existing connections
    try {
      supabaseInstance.removeAllChannels()
    } catch (error) {
      console.warn('Error closing existing channels:', error)
    }
  }
  
  supabaseInstance = null
  
  // Create a new instance
  supabaseInstance = createSupabaseClient()
  
  return supabaseInstance
}

// Get or create the Supabase client
export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient()
  }
  return supabaseInstance
}

// Export the client (will be created on first access)
export const supabase = getSupabaseClient()

// Export configuration check
export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL  || 'https://unynvfttpzhjhcdzwspr.supabase.co'
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueW52ZnR0cHpoamhjZHp3c3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjE4NjAsImV4cCI6MjA3MDIzNzg2MH0.rcmn4R6tIxbg6ome9_kY3Y7jsVc289DeM84Eugw36Io'
  return !!(url && key && url.includes('supabase.co'))
}

// Test connection function
export const testSupabaseConnection = async () => {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error('Supabase client not configured. Please set up your Supabase connection.')
  }

  try {
    // console.log('Testing connection to:', import.meta.env.VITE_SUPABASE_URL)
    const { data, error } = await client
      .from('hrta_cd00-01_resume_extraction')
      .select('candidate_id')
      .limit(1)

    if (error) {
      console.error('Supabase query error:', error)
      if (error.message.includes('Failed to fetch') || error.code === 'PGRST301') {
        throw new Error('Cannot connect to Supabase. Please check your project URL and ensure the project is not paused.')
      }
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('Supabase connection test successful')
    return true
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    if (error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED'))) {
      throw new Error('Cannot reach Supabase server. This usually means:\n\n• The Supabase project URL is incorrect\n• The Supabase project is paused or deleted\n• Network connectivity issues\n\nPlease click "Connect to Supabase" to set up your database connection.')
    }
    throw error
  }
}