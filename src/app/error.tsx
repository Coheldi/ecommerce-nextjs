'use client'

import Error from "@/components/ui/error"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Error
      title="Algo salió mal"
      message={error.message || "Ha ocurrido un error inesperado"}
      onRetry={reset}
    />
  )
}
