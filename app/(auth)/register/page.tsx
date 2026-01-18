"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { GraduationCap, User, BookOpen } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<UserRole>("student")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await register(email, password, name, role)
      if (success) {
        router.push("/feed")
      } else {
        setError("Erreur lors de l'inscription")
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-primary/5 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-9 h-9 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-base">Rejoignez la communauté EST Connect</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nom complet
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@est.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Au moins 6 caractères</p>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Vous êtes</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)} className="gap-3">
                <label
                  htmlFor="student"
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    role === "student"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <RadioGroupItem value="student" id="student" className="shrink-0" />
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        role === "student" ? "bg-primary/10" : "bg-secondary"
                      }`}
                    >
                      <User className={`w-5 h-5 ${role === "student" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Étudiant</p>
                      <p className="text-xs text-muted-foreground">Étudiant à l'EST</p>
                    </div>
                  </div>
                </label>
                <label
                  htmlFor="teacher"
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    role === "teacher"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <RadioGroupItem value="teacher" id="teacher" className="shrink-0" />
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        role === "teacher" ? "bg-primary/10" : "bg-secondary"
                      }`}
                    >
                      <BookOpen
                        className={`w-5 h-5 ${role === "teacher" ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Enseignant</p>
                      <p className="text-xs text-muted-foreground">Professeur à l'EST</p>
                    </div>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {"Déjà un compte ? "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
