import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const familias = await prisma.familia.findMany({
      include: {
        categorias: {
          include: {
            productos: {
              include: {
                tags: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(familias)
  } catch (error) {
    console.error('Error fetching families:', error)
    return NextResponse.json(
      { error: 'Error al obtener familias' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()

    const familia = await prisma.familia.create({
      data: {
        nombre: json.nombre,
        descripcion: json.descripcion,
      },
      include: {
        categorias: true
      }
    })

    return NextResponse.json(familia)
  } catch (error) {
    console.error('Error creating family:', error)
    return NextResponse.json(
      { error: 'Error al crear familia' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    const { id, ...data } = json

    const familia = await prisma.familia.update({
      where: { id },
      data,
      include: {
        categorias: true
      }
    })

    return NextResponse.json(familia)
  } catch (error) {
    console.error('Error updating family:', error)
    return NextResponse.json(
      { error: 'Error al actualizar familia' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de familia no proporcionado' },
        { status: 400 }
      )
    }

    await prisma.familia.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting family:', error)
    return NextResponse.json(
      { error: 'Error al eliminar familia' },
      { status: 500 }
    )
  }
}
