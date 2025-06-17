"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Target, LucideIcon } from "lucide-react"

interface Stats {
  totalQuestions: number
  answeredQuestions: number
  correctAnswers: number
  accuracy: number
  streak: number
  subjects: Record<string, { total: number; correct: number; accuracy: number }>
}

interface StatCardProps {
  icon: LucideIcon
  value: number | string
  label: string
  iconColor: string
}

function StatCard({ icon: Icon, value, label, iconColor }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon className={`h-8 w-8 ${iconColor} mx-auto mb-2`} />
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </CardContent>
    </Card>
  )
}

interface SubjectProgressProps {
  subject: string
  data: { total: number; correct: number; accuracy: number }
}

function SubjectProgress({ subject, data }: SubjectProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{subject}</span>
          <Badge variant="outline">
            {data.correct}/{data.total} acertos
          </Badge>
        </div>
        <span className="text-sm text-gray-600">{data.accuracy}%</span>
      </div>
      <Progress value={data.accuracy} className="h-2" />
    </div>
  )
}

interface ProgressDashboardProps {
  stats: Stats
}

export function ProgressDashboard({ stats }: ProgressDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={BarChart3}
          value={stats.answeredQuestions}
          label="Questões Respondidas"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Target}
          value={`${stats.accuracy}%`}
          label="Taxa de Acerto"
          iconColor="text-green-600"
        />
        <StatCard
          icon={TrendingUp}
          value={stats.streak}
          label="Sequência Atual"
          iconColor="text-purple-600"
        />
        <StatCard
          icon={BarChart3}
          value={stats.correctAnswers}
          label="Acertos Totais"
          iconColor="text-orange-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Disciplina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.subjects).map(([subject, data]) => (
              <SubjectProgress
                key={subject}
                subject={subject}
                data={data}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
