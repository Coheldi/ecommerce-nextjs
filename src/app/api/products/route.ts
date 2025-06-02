import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const familiaId = searchParams.get('familiaId')
    const categoriaId = searchParams.get('categoriaId')
    const tag = searchParams.get('tag')

    const where = {
      ...(familiaId && { familiaId }),
      ...(categoriaId && { categoriaId }),
      ...(tag && {
        tags: {
          some: {
            nombre: tag
          }
        }
      })
    }

    const productos = await prisma.producto.findMany({
      where,
      include: {
        familia: true,
        categoria: true,
        tags: true,
      },
    })

    return NextResponse.json(productos)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()

    const producto = await prisma.producto.create({
      data: {
        nombre: json.nombre,
        descripcion: json.descripcion,
        imagenes: json.imagenes,
        precio: json.precio,
        unidadMedida: json.unidadMedida,
        sku: json.sku,
        stock: json.stock,
        infoNutricional: json.infoNutricional,
        alergenos: json.alergenos,
        familiaId: json.familiaId,
        categoriaId: json.categoriaId,
        tags: {
          connect: json.tagIds.map((id: string) => ({ id }))
        }
      },
      include: {
        familia: true,
        categoria: true,
        tags: true,
      },
    })

    return NextResponse.json(producto)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
