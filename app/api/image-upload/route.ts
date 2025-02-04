import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})

interface CloudinaryResult {
    public_id: string;
}

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        if (!file) return NextResponse.json({ error: "File not found" }, { status: 400 })

        const bytes = await file.arrayBuffer()
        const buffer = await Buffer.from(bytes);

        const result = await new Promise<CloudinaryResult>(
            (resolve, reject) => {
                const upload_stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "media-utils-image-upload"
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryResult)
                    }
                )
                upload_stream.end(buffer);
            }
        )

        return NextResponse.json({ public_id: result.public_id }, { status: 200 })

    } catch (error) {
        console.log(`error in uploading image ${error}`);
        return NextResponse.json({ error: "Error uploading image" }, { status: 400 })
    }
}