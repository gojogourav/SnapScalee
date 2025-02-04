import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary'
import { Video } from '@prisma/client'
import { FiDownload, FiPlay } from 'react-icons/fi'
import { formatDuration, formatDate } from '@/lib/utils'

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasInteraction, setHasInteraction] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      quality: "auto",
      format: "jpg",
      assetType: "video"
    });
  }, []);

  const videoUrl = getCldVideoUrl({
    src: video.publicId,
    format: 'mp4',
    quality: 'auto'
  });
  

  useEffect(()=>{
    const video = videoRef.current;
    if(!video) return;
    const handleHover = async()=>{
      try{
        await video.play();
      }catch(error){
        console.log("autoplay prevented",error);
        
      }
    }
    if (isHovered && hasInteraction) {
      handleHover();
    } else {
      video.pause();
      video.currentTime = 0;
    }

  }


,[isHovered,hasInteraction])

const handleDownload = () => {
  if (!videoRef.current) return
  
  const link = document.createElement('a')
  link.href = videoRef.current.src
  link.download = `social-media-${Date.now()}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


  return (
    <div
      className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-200 hover:scale-102"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video"
       onMouseEnter={() => {
        setHasInteraction(true);
        setIsHovered(true);
      }}
       onMouseLeave={() => setIsHovered(false)}
       onTouchStart={() => setHasInteraction(true)}
      >
        {isHovered ? (
           <video
           ref={videoRef}
           src={videoUrl}
           muted
           preload="metadata"
           playsInline
           className="w-full h-full object-cover transition-opacity duration-100"
           style={{ opacity: hasInteraction ? 1 : 0.95 }}
         />
        ) : (
          <img
            
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={() => setPreviewError(true)}
            
          />
        )}
        

        
        <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-sm rounded-md">
          {formatDuration(video.duration)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-medium truncate mb-1">{video.title}</h3>
        <p className="text-sm text-gray-400 truncate mb-2">
          {video.description || 'No description  '}
          {Math.floor(Number(video.compressedSize)/(1024*1024))}Mb
        </p>
        
        <div className="flex justify-between items-center text-sm text-gray-400">
          {/* <span>{formatDate(Number(video.createdAt))}</span> */}
          <button
            onClick={() => handleDownload()}
            className="flex items-center gap-1 hover:text-white transition-colors"
            title="Download video"
          >
            <FiDownload className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default VideoCard;