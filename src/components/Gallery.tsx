'use client'

import { useEffect, useState } from 'react'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/images')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setImages(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchImages()
  }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gallery</h2>
      {images.length === 0 ? (
        <p>{loading ? 'Loading...' : 'No images uploaded yet.'}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <img 
              key={img.id}
              src={img.image_url}
              alt={`Upload ${img.id}`}
              className="rounded-lg shadow-md"
            />
          ))}
        </div>
      )}
    </div>
  )
}