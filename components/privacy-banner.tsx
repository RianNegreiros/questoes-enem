'use client'

import { useEffect, useState } from 'react'
import { Cookie, Database, Shield, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const STORAGE_KEY = 'privacy-banner-acknowledged'

interface StorageSectionProps {
  icon: React.ReactNode
  title: string
  description: string
  iconColor: string
}

function StorageSection({ icon, title, description, iconColor }: StorageSectionProps) {
  return (
    <div className="flex gap-3 p-3 rounded-lg border bg-muted/50">
      <div className={`h-5 w-5 ${iconColor} mt-0.5 flex-shrink-0`}>{icon}</div>
      <div className="space-y-1">
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Badge variant="outline" className="text-xs">
          Essencial
        </Badge>
      </div>
    </div>
  )
}

export default function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const hasAcknowledged = localStorage.getItem(STORAGE_KEY)
    if (!hasAcknowledged) {
      setIsVisible(true)
    }
  }, [])

  const acknowledgeBanner = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  const storageSections = [
    {
      icon: <Database className="h-5 w-5" />,
      title: 'Armazenamento Local',
      description:
        'Salva suas respostas da prova localmente quando você não está logado, evitando perda de dados se você fechar o navegador acidentalmente.',
      iconColor: 'text-green-600',
    },
    {
      icon: <Cookie className="h-5 w-5" />,
      title: 'Cookies de Autenticação',
      description:
        'A biblioteca Better Auth cria cookies de sessão seguros para manter você logado e proteger sua conta.',
      iconColor: 'text-orange-600',
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Aviso de Privacidade e Armazenamento de Dados</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Obrigatório
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={acknowledgeBanner} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Este site utiliza tecnologias essenciais para fornecer funcionalidades de prova e autenticação de usuário.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {storageSections.map((section, index) => (
              <StorageSection key={index} {...section} />
            ))}
          </div>

          {isExpanded && (
            <>
              <Separator />
              <div className="space-y-3 text-xs text-muted-foreground">
                <div>
                  <h5 className="font-medium text-foreground mb-1">Por que são necessários:</h5>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>
                      <strong>Armazenamento Local:</strong> Preserva seu progresso e respostas da prova quando não
                      autenticado, garantindo que você não perca trabalho durante sessões longas de prova.
                    </li>
                    <li>
                      <strong>Cookies de Sessão:</strong> Mantém autenticação segura do usuário, protege contra acesso
                      não autorizado e permite experiências personalizadas de prova.
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-1">Tratamento de dados:</h5>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>
                      Os dados do armazenamento local permanecem em seu dispositivo e nunca são transmitidos para nossos
                      servidores
                    </li>
                    <li>Os cookies de autenticação são criptografados e seguem as melhores práticas de segurança</li>
                    <li>Nenhum dado pessoal é armazenado no armazenamento local, apenas respostas da prova</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-4 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-xs">
              {isExpanded ? 'Mostrar Menos' : 'Saiba Mais'}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={acknowledgeBanner} className="text-xs bg-transparent">
                Fechar
              </Button>
              <Button size="sm" onClick={acknowledgeBanner} className="text-xs">
                Entendi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
