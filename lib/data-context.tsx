"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./auth-context"

export interface Comment {
  id: string
  author: User
  content: string
  createdAt: Date
}

export interface Post {
  id: string
  author: User
  content: string
  image?: string
  likes: number
  likedBy: string[]
  comments: Comment[]
  createdAt: Date
}

interface DataContextType {
  posts: Post[]
  users: User[]
  addPost: (content: string, userId: string, image?: string) => Promise<void>
  likePost: (postId: string, userId: string) => Promise<void>
  unlikePost: (postId: string, userId: string) => Promise<void>
  addComment: (postId: string, content: string, author: User) => Promise<void>
  getUserById: (userId: string) => Promise<User | undefined>
  getPostsByUserId: (userId: string) => Promise<Post[]>
  followUser: (userId: string, targetUserId: string) => Promise<void>
  unfollowUser: (userId: string, targetUserId: string) => Promise<void>
  isFollowing: (userId: string, targetUserId: string) => Promise<boolean>
  refreshPosts: () => Promise<void>
  refreshUsers: () => Promise<void>
  searchUsers: (query: string, role?: string) => Promise<User[]>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const API_URL = "http://localhost/est-connect/api"

export function DataProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    refreshPosts()
    refreshUsers()
  }, [])

  const refreshPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts/get-all.php`)
      const data = await response.json()
      if (data.success) {
        const parsedPosts = data.posts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          comments: post.comments.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
          })),
        }))
        setPosts(parsedPosts)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch posts:", error)
    }
  }

  const refreshUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users/get-all.php`)
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch users:", error)
    }
  }

  const addPost = async (content: string, userId: string, image?: string) => {
    try {
      const response = await fetch(`${API_URL}/posts/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, content, image }),
      })

      const data = await response.json()
      if (data.success) {
        const newPost = {
          ...data.post,
          createdAt: new Date(data.post.createdAt),
        }
        setPosts([newPost, ...posts])
      }
    } catch (error) {
      console.error("[v0] Failed to create post:", error)
    }
  }

  const likePost = async (postId: string, userId: string) => {
    try {
      const response = await fetch(`${API_URL}/posts/like.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, user_id: userId }),
      })

      const data = await response.json()
      if (data.success) {
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, likes: data.likes, likedBy: [...post.likedBy, userId] } : post,
          ),
        )
      }
    } catch (error) {
      console.error("[v0] Failed to like post:", error)
    }
  }

  const unlikePost = async (postId: string, userId: string) => {
    try {
      const response = await fetch(`${API_URL}/posts/unlike.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, user_id: userId }),
      })

      const data = await response.json()
      if (data.success) {
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? { ...post, likes: data.likes, likedBy: post.likedBy.filter((id) => id !== userId) }
              : post,
          ),
        )
      }
    } catch (error) {
      console.error("[v0] Failed to unlike post:", error)
    }
  }

  const addComment = async (postId: string, content: string, author: User) => {
    try {
      const response = await fetch(`${API_URL}/comments/add.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, user_id: author.id, content }),
      })

      const data = await response.json()
      if (data.success) {
        const newComment = {
          ...data.comment,
          createdAt: new Date(data.comment.createdAt),
        }
        setPosts(
          posts.map((post) => (post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post)),
        )
      }
    } catch (error) {
      console.error("[v0] Failed to add comment:", error)
    }
  }

  const getUserById = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/users/get-profile.php?user_id=${userId}`)
      const data = await response.json()
      if (data.success) {
        return data.user
      }
    } catch (error) {
      console.error("[v0] Failed to get user:", error)
    }
    return undefined
  }

  const getPostsByUserId = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/users/get-posts.php?user_id=${userId}`)
      const data = await response.json()
      if (data.success) {
        return data.posts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          comments:
            post.comments?.map((c: any) => ({
              ...c,
              createdAt: new Date(c.createdAt),
            })) || [],
        }))
      }
    } catch (error) {
      console.error("[v0] Failed to get user posts:", error)
    }
    return []
  }

  const followUser = async (userId: string, targetUserId: string) => {
    try {
      const response = await fetch(`${API_URL}/users/follow.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ follower_id: userId, following_id: targetUserId }),
      })

      const data = await response.json()
      if (data.success) {
        await refreshUsers()
      }
    } catch (error) {
      console.error("[v0] Failed to follow user:", error)
    }
  }

  const unfollowUser = async (userId: string, targetUserId: string) => {
    try {
      const response = await fetch(`${API_URL}/users/unfollow.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ follower_id: userId, following_id: targetUserId }),
      })

      const data = await response.json()
      if (data.success) {
        await refreshUsers()
      }
    } catch (error) {
      console.error("[v0] Failed to unfollow user:", error)
    }
  }

  const isFollowing = async (userId: string, targetUserId: string) => {
    try {
      const user = await getUserById(userId)
      // Note: You may want to add a dedicated endpoint for this
      return user?.following > 0 || false
    } catch (error) {
      console.error("[v0] Failed to check follow status:", error)
      return false
    }
  }

  const searchUsers = async (query: string, role?: string) => {
    try {
      const url = `${API_URL}/users/search.php?query=${encodeURIComponent(query)}${role ? `&role=${role}` : ""}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        return data.users
      }
    } catch (error) {
      console.error("[v0] Failed to search users:", error)
    }
    return []
  }

  return (
    <DataContext.Provider
      value={{
        posts,
        users,
        addPost,
        likePost,
        unlikePost,
        addComment,
        getUserById,
        getPostsByUserId,
        followUser,
        unfollowUser,
        isFollowing,
        refreshPosts,
        refreshUsers,
        searchUsers,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
