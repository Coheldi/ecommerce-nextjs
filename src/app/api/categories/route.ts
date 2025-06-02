import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const familiaId = searchParams.get('familiaId')

    const where = familiaId ? { familiaId } : {}

    const categorias = await prisma.categoria.findMany({
      where,
      include: {
        familia: true,
        productos: {
          include: {
            tags: true
          }
        }
      }
    })

    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()

    const categoria = await prisma.categoria.create({
      data: {
        nombre: json.nombre,
        descripcion: json.descripcion,
        familiaId: json.familiaId,
      },
      include: {
        familia: true
      }
    })

    return NextResponse.json(categoria)
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Error al crear categoría' },
      { status: 500 }
    )
  }
}
