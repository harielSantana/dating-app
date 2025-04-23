import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-rose-600 dark:text-rose-400">Sorteador de Encontros</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Planeje seus momentos especiais juntos</p>
          
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full bg-rose-500 hover:bg-rose-600">
            <Link href="/login">Entrar</Link>
          </Button>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Um lugar especial para planejar seus encontros e criar memórias</p>
          </div>
        </div>
      </div>
    </div>
  )
}
