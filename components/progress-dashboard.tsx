"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Target } from "lucide-react"

interface Stats {
  totalQuestions: number
  answeredQuestions: number
  correctAnswers: number
  accuracy: number
  streak: number
  subjects: Record<string, { total: number; correct: number; accuracy: number }>
}

interface ProgressDashboardProps {
  stats: Stats
}

export function ProgressDashboard({ stats }: ProgressDashboardProps) {
  const completionRate = (stats.answeredQuestions / stats.totalQuestions) * 100

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Questões Respondidas</span>
              <span className="text-sm text-gray-600">
                {stats.answeredQuestions} de {stats.totalQuestions}
              </span>
            </div>
            <Progress value={completionRate} className="w-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(completionRate)}%</div>
              <div className="text-sm text-gray-600">Concluído</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
              <div className="text-sm text-gray-600">Precisão</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
              <div className="text-sm text-gray-600">Sequência</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.correctAnswers}</div>
              <div className="text-sm text-gray-600">Acertos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Desempenho por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.subjects).map(([subject, data]) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{subject}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={data.accuracy >= 70 ? "default" : "secondary"}>{data.accuracy}%</Badge>
                    <span className="text-sm text-gray-600">
                      {data.correct}/{data.total}
                    </span>
                  </div>
                </div>
                <Progress value={data.accuracy} className="w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recomendações de Estudo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.subjects)
              .filter(([_, data]) => data.accuracy < 70)
              .map(([subject, data]) => (
                <div key={subject} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="font-medium text-orange-800">Foque em {subject}</div>
                  <div className="text-sm text-orange-700">
                    Sua precisão em {subject} está em {data.accuracy}%. Pratique mais questões desta matéria para
                    melhorar.
                  </div>
                </div>
              ))}

            {Object.entries(stats.subjects).every(([_, data]) => data.accuracy >= 70) && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="font-medium text-green-800">Excelente desempenho!</div>
                <div className="text-sm text-green-700">
                  Você está indo muito bem em todas as matérias. Continue praticando!
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
