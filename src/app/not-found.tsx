import Error from "@/components/ui/error"

export default function NotFound() {
  return (
    <Error
      title="Página no encontrada"
      message="Lo sentimos, la página que buscas no existe."
      showRetry={false}
    />
  )
}
