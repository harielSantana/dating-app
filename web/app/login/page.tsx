"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple authentication logic - in a real app, use a proper auth system
    if (username === "admin" && password === "hari123") {
      router.push("/admin")
    } else if (username === "hay" && password === "hay123") {
      router.push("/dates")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">Digite suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600">
                Sign In
              </Button>
            </div>
          </form>
        </CardContent>
        {/* <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Admin: admin/admin</p>
            <p>Partner: partner/partner</p>
          </div>
        </CardFooter> */}
      </Card>
    </div>
  )
}

