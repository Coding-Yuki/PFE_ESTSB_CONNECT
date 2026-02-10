"use client"

import React, { useEffect, useState } from "react"

interface CommentItem {
  id: string
  post_id: string
  user_id: string | null
  username: string | null
  avatar?: string | null
  content: string
  created_at: string
}

export function CommentSection({ postId }: { postId: string | number }) {
  const [comments, setComments] = useState<CommentItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/est-connect/api"

  useEffect(() => {
    let mounted = true
    const fetchComments = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/comments/get.php?post_id=${encodeURIComponent(String(postId))}`, {
          credentials: "include",
        })
        const data = await res.json()
        if (!mounted) return
        if (data.success) {
          setComments(data.comments || [])
        } else {
          setComments([])
        }
      } catch (err) {
        console.error("Failed to fetch comments", err)
        if (mounted) setComments([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchComments()
    return () => {
      mounted = false
    }
  }, [postId])

  if (loading) {
    return <div className="py-4 text-sm text-muted-foreground">Chargement des commentaires...</div>
  }

  if (!comments || comments.length === 0) {
    return <div className="py-4 text-sm text-muted-foreground">Pas encore de commentaires.</div>
  }

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c.id} className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {c.avatar ? (
              <img src={c.avatar} alt={c.username || "avatar"} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-secondary/40 flex items-center justify-center text-sm font-semibold text-primary">
                {c.username ? c.username.split(" ").map(n => n[0]).join("").toUpperCase() : "?"}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{c.username || "Utilisateur"}</p>
              <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</p>
            </div>
            <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">{c.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentSection
