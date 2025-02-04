"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import axios from 'axios'
import VideoCard from '@/components/ui/VideoCard';
import { Video } from '@prisma/client';
import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary';

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [video, setVideo] = useState<Video | null>(null)
  const router = useRouter();

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert("File size too large");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    formData.append("size", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData)
      if (response.status != 200) {
        throw new Error("Error uploading video in video-share page.tsx")
      }
      setVideo(response.data)
    } catch (error) {
      console.log('Error in video uploading');
      console.log(error);

    } finally {
      setIsUploading(false);
    }
  }
  // const handleDownload = () => {
  //   if (!video?.publicId || !video?.title) return;

  //   // Generate Cloudinary video URL
  //   const downloadUrl = getCldVideoUrl({
  //     src: video.publicId,
  //     format: 'auto',
  //     quality: 'auto'
  //   });

  //   // Create temporary link for download
  //   const link = document.createElement('a');
  //   link.href = downloadUrl;
  //   link.download = `${video.title}.mp4`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };


  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* {error && (
        <div className="p-4 bg-red-800 text-red-100 rounded-lg">
          Error uploading Video
        </div>
      )} */}

        <div>
          <label className="block mb-2 font-medium">
            Video File (MP4, AVI, MOV)
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-400">
                  <label className="relative cursor-pointer bg-gray-900 rounded-md font-medium text-indigo-400 hover:text-indigo-300">
                    <span>Choose a file</span>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/avi"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="sr-only"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">
                  MP4, AVI, or MOV (max {MAX_FILE_SIZE}MB)
                </p>
                {file && (
                  <p className="text-sm text-gray-200 mt-2">
                    Selected: {file.name} ({Math.round(file.size / 1024 / 1024)}MB)
                  </p>
                )}
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Title *
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 block w-full p-3 bg-gray-800 border border-gray-700 rounded-md"
              placeholder="Enter video title"
              required
            />
          </label>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 block w-full p-3 bg-gray-800 border border-gray-700 rounded-md h-32"
              placeholder="Add a description (optional)"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
      {video && (
        <div className="mt-8">
          <VideoCard
            video={{
              id: video.id,
              title: video.title || "Untitled",
              description: video.description || "",
              publicId: video.publicId,
              orignalSize: video.orignalSize || String(file?.size || "0"),
              compressedSize: video.compressedSize || "0",
              duration: Number(video.duration || 0),
              createdAt: new Date(video.createdAt),
              updatedAt: new Date(video.updatedAt || video.createdAt),
            }}

          />
        </div>
      )}
    </div>
  )
}

export default VideoUpload;