"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Send, MoreHorizontal, Loader2 } from "lucide-react"
import type { Post } from "@/lib/data-context"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface PostCardProps {
  post: Post
  currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentContent, setCommentContent] = useState("")
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const [isLoadingComment, setIsLoadingComment] = useState(false)
  const { likePost, unlikePost, addComment } = useData()
  const { user } = useAuth()

  const isLiked = currentUserId ? post.likedBy.includes(currentUserId) : false

  const handleLike = async () => {
    if (currentUserId) {
      setIsLoadingLike(true)
      try {
        if (isLiked) {
          await unlikePost(post.id, currentUserId)
        } else {
          await likePost(post.id, currentUserId)
        }
      } catch (error) {
        console.error("[v0] Failed to toggle like:", error)
      } finally {
        setIsLoadingLike(false)
      }
    }
  }

  const handleComment = async () => {
    if (commentContent.trim() && user) {
      setIsLoadingComment(true)
      try {
        await addComment(post.id, commentContent, user)
        setCommentContent("")
      } catch (error) {
        console.error("[v0] Failed to add comment:", error)
      } finally {
        setIsLoadingComment(false)
      }
    }
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <Link
            href={`/profile/${post.author.id}`}
            className="flex items-center gap-3 hover:opacity-75 transition-opacity"
          >
            <Avatar className="w-10 h-10 ring-2 ring-background">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold text-sm leading-none">{post.author.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-muted-foreground">
                  {post.author.role === "student" ? "Étudiant" : "Enseignant"}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: fr })}
                </span>
              </div>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-0">
        {post.image && (
          <div className="w-full overflow-hidden bg-muted">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>
        )}
        <div className="px-4 py-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-3 pt-0 flex-col items-stretch gap-2">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-9 px-3 gap-2 hover:bg-transparent group", isLiked && "text-red-500 hover:text-red-600")}
            onClick={handleLike}
            disabled={isLoadingLike}
          >
            {isLoadingLike ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart className={cn("w-5 h-5 transition-all group-hover:scale-110", isLiked && "fill-current")} />
            )}
            <span className="font-medium text-sm">{post.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 gap-2 hover:bg-transparent group"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-5 h-5 transition-all group-hover:scale-110" />
            <span className="font-medium text-sm">{post.comments.length}</span>
          </Button>
        </div>

        {showComments && (
          <div className="space-y-3 pt-3 border-t">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5">
                  <Link href={`/profile/${comment.author.id}`}>
                    <Avatar className="w-8 h-8 ring-2 ring-background hover:ring-primary/20 transition-all">
                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {comment.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="bg-secondary/50 rounded-2xl px-3.5 py-2">
                      <Link href={`/profile/${comment.author.id}`} className="font-semibold text-sm hover:underline">
                        {comment.author.name}
                      </Link>
                      <p className="text-sm mt-0.5 leading-relaxed">{comment.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-3.5 mt-1 inline-block">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center pt-1">
              <Avatar className="w-8 h-8 ring-2 ring-background">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Input
                placeholder="Ajouter un commentaire..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoadingComment && handleComment()}
                disabled={isLoadingComment}
                className="flex-1 h-9 border-0 bg-secondary/50 focus-visible:ring-1 disabled:opacity-50"
              />
              <Button
                size="icon"
                onClick={handleComment}
                disabled={!commentContent.trim() || isLoadingComment}
                className="h-9 w-9 shrink-0"
              >
                {isLoadingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
