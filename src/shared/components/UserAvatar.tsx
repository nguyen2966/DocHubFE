import { useEffect, useState } from 'react'
import fallbackAvatar from '../../assets/avatar.png'

export interface UserAvatarProps {
  src?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

export function UserAvatar({
  src,
  name,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  const imageSrc = src && !failed ? src : fallbackAvatar

  return (
    <img
      src={imageSrc}
      alt={name ?? 'User avatar'}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={() => setFailed(true)}
      draggable={false}
    />
  )
}
