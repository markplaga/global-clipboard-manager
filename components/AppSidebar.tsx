'use client'

import { Category } from '@/types'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ClipboardList, Star, Hash, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { AddCategoryDialog } from '@/components/AddCategoryDialog'

interface AppSidebarProps {
    categories: Category[]
    user: any
    onLogout: () => void
    activeFilter: string
    setActiveFilter: (filter: string) => void
    onAddCategory: (name: string, color: string) => void
}

export function AppSidebar({ categories, user, onLogout, activeFilter, setActiveFilter, onAddCategory }: AppSidebarProps) {
    return (
        <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64">
            <div className="p-4 flex items-center gap-2 font-semibold">
                <ClipboardList className="h-6 w-6 text-primary" />
                <span>Global Clipboard</span>
            </div>

            <ScrollArea className="flex-1 px-2">
                <div className="space-y-1 py-2">
                    <Button
                        variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveFilter('all')}
                    >
                        <ClipboardList className={cn(
                            "mr-2 h-4 w-4",
                            activeFilter === 'all' && "fill-blue-400 text-blue-400"
                        )} />
                        All Snippets
                    </Button>
                    <Button
                        variant={activeFilter === 'favorites' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveFilter('favorites')}
                    >
                        <Star className={cn(
                            "mr-2 h-4 w-4",
                            activeFilter === 'favorites' && "fill-yellow-500 text-yellow-500"
                        )} />
                        Favorites
                    </Button>
                </div>

                <Separator className="my-2" />

                <div className="py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
                        Categories
                    </h2>
                    <div className="space-y-1">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={activeFilter === category.id ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => setActiveFilter(category.id)}
                            >
                                <div
                                    className={cn(
                                        "mr-2 h-4 w-4 rounded-full shrink-0 transition-opacity",
                                        activeFilter !== category.id && "opacity-50"
                                    )}
                                    style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                            </Button>
                        ))}
                        <AddCategoryDialog onAdd={onAddCategory} />
                    </div>
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium truncate w-32">{user.user_metadata?.full_name || user.email}</span>
                        <span className="text-xs text-muted-foreground truncate w-32">{user.email}</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
