# **Complete ImageKit.io Integration Guide with Next.js**

Here's a **detailed step-by-step explanation** of how to integrate ImageKit.io into your Next.js project, including folder structure, code implementation, and configuration:

---

## **📂 Project Structure (Final)**
```markdown
src/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts       # Image upload API
│   │   └── images/
│   │       └── route.ts       # Fetch images API
│   ├── lib/
│   │   ├── database.ts        # PostgreSQL connection
│   │   └── imagekit.ts        # ImageKit config
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
└── components/
    ├── UploadButton.tsx       # Upload UI
    └── Gallery.tsx            # Display images
```

---

## **🔑 Step 1: ImageKit.io Setup**
### **A. Get ImageKit Credentials**
1. Go to [ImageKit.io Dashboard](https://imagekit.io/dashboard)
2. Copy these from **Developer Options**:
   - **Public Key**  
   - **Private Key**  
   - **URL Endpoint** (e.g., `https://ik.imagekit.io/your_id`)

### **B. Configure `.env.local`**
```env
# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your_public_key"
IMAGEKIT_PRIVATE_KEY="your_private_key"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"

# Database (Neon.tech)
POSTGRES_URL="postgresql://user:pass@ep-xxxx.neon.tech/db?sslmode=require"
```

---

## **🛠 Step 2: ImageKit Configuration**
### **Create `src/lib/imagekit.ts**
```typescript
import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
});
```

---

## **📤 Step 3: Upload API (`route.ts`)**
### **File: `src/app/api/upload/route.ts`**
```typescript
import { NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";
import { query } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      useUniqueFileName: true, // Prevent duplicate names
    });

    // Save to PostgreSQL
    await query(
      "INSERT INTO images (image_url) VALUES ($1)",
      [uploadResponse.url]
    );

    return NextResponse.json({ success: true, url: uploadResponse.url });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
```

---

## **🖼 Step 4: Display Images**
### **A. Create Gallery Component (`Gallery.tsx`)**
```tsx
"use client";

import { useEffect, useState } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {images.map((img) => (
        <img
          key={img.id}
          src={img.image_url}
          alt={`Uploaded ${img.id}`}
          className="rounded-lg shadow-md"
        />
      ))}
    </div>
  );
}
```

### **B. Fetch Images API (`route.ts`)**
```typescript
import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function GET() {
  const result = await query(
    "SELECT * FROM images ORDER BY created_at DESC LIMIT 7"
  );
  return NextResponse.json(result.rows);
}
```

---

## **🚀 Step 5: Run the Project**
```bash
npm run dev
```
- Access: [http://localhost:3000](http://localhost:3000)
- **Test Upload**: Use the upload button to send images to ImageKit

---

## **🔍 How ImageKit Works**
1. **Frontend** → User selects image  
2. **Next.js API Route** → Receives file, uploads to ImageKit  
3. **ImageKit** → Stores image, returns URL  
4. **PostgreSQL** → Saves URL in database  
5. **Gallery** → Fetches and displays images  

---

## **📌 Key Notes**
1. **Security**: Private key stays server-side only (`IMAGEKIT_PRIVATE_KEY`)  
2. **Optimization**: ImageKit provides automatic image resizing via URL params  
   Example: `https://ik.imagekit.io/your_id/image.jpg?tr=w-500,h-500`  
3. **Storage**: All images are stored in your ImageKit media library  

This setup ensures **secure uploads**, **efficient storage**, and **fast delivery** via ImageKit's CDN. 🚀