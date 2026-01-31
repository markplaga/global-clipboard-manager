import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/Dashboard'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Fetch snippets
  const { data: snippets } = await supabase
    .from('snippets')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <Dashboard
      user={user}
      initialCategories={categories || []}
      initialSnippets={snippets || []}
    />
  )
}
