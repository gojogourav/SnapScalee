import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from 'cloudinary';
import { error } from "console";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_KEY,
    api_key: process.env.CLOUDINARY_API_SECRET,
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUplaodResult {
    public_id: string;
}

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes);
        // TODO:understand this code
        const result = await new Promise<CloudinaryUplaodResult>((resolve, reject) => {
                const upload_stream = cloudinary.uploader.upload_stream(
                    { 
                        resource_type: "image",
                        folder: "media-utils-image-uploads" 
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUplaodResult)
                    }
                )
                upload_stream.end(buffer)

            }
            
        )

    } catch (error) {
        console.log("error in uploading image ", error);
        return NextResponse.json({ error: "Upload image failed" }, { status: 500 })
    }
}