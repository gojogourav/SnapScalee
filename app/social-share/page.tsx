"use client"
import React, { useEffect, useRef, useState } from 'react'
import { CldImage } from 'next-cloudinary'


const socialMediaFormats = {
    twitter: {
        profilePicture: {
            width: 400,
            height: 400,
            aspectRatio: "1:1",
            format: "JPEG, PNG",
        },
        headerImage: {
            width: 1500,
            height: 500,
            aspectRatio: "3:1",
            format: "JPEG, PNG",
        },
        tweetImage: {
            width: 1200,
            height: 675,
            aspectRatio: "16:9",
            format: "JPEG, PNG",
        },
    },
    instagram: {
        profilePicture: {
            width: 320,
            height: 320,
            aspectRatio: "1:1",
            format: "JPEG, PNG",
        },
        squarePost: {
            width: 1080,
            height: 1080,
            aspectRatio: "1:1",
            format: "JPEG, PNG",
        },
        portraitPost: {
            width: 1080,
            height: 1350,
            aspectRatio: "4:5",
            format: "JPEG, PNG",
        },
        landscapePost: {
            width: 1080,
            height: 566,
            aspectRatio: "1.91:1",
            format: "JPEG, PNG",
        },
        story: {
            width: 1080,
            height: 1920,
            aspectRatio: "9:16",
            format: "JPEG, PNG",
        },
        reels: {
            width: 1080,
            height: 1920,
            aspectRatio: "9:16",
            format: "MP4",
        },
    },
    facebook: {
        profilePicture: {
            width: 170,
            height: 170,
            aspectRatio: "1:1",
            format: "JPEG, PNG",
        },
        coverPhoto: {
            width: 820,
            height: 312,
            aspectRatio: "2.63:1",
            format: "JPEG, PNG",
        },
        sharedImage: {
            width: 1200,
            height: 630,
            aspectRatio: "1.91:1",
            format: "JPEG, PNG",
        },
        story: {
            width: 1080,
            height: 1920,
            aspectRatio: "9:16",
            format: "JPEG, PNG",
        },
    },
    linkedin: {
        profilePicture: {
            width: 400,
            height: 400,
            aspectRatio: "1:1",
            format: "JPEG, PNG",
        },
        coverPhoto: {
            width: 1584,
            height: 396,
            aspectRatio: "4:1",
            format: "JPEG, PNG",
        },
        sharedImage: {
            width: 1200,
            height: 627,
            aspectRatio: "1.91:1",
            format: "JPEG, PNG",
        },
        companyLogo: {
            width: 300,
            height: 300,
            aspectRatio: "1:1",
            format: "JPEG, PNG",
        },
    },
};

type SocialFormat = keyof typeof socialMediaFormats


function SocialShare() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<SocialFormat>('instagram')
    const [isUploading, setIsUploading] = useState(false);
    const [transforming, setIsTransforming] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null);


    useEffect(() => {
        if (uploadedImage) {
            setIsTransforming(true);

        }
    }, [selectedFormat, uploadedImage])

    // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (!file) return;
    //     setIsUploading(true);
    //     const formData = new FormData();
    //     formData.append("file", file);

    //     try {
    //         const response = await fetch("/api/image-upload", {
    //             method: "POST",
    //             body: formData
    //         })
    //         if (!response.ok) throw new Error("Failed to upload image");
    //         const data = await response.json();
    //         setUploadedImage(data.publicId)

    //     } catch (error) {
    //         console.log(error);
    //         alert("Failed to upload image")

    //     }
    // }
    const handleFileUpload = async (event:React.ChangeEvent<HTMLInputElement>)=>{
        const file = event.target.files?.[0]
        if(!file) return
        setIsUploading(true)
        const formData = new FormData();
        formData.append("file",file);

        try{
            const response = await fetch("/api/image-upload",{
                method:"POST",
                body:formData
            })
            if(!response.ok) throw new Error("Failed to upload image");
            const data = await response.json();

        }catch(error){

        }
    }

    const handleDownload = ()=>{
        if(!imageRef.current) return;
        fetch(imageRef.current.src).then((response)=>response.blob())
        .then((blob)=>{
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedFormat
                .replace(/\s+/g,"_")
                .toLowerCase()
            }.png`
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        })
    }
    return (
        <div className='h-screen w-full bg-black'>
            <div className=' flex items-center justify-center  h-screen text-white'>
                Social Share
            </div>
        </div>
    )
}

export default SocialShare