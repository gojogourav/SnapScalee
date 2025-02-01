import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary, UploadStream } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_KEY, 
    api_key:process.env.CLOUDINARY_API_SECRET, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUplaodResult{
    public_id:string;
    bytes:number;
    duration?:number;
}   

export async function POST(request:NextRequest){
    try{
        const {userId} = await auth()
        if(!userId) return NextResponse.json({error:"user unauthorized"},{status:401})
        if(
            !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY||
            !process.env.CLOUDINARY_API_KEY||
            !process.env.CLOUDINAR_API_SECRET
        ) return NextResponse.json({error:"missing api keys"},{status:500})

        const formData = await request.formData();
        const file = formData.get("file") as File|null
        const title = formData.get("title") as string
        const description = formData.get("description") as string||null
        const orignalSize = formData.get("video_size") as string


        if(!file) return NextResponse.json({error:"File not found"},{status:400})

        const bytes = await file.arrayBuffer();
        const buffer = await Buffer.from(bytes);

        const result = await new Promise<CloudinaryUplaodResult>((resolve,reject)=>{
            const upload_stream = cloudinary.uploader.upload_stream(
                {
                    resource_type:"video",
                    folder:"media-utils-video-uploads",
                    transformation:[
                        {
                            quality:"auto",
                            fetch_format:"mp4"
                        }
                    ]
                },
                (error,result)=>{
                    if(error) reject(error);
                    else resolve(result as CloudinaryUplaodResult)
                }
            )
            upload_stream.end(buffer)
        })

    }catch(error){
        console.log("Error in uploading video ",error);
        return NextResponse.json({error:"Uploading video failed"})
    }
}

// (async function() {

//     // Configuration

    
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();