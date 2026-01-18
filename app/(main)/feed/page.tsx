"use client"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"

export default function FeedPage() {
  const { posts } = useData()
  const { user } = useAuth()

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4 space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-balance">Fil d'actualité</h1>
        <p className="text-sm text-muted-foreground">Découvrez les dernières publications de la communauté EST</p>
      </div>

      <CreatePost />

      <div className="space-y-5 pt-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={user?.id} />
        ))}
      </div>
    </div>
  )
}
