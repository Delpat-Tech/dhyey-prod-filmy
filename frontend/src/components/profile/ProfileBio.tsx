'use client'

import { MapPin, Calendar, Link as LinkIcon } from 'lucide-react'

interface ProfileBioProps {
  bio: string
  location: string
  joinDate: string
  website: string
  isMobile?: boolean
}

export default function ProfileBio({ 
  bio, 
  location, 
  joinDate, 
  website, 
  isMobile = false 
}: ProfileBioProps) {
  return (
    <div className="space-y-2">
      <p className="text-gray-900 whitespace-pre-line">{bio}</p>
      <div className={`flex flex-wrap items-center ${isMobile ? 'gap-4' : 'gap-6'} text-sm text-gray-600`}>
        <div className="flex items-center space-x-1">
          <MapPin size={14} />
          <span>{location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar size={14} />
          <span>Joined {joinDate}</span>
        </div>
        <div className="flex items-center space-x-1">
          <LinkIcon size={14} />
          <a href={`https://${website}`} className="text-purple-600 hover:underline">
            {website}
          </a>
        </div>
      </div>
    </div>
  )
}
