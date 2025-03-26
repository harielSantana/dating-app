"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Types
interface DateOption {
  id: string
  name: string
  description: string
}

interface DateSelection {
  id: string
  dateId: string
  dateName: string
  week: string
  selectedAt: string
}

export default function AdminPage() {
  const { toast } = useToast()
  const [dateOptions, setDateOptions] = useState<DateOption[]>(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dateOptions")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [dateSelections, setDateSelections] = useState<DateSelection[]>(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dateSelections")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [newDate, setNewDate] = useState({
    name: "",
    description: "",
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("dateOptions", JSON.stringify(dateOptions))
  }, [dateOptions])

  useEffect(() => {
    localStorage.setItem("dateSelections", JSON.stringify(dateSelections))
  }, [dateSelections])

  const handleAddDate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newDate.name.trim()) {
      toast({
        title: "Error",
        description: "Date name is required",
        variant: "destructive",
      })
      return
    }

    const dateOption: DateOption = {
      id: Date.now().toString(),
      name: newDate.name,
      description: newDate.description,
    }

    setDateOptions([...dateOptions, dateOption])
    setNewDate({ name: "", description: "" })

    toast({
      title: "Success",
      description: "Date option added successfully",
    })
  }

  const handleDeleteDate = (id: string) => {
    setDateOptions(dateOptions.filter((date) => date.id !== id))

    toast({
      title: "Success",
      description: "Date option deleted successfully",
    })
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-rose-600 dark:text-rose-400">Dashboard de Encontros com a gatinha! </h1>
        <Button asChild variant="outline">
          <Link href="/login">Logout</Link>
        </Button>
      </div>

      <Tabs defaultValue="dates">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="dates">Admininstrar Opções</TabsTrigger>
          <TabsTrigger value="history">Visualizar Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="dates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Adicionar nova opção de date</CardTitle>
                <CardDescription>Criar nova opção de encontro para sua parceira sortear</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddDate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Date Name</Label>
                    <Input
                      id="name"
                      placeholder="Dinner at favorite restaurant"
                      value={newDate.name}
                      onChange={(e) => setNewDate({ ...newDate, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Details about the date"
                      value={newDate.description}
                      onChange={(e) => setNewDate({ ...newDate, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600">
                    Add Date Option
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Current Date Options</CardTitle>
                <CardDescription>Manage your existing date options</CardDescription>
              </CardHeader>
              <CardContent>
                {dateOptions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No date options added yet. Add your first date option!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dateOptions.map((date) => (
                        <TableRow key={date.id}>
                          <TableCell className="font-medium">{date.name}</TableCell>
                          <TableCell>{date.description || "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteDate(date.id)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Date Selection History</CardTitle>
              <CardDescription>View all dates selected by your partner</CardDescription>
            </CardHeader>
            <CardContent>
              {dateSelections.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No dates have been selected yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Name</TableHead>
                      <TableHead>Week</TableHead>
                      <TableHead>Selected On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dateSelections.map((selection) => (
                      <TableRow key={selection.id}>
                        <TableCell className="font-medium">{selection.dateName}</TableCell>
                        <TableCell>{selection.week}</TableCell>
                        <TableCell>{new Date(selection.selectedAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

