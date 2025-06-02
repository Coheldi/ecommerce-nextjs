import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { email, password, nombre } = json

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear nuevo usuario
    const user = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        rol: 'cliente', // Por defecto, todos los nuevos usuarios son clientes
      }
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Usuario registrado exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('Error in registration:', error)
    return NextResponse.json(
      { error: 'Error en el registro' },
      { status: 500 }
    )
  }
}
