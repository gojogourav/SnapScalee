import { auth } from '@clerk/nextjs/server';
import { Prisma, PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';


const prisma = new PrismaClient();


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})

interface CloudinaryResult {
    public_id: string;
    bytes: number;
    duration?: number;

}

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })


    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string | null;
        const orginalSize = formData.get("size") as string;



        if (!file) return NextResponse.json({ error: "File not found" }, { status: 400 })

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryResult>(
            (resolve, reject) => {
                const upload_stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        transformation: [
                            { quality: "auto", fetch_format: "mp4" }
                        ],
                        folder: "media-utils-video-upload"
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryResult)
                    }
                )
                upload_stream.end(buffer);
            }
        )

        const video = await prisma.video.create({
            data: {
                title,
                description,     // this is optional
                publicId: result.public_id,
                orignalSize: orginalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0
            }
        })
        return NextResponse.json(video);
    } catch (error) {
        console.log(`error in uploading image ${error}`);
        return NextResponse.json({ error: "Error uploading video" }, { status: 400 })
    }
}