export type Blog = {
  id: number
  title: string
  category_id: number
  content: {
    author: string
    markdown: string
    tags: string[]
    summary: string
    cover_image: string
  }
  user_id: number
  created_at: string
  updated_at: string
}
