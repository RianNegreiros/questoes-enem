'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  url: string
  title: string
}

export function ShareButton({ url, title }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        })
      } catch (error) {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url)
          toast.success('Link copiado para a área de transferência!')
        } else {
          toast.error('Não foi possível compartilhar o link')
        }
      }
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copiado para a área de transferência!')
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={handleShare}>
      <Share2 className="h-4 w-4" />
    </Button>
  )
}
