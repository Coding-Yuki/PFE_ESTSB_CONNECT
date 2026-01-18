"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileCard } from "@/components/profile-card"
import { SearchIcon, Users, Filter, Loader2 } from "lucide-react"
import { useData } from "@/lib/data-context"
import type { UserRole } from "@/lib/auth-context"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all")
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { searchUsers } = useData()

  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true)
      try {
        if (searchQuery.trim()) {
          const results = await searchUsers(searchQuery, roleFilter === "all" ? undefined : roleFilter)
          setFilteredUsers(results)
        } else {
          setFilteredUsers([])
        }
      } catch (error) {
        console.error("[v0] Search failed:", error)
        setFilteredUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, roleFilter, searchUsers])

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SearchIcon className="w-6 h-6 text-primary" />
          Rechercher
        </h1>
        <p className="text-sm text-muted-foreground">Trouvez des étudiants et enseignants de l'EST</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 border-0 bg-secondary/50 focus-visible:ring-1"
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Tabs value={roleFilter} onValueChange={(value) => setRoleFilter(value as "all" | UserRole)} className="flex-1">
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="all" className="text-sm">
              Tous
            </TabsTrigger>
            <TabsTrigger value="student" className="text-sm">
              Étudiants
            </TabsTrigger>
            <TabsTrigger value="teacher" className="text-sm">
              Enseignants
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="text-muted-foreground">Recherche en cours...</p>
            </CardContent>
          </Card>
        ) : filteredUsers.length > 0 ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                {filteredUsers.length} résultat{filteredUsers.length > 1 ? "s" : ""} trouvé
                {filteredUsers.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <ProfileCard key={user.id} user={user} />
              ))}
            </div>
          </>
        ) : searchQuery.trim() ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-16 text-center">
              <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Aucun résultat</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Essayez avec d'autres mots-clés pour trouver des membres de la communauté
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-16 text-center">
              <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Commencez votre recherche</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Tapez un nom ou un email pour trouver des étudiants et enseignants
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
