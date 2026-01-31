'use client'

import { Category } from '@/types'
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
import { Plus, Hash } from 'lucide-react'
import { useState } from 'react'

interface AddSnippetDialogProps {
    categories: Category[]
    onAdd: (content: string, categoryId: string | null) => void
}

export function AddSnippetDialog({ categories, onAdd }: AddSnippetDialogProps) {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const handleSubmit = () => {
        if (content.trim()) {
            onAdd(content, selectedCategory)
            setContent('')
            setSelectedCategory(null)
            setOpen(false)
        }
    }

    const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Snippet
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add New Snippet</DialogTitle>
                    <DialogDescription>
                        Create a new clipboard snippet. Add it to a category to organize better.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Paste your snippet here..."
                            className="min-h-[120px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Category (optional)</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="justify-start">
                                    <Hash className="mr-2 h-4 w-4" />
                                    {selectedCategoryName || 'Select category...'}
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
                                        {category.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={!content.trim()}>
                        Add Snippet
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
