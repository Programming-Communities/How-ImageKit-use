import UploadButton from '@/src/components/UploadButton'
import Gallery from '@/src/components/Gallery'

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Image Upload Gallery</h1>
      <div className="mb-8">
        <UploadButton />
      </div>
      <Gallery />
    </main>
  )
}