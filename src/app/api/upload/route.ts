import { NextResponse } from 'next/server'
import { imagekit } from '@/src/app/lib/imagekit'
import { query } from '@/src/app/lib/database'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      useUniqueFileName: true
    })

    // Save to database
    await query(
      'INSERT INTO images (image_url) VALUES ($1)',
      [uploadResponse.url]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'