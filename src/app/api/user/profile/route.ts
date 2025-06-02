import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        direcciones: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Excluir la contraseña de la respuesta
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Error al obtener el perfil' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const json = await request.json()
    const { nombre, currentPassword, newPassword } = json

    const user = await prisma.usuario.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Si se está intentando cambiar la contraseña
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Debe proporcionar la contraseña actual' },
          { status: 400 }
        )
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password)

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Contraseña actual incorrecta' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      const updatedUser = await prisma.usuario.update({
        where: { id: userId },
        data: {
          nombre,
          password: hashedPassword
        },
        include: {
          direcciones: true
        }
      })

      const { password, ...userWithoutPassword } = updatedUser
      return NextResponse.json(userWithoutPassword)
    }

    // Si solo se está actualizando el nombre
    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: { nombre },
      include: {
        direcciones: true
      }
    })

    const { password, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword)

  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el perfil' },
      { status: 500 }
    )
  }
}
