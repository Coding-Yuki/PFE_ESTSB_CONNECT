"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/auth-context"

interface ProfileCardProps {
  user: User
  showFollowButton?: boolean
}

export function ProfileCard({ user, showFollowButton = true }: ProfileCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${user.id}`}>
            <Avatar className="w-12 h-12 cursor-pointer ring-2 ring-background hover:ring-primary/30 transition-all">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${user.id}`} className="hover:underline">
              <h3 className="font-semibold text-sm truncate">{user.name}</h3>
            </Link>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">
                {user.role === "student" ? "Étudiant" : "Enseignant"}
              </span>
              <span className="text-xs text-muted-foreground font-medium">{user.followers} abonnés</span>
            </div>
            {user.bio && <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{user.bio}</p>}
          </div>
          {showFollowButton && (
            <Button variant="default" size="sm" className="shrink-0 h-8 px-4 text-xs">
              Suivre
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
