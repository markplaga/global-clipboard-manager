'use client'

import { Snippet, Category } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Star, Trash2, Edit, Check, Hash } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { EditSnippetDialog } from '@/components/EditSnippetDialog'

interface SnippetCardProps {
    snippet: Snippet
    category?: Category
    allCategories: Category[]
    onToggleFavorite: (id: string, isFavorite: boolean) => void
    onDelete: (id: string) => void
    onCopy: (content: string) => void
    onUpdateCategory: (id: string, categoryId: string | null) => void
    onUpdateSnippet: (id: string, content: string, categoryId: string | null) => void
}

export function SnippetCard({
    snippet,
    category,
    allCategories,
    onToggleFavorite,
    onDelete,
    onCopy,
    onUpdateCategory,
    onUpdateSnippet
}: SnippetCardProps) {
    const [copied, setCopied] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const handleCopy = () => {
        onCopy(snippet.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleExpanded()
    }

    const renderContent = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g
        const parts = text.split(urlRegex)

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline z-10 relative"
                        onClick={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                )
            }
            return part
        })
    }

    return (
        <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="py-0.5 px-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                                            {category ? (
                                                <Badge variant="secondary" className="text-[10px] py-0 px-1 h-4 cursor-pointer">
                                                    {category.name}
                                                </Badge>
                                            ) : (
                                                <Hash className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer" />
                                            )}
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-[160px]">
                                        <DropdownMenuItem onClick={() => onUpdateCategory(snippet.id, null)}>
                                            None
                                        </DropdownMenuItem>
                                        {allCategories.map((cat) => (
                                            <DropdownMenuItem
                                                key={cat.id}
                                                onClick={() => onUpdateCategory(snippet.id, cat.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: cat.color }}
                                                    />
                                                    {cat.name}
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                {snippet.is_favorite && (
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                )}
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-none shrink-0" suppressHydrationWarning>
                                {new Date(snippet.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div
                            className={cn(
                                "text-sm whitespace-pre-wrap break-words cursor-pointer hover:opacity-80 transition-opacity leading-tight select-none touch-manipulation",
                                !isExpanded && "line-clamp-1"
                            )}
                            onClick={toggleExpanded}
                            onTouchEnd={handleTouchEnd}
                        >
                            {renderContent(snippet.content.trim())}
                        </div>
                    </div>

                    <div className="snippet-actions flex flex-row shrink-0 items-center gap-0.5">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={handleCopy}
                        >
                            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                        <EditSnippetDialog
                            snippet={snippet}
                            categories={allCategories}
                            onUpdate={onUpdateSnippet}
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => onToggleFavorite(snippet.id, !snippet.is_favorite)}
                        >
                            <Star className={cn("h-3.5 w-3.5", snippet.is_favorite && "fill-yellow-500 text-yellow-500")} />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive"
                            onClick={() => onDelete(snippet.id)}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
