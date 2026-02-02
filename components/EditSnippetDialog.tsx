'use client'

import { Category, Snippet } from '@/types'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, Hash } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface EditSnippetDialogProps {
    snippet: Snippet
    categories: Category[]
    onUpdate: (id: string, content: string, categoryId: string | null) => void
}

export function EditSnippetDialog({ snippet, categories, onUpdate }: EditSnippetDialogProps) {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState(snippet.content)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(snippet.category_id)

    useEffect(() => {
        if (open) {
            setContent(snippet.content)
            setSelectedCategory(snippet.category_id)
        }
    }, [open, snippet])

    const handleSubmit = () => {
        if (content.trim()) {
            onUpdate(snippet.id, content, selectedCategory)
            setOpen(false)
        }
    }

    const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="h-7 w-7">
                    <Edit className="h-3.5 w-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Edit Snippet</DialogTitle>
                    <DialogDescription>
                        Update your snippet content or change its category.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-content">Content</Label>
                        <Textarea
                            id="edit-content"
                            placeholder="Usage of your snippet..."
                            className="min-h-[120px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Category</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="justify-start">
                                    <Hash className="mr-2 h-4 w-4" />
                                    {selectedCategoryName || 'None'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[200px]">
                                <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                                    None
                                </DropdownMenuItem>
                                {categories.map((category) => (
                                    <DropdownMenuItem
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            {category.name}
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleSubmit} disabled={!content.trim()}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
