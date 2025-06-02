export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
        <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0"></div>
      </div>
      <span className="sr-only">Cargando...</span>
    </div>
  )
}
