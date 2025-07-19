import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold">アクセス権限がありません</CardTitle>
          <CardDescription>
            このページにアクセスする権限がありません。
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            必要な権限を持っていないか、ログインが必要です。
          </p>
          <div className="space-y-2">
            <Link href="/dashboard">
              <Button className="w-full">
                ダッシュボードに戻る
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                ログインページ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
