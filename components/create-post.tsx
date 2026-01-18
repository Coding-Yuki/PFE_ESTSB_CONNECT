"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Send, X, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"

export function CreatePost() {
  const [content, setContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { addPost } = useData()

  const handleSubmit = async () => {
    if (content.trim() && user) {
      setIsLoading(true)
      try {
        await addPost(content, user.id)
        setContent("")
        setIsExpanded(false)
      } catch (error) {
        console.error("[v0] Failed to create post:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-background shrink-0">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Quoi de neuf ?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              disabled={isLoading}
              className="min-h-[60px] resize-none border-0 bg-secondary/50 focus-visible:ring-1 placeholder:text-muted-foreground/70 disabled:opacity-50"
            />
            {isExpanded && (
              <div className="flex items-center justify-between pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-secondary/80 text-muted-foreground"
                  disabled={isLoading}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Ajouter une photo</span>
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false)
                      setContent("")
                    }}
                    disabled={isLoading}
                    className="gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </Button>
                  <Button onClick={handleSubmit} disabled={!content.trim() || isLoading} size="sm" className="gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isLoading ? "..." : "Publier"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
