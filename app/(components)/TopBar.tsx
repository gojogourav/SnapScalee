import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'

function TopBar() {
  return (
    <div>

        <div className='mt-5 text-white font-bold bg-black items-center content-center justify-around w-full flex text-center
            font-mono text-lg
        '>
            <Link href='/dashboard' className='cursor-pointer' >
                TopBar
            </Link>
            <div className='lg:flex text-lg md:flex justify-between space-x-8 hidden lg:block '>
                
                <Link href='/social-share' className='cursor-pointer'>
    
                Photo Edit
                </Link>
                <Link href='/video-share' className='cursor-pointer'>
    
                Video Seed
                </Link>
            </div>
    
        </div>
            <Separator className='mt-5 bg-gray-700'/>
    </div>
  )
}

export default TopBar