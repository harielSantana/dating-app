"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Types
interface DateOption {
  id: string;
  name: string;
  description: string;
}

interface DateSelection {
  id: string;
  dateId: string;
  dateName: string;
  week: string;
  selectedAt: string;
}

interface ChartData {
  name: string;
  count: number;
}

export default function DatesPage() {
  const { toast } = useToast();
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [dateSelections, setDateSelections] = useState<DateSelection[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Load data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOptions = localStorage.getItem("dateOptions");
      const savedSelections = localStorage.getItem("dateSelections");

      if (savedOptions) {
        setDateOptions(JSON.parse(savedOptions));
      }

      if (savedSelections) {
        setDateSelections(JSON.parse(savedSelections));
      }
    }
  }, []);

  // Prepare chart data
  useEffect(() => {
    const dateCounts: Record<string, number> = {};

    dateSelections.forEach((selection) => {
      if (dateCounts[selection.dateName]) {
        dateCounts[selection.dateName]++;
      } else {
        dateCounts[selection.dateName] = 1;
      }
    });

    const data = Object.keys(dateCounts).map((name) => ({
      name,
      count: dateCounts[name],
    }));

    setChartData(data);
  }, [dateSelections]);

  const getWeekNumber = () => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(
      ((now.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
    );
    return `Week ${weekNum}, ${now.getFullYear()}`;
  };

  const handleRandomSelect = () => {
    if (dateOptions.length === 0) {
      toast({
        title: "Error",
        description: "No date options available",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);

    // Simulate spinning animation
    let counter = 0;
    const totalSpins = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * dateOptions.length);
      setSelectedDate(dateOptions[randomIndex]);

      counter++;
      if (counter >= totalSpins) {
        clearInterval(interval);
        setIsSpinning(false);

        // Save the final selection
        const finalSelection =
          dateOptions[Math.floor(Math.random() * dateOptions.length)];
        setSelectedDate(finalSelection);

        const newSelection: DateSelection = {
          id: Date.now().toString(),
          dateId: finalSelection.id,
          dateName: finalSelection.name,
          week: getWeekNumber(),
          selectedAt: new Date().toISOString(),
        };

        const updatedSelections = [...dateSelections, newSelection];
        setDateSelections(updatedSelections);

        // Save to localStorage
        localStorage.setItem(
          "dateSelections",
          JSON.stringify(updatedSelections)
        );

        toast({
          title: "Date Selected!",
          description: `You'll be going on: ${finalSelection.name}`,
        });
      }
    }, 100);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-rose-600 dark:text-rose-400">
          Vamos sortear um encontro!
        </h1>
        <Button asChild variant="outline">
          <Link href="/login">Sair</Link>
        </Button>
      </div>

      <Tabs defaultValue="select">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="select">Selecione a data</TabsTrigger>
          <TabsTrigger value="history">Ver Historico</TabsTrigger>
        </TabsList>

        <TabsContent value="select">
          <div className="grid grid-cols-1 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Sorteador de Encontros</CardTitle>
                <CardDescription>
                  Clique aqui para sortear um encontro que temos dentro da base
                  de dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div
                  className={`transition-all duration-300 p-8 rounded-lg bg-rose-50 dark:bg-gray-800 ${
                    isSpinning ? "animate-pulse" : ""
                  }`}
                >
                  {selectedDate ? (
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        {selectedDate.name}
                      </h3>
                      {selectedDate.description && (
                        <p className="text-gray-600 dark:text-gray-300">
                          {selectedDate.description}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                      Clique no botao para selecionar a data
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleRandomSelect}
                  disabled={isSpinning || dateOptions.length === 0}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-6 text-xl"
                  size="lg"
                >
                  {isSpinning ? "Selecting..." : "Select Random Date"}
                </Button>
              </CardContent>
              <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                  {dateOptions.length === 0
                    ? "No date options available. Ask your partner to add some!"
                    : `${dateOptions.length} date options available`}
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Seu Histórico de Encontros</CardTitle>
                <CardDescription>
                  Veja todos os seus encontros selecionados anteriormente
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dateSelections.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Você ainda não selecionou nenhum encontro.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome do Encontro</TableHead>
                        <TableHead>Semana</TableHead>
                        <TableHead>Selecionado Em</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dateSelections.map((selection) => (
                        <TableRow key={selection.id}>
                          <TableCell className="font-medium">
                            {selection.dateName}
                          </TableCell>
                          <TableCell>{selection.week}</TableCell>
                          <TableCell>
                            {new Date(
                              selection.selectedAt
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {dateSelections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Seleção de Datas</CardTitle>
                  <CardDescription>
                    Visualização das suas seleções de datas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 60,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="count"
                          name="Times Selected"
                          fill="#f43f5e"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
