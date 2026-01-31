'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Category, Snippet } from '@/types'
import { AppSidebar } from '@/components/AppSidebar'
import { SnippetCard } from '@/components/SnippetCard'
import { AddSnippetDialog } from '@/components/AddSnippetDialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'

interface DashboardProps {
    user: any
    initialCategories: Category[]
    initialSnippets: Snippet[]
}

export function Dashboard({ user, initialCategories, initialSnippets }: DashboardProps) {
    const router = useRouter()
    const supabase = createClient()

    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets)
    const [activeFilter, setActiveFilter] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleAddSnippet = async (content: string, categoryId: string | null) => {
        const { data, error } = await supabase
            .from('snippets')
            .insert([{ content, category_id: categoryId, user_id: user.id }])
            .select()
            .single()

        if (data) {
            setSnippets([data, ...snippets])
        }
    }

    const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
        const { error } = await supabase
            .from('snippets')
            .update({ is_favorite: isFavorite })
            .eq('id', id)

        if (!error) {
            setSnippets(snippets.map(s => s.id === id ? { ...s, is_favorite: isFavorite } : s))
        }
    }

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from('snippets')
            .delete()
            .eq('id', id)

        if (!error) {
            setSnippets(snippets.filter(s => s.id !== id))
        }
    }

    const handleCopy = async (content: string) => {
        await navigator.clipboard.writeText(content)
    }

    const handleAddCategory = async (name: string, color: string) => {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, color, user_id: user.id }])
            .select()
            .single()

        if (data) {
            setCategories([...categories, data])
        }
    }

    const handleUpdateCategory = async (id: string, categoryId: string | null) => {
        const { error } = await supabase
            .from('snippets')
            .update({ category_id: categoryId })
            .eq('id', id)

        if (!error) {
            setSnippets(snippets.map(s => s.id === id ? { ...s, category_id: categoryId } : s))
        }
    }

    const filteredSnippets = snippets.filter(snippet => {
        // Filter by active filter
        if (activeFilter === 'favorites' && !snippet.is_favorite) return false
        if (activeFilter !== 'all' && activeFilter !== 'favorites' && snippet.category_id !== activeFilter) return false

        // Filter by search query
        if (searchQuery && !snippet.content.toLowerCase().includes(searchQuery.toLowerCase())) return false

        return true
    })

    return (
        <div className="flex h-screen">
            <AppSidebar
                categories={categories}
                user={user}
                onLogout={handleLogout}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                onAddCategory={handleAddCategory}
            />

            <div className="flex-1 flex flex-col">
                <div className="border-b p-4 bg-background">
                    <div className="max-w-4xl mx-auto flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search snippets..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <AddSnippetDialog categories={categories} onAdd={handleAddSnippet} />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="max-w-4xl mx-auto p-4 space-y-0">
                        {filteredSnippets.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No snippets found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {searchQuery ? 'Try a different search' : 'Add your first snippet to get started'}
                                </p>
                            </div>
                        ) : (
                            filteredSnippets.map((snippet) => (
                                <SnippetCard
                                    key={snippet.id}
                                    snippet={snippet}
                                    category={categories.find(c => c.id === snippet.category_id)}
                                    allCategories={categories}
                                    onToggleFavorite={handleToggleFavorite}
                                    onDelete={handleDelete}
                                    onCopy={handleCopy}
                                    onUpdateCategory={handleUpdateCategory}
                                />
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
