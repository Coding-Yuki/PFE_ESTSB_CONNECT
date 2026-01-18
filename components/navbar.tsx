"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GraduationCap, Home, Search, User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navItems = [
    { href: "/feed", label: "Accueil", icon: Home },
    { href: "/search", label: "Rechercher", icon: Search },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur-sm">
      <div className="container flex h-16 max-w-5xl items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/feed" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EST Connect
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 hover:bg-secondary/80 transition-colors",
                      isActive && "bg-secondary font-medium",
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                    <span className={cn(isActive && "text-foreground")}>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <span className="text-xs text-muted-foreground mt-1.5 px-2 py-0.5 bg-secondary rounded-full w-fit">
                      {user?.role === "student" ? "Étudiant" : "Enseignant"}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user?.id}`} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <nav className="md:hidden border-t bg-card">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full gap-2 justify-center hover:bg-secondary/80", isActive && "bg-secondary")}
                >
                  <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                  <span className={cn("text-xs", isActive && "font-medium")}>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
