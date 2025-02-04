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

type SocialPlatform = keyof typeof socialMediaFormats;
type PlatformFormat<T extends SocialPlatform> = keyof typeof socialMediaFormats[T];

function SocialShare() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>("instagram")
    const [selectedFormat, setSelectedFormat] = useState<string>("profilePicture")
    const [isUploading, setIsUploading] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null);

    // Set initial format when platform changes
    useEffect(() => {
        const formats = Object.keys(socialMediaFormats[selectedPlatform])
        setSelectedFormat(formats[0])
    }, [selectedPlatform])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setIsUploading(true)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("/api/image-upload", {
                method: "POST",
                body: formData
            })

            if (!response.ok) throw new Error("Failed to upload image")
            const data = await response.json()
            setUploadedImage(data.public_id)
        } catch (error) {
            console.error(error)
            alert("Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDownload = () => {
        if (!imageRef.current) return
        
        const link = document.createElement('a')
        link.href = imageRef.current.src
        link.download = `social-media-${Date.now()}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const currentFormat = socialMediaFormats[selectedPlatform][selectedFormat as keyof typeof socialMediaFormats[typeof selectedPlatform]]

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            <h1 className="text-3xl font-bold mb-8">Social Media Image Editor</h1>

            <div className="mb-6">
                <label className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg">
                    Upload Image:
                    <input
                        type="file"
                        accept='image/png image/jpeg imageg/webp'
                        onChange={handleFileUpload}
                        className="ml-4 px-4 py-2 border rounded bg-white text-black"
                        disabled={isUploading}
                    />
                </label>
                {isUploading && <p className="text-blue-500">Uploading...</p>}
            </div>

            {uploadedImage && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium">
                                Platform:
                                <select
                                    value={selectedPlatform}
                                    onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform)}
                                    className="ml-2 p-2 border rounded bg-white text-black w-full"
                                >
                                    {Object.keys(socialMediaFormats).map((platform) => (
                                        <option key={platform} value={platform}>
                                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                Format:
                                <select
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                    className="ml-2 p-2 border rounded bg-white text-black w-full"
                                >
                                    {Object.keys(socialMediaFormats[selectedPlatform]).map((format) => (
                                        <option key={format} value={format}>
                                            {format.replace(/([A-Z])/g, ' $1').trim()}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="border p-4 rounded-lg">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Preview</h3>
                            <p className="text-sm text-gray-400">
                                {currentFormat.width}×{currentFormat.height}px ({currentFormat.aspectRatio})
                            </p>
                        </div>

                        <div className="relative" style={{ aspectRatio: currentFormat.aspectRatio }}>
                            <CldImage
                                ref={imageRef}
                                src={uploadedImage}
                                width={currentFormat.width}
                                height={currentFormat.height}
                                crop="fill"
                                gravity="auto"
                                alt="Social media preview"
                                className="rounded-lg border"
                            />
                        </div>

                        <button
                            onClick={handleDownload}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Download Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SocialShare;