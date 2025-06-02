import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface ErrorProps {
  title?: string
  message?: string
  showHome?: boolean
  showRetry?: boolean
  onRetry?: () => void
}

export default function Error({
  title = "Ha ocurrido un error",
  message = "Lo sentimos, algo salió mal. Por favor, inténtalo de nuevo más tarde.",
  showHome = true,
  showRetry = true,
  onRetry
}: ErrorProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-6 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showRetry && onRetry && (
            <Button onClick={onRetry} variant="outline">
              Reintentar
            </Button>
          )}
          {showHome && (
            <Link href="/">
              <Button>Volver al Inicio</Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  )
}
