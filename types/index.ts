export type Profile = {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
}

export type Category = {
    id: string
    name: string
    color: string
}

export type Snippet = {
    id: string
    content: string
    category_id: string | null
    is_favorite: boolean
    created_at: string
}
