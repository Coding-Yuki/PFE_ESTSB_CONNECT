"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PostCard } from "@/components/post-card"
import { UserPlus, UserCheck, Settings, Loader2 } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getUserById, getPostsByUserId, followUser, unfollowUser, isFollowing } = useData()
  const { user: currentUser } = useAuth()
  const router = useRouter()
  const [profileUser, setProfileUser] = useState<any>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [isFollowingUser, setIsFollowingUser] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      try {
        const user = await getUserById(id)
        const posts = await getPostsByUserId(id)
        setProfileUser(user)
        setUserPosts(posts)

        if (user && currentUser) {
          const following = await isFollowing(currentUser.id, id)
          setIsFollowingUser(following)
        }
      } catch (error) {
        console.error("[v0] Failed to load profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [id, currentUser, getUserById, getPostsByUserId, isFollowing])

  const handleFollowToggle = async () => {
    if (!currentUser) return

    setIsFollowLoading(true)
    try {
      if (isFollowingUser) {
        await unfollowUser(currentUser.id, id)
      } else {
        await followUser(currentUser.id, id)
      }
      setIsFollowingUser(!isFollowingUser)
    } catch (error) {
      console.error("[v0] Failed to toggle follow:", error)
    } finally {
      setIsFollowLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-6 px-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p className="text-muted-foreground">Chargement du profil...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="container max-w-2xl mx-auto py-6 px-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Utilisateur non trouvé</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === id

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="mx-auto md:mx-0">
              <div className="p-1 bg-gradient-to-br from-primary to-accent rounded-full">
                <Avatar className="w-32 h-32 ring-4 ring-background">
                  <AvatarImage src={profileUser.avatar || "/placeholder.svg"} alt={profileUser.name} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                    {profileUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="flex-1 space-y-5 text-center md:text-left w-full">
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <h1 className="text-2xl font-bold">{profileUser.name}</h1>
                  {isOwnProfile ? (
                    <Button variant="outline" size="sm" className="gap-2 w-full md:w-auto bg-transparent">
                      <Settings className="w-4 h-4" />
                      Modifier le profil
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFollowToggle}
                      variant={isFollowingUser ? "outline" : "default"}
                      size="sm"
                      className="gap-2 w-full md:w-auto"
                      disabled={isFollowLoading}
                    >
                      {isFollowLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isFollowingUser ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Abonné
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Suivre
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{profileUser.email}</p>
                <span className="inline-block text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">
                  {profileUser.role === "student" ? "Étudiant" : "Enseignant"}
                </span>
              </div>

              <div className="flex gap-8 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold">{userPosts.length}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Publications</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{profileUser.followers}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Abonnés</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{profileUser.following}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Abonnements</p>
                </div>
              </div>

              {profileUser.bio && (
                <>
                  <Separator />
                  <p className="text-sm leading-relaxed">{profileUser.bio}</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Publications</h2>
          <span className="text-sm text-muted-foreground">
            {userPosts.length} post{userPosts.length > 1 ? "s" : ""}
          </span>
        </div>
        {userPosts.length > 0 ? (
          <div className="space-y-5">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={currentUser?.id} />
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground text-sm">Aucune publication pour le moment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
