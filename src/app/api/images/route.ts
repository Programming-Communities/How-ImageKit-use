import { NextResponse } from 'next/server'

import { query } from '@/src/app/lib/database'

export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM images ORDER BY created_at DESC LIMIT 7'
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'