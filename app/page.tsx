"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Switch } from "../components/ui/switch"
import { Separator } from "../components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import {
  Bell,
  Building2,
  Calendar,
  CalendarIcon,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cog,
  Download,
  Edit,
  Home,
  LogOut,
  Menu,
  Moon,
  PieChart,
  Plus,
  Shield,
  Shuffle,
  SignalIcon as Notification,
  Sun,
  User,
  UserPlus,
  Users,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { cn } from "../lib/utils"
import { NotificationDisplay } from "../components/notification-display"
import { ShiftManagement } from "../components/shift-management" // Corrected import path to ShiftManagement

// ロール定義
type UserRole = "admin" | "manager" | "staff"

// ユーザー型定義
interface StaffMember {
  id: number
  name: string
  department: string
  role: UserRole
  avatar: string
  workload: number
  status: string
  employeeId: string
  email?: string
  birthDate?: string
  nameKana?: string
}

// 部署型定義
interface Department {
  id: number
  name: string
  workSystem: string
  memberCount: number // このフィールドは表示のみに使用し、編集フォームからは削除
}

// シフト型定義
interface Shift {
  id: number
  date: string // YYYY-MM-DD
  startTime: string // HH:MM
  endTime: string // HH:MM
  staffId: number
  staffName: string
  department: string
  shiftType: "日勤" | "夜勤" | "日直" | "当直"
}

// リクエスト型定義
interface Request {
  id: number
  type: "vacation" | "substitute" // 休暇申請 or 代替シフト
  staffName: string
  department: string // リクエストに部署情報を追加
  date: string
  status: "pending" | "approved" | "rejected"
  reason: string
}

// サンプルデータ
const departments: Department[] = [
  { id: 1, name: "内科", workSystem: "2交代", memberCount: 12 },
  { id: 2, name: "外科", workSystem: "3交代", memberCount: 8 },
  { id: 3, name: "小児科", workSystem: "2交代", memberCount: 6 },
  { id: 4, name: "産婦人科", workSystem: "3交代", memberCount: 10 },
]

const staff: StaffMember[] = [
  {
    id: 1,
    name: "田中 太郎",
    department: "内科",
    role: "staff" as UserRole,
    avatar: "/placeholder.svg?height=32&width=32",
    workload: 85,
    status: "active",
    employeeId: "EMP001",
    email: "tanaka@hospital.com",
    birthDate: "1985-04-15",
    nameKana: "タナカ タロウ",
  },
  {
    id: 2,
    name: "佐藤 花子",
    department: "外科",
    role: "manager" as UserRole,
    avatar: "/placeholder.svg?height=32&width=32",
    workload: 92,
    status: "active",
    employeeId: "EMP002",
    email: "sato@hospital.com",
    birthDate: "1982-08-22",
    nameKana: "サトウ ハナコ",
  },
  {
    id: 3,
    name: "鈴木 次郎",
    department: "小児科",
    role: "staff" as UserRole,
    avatar: "/placeholder.svg?height=32&width=32",
    workload: 78,
    status: "active",
    employeeId: "EMP003",
    email: "suzuki@hospital.com",
    birthDate: "1990-12-03",
    nameKana: "スズキ ジロウ",
  },
  {
    id: 4,
    name: "高橋 美咲",
    department: "産婦人科",
    role: "admin" as UserRole,
    avatar: "/placeholder.svg?height=32&width=32",
    workload: 88,
    status: "vacation",
    employeeId: "EMP004",
    email: "takahashi@hospital.com",
    birthDate: "1987-06-10",
    nameKana: "タカハシ ミサキ",
  },
]

const requests: Request[] = [
  {
    id: 1,
    type: "vacation",
    staffName: "田中 太郎",
    department: "内科", // 部署情報を追加
    date: "2024-01-20",
    status: "pending",
    reason: "家族旅行",
  },
  {
    id: 2,
    type: "substitute",
    staffName: "鈴木 次郎",
    department: "小児科", // 部署情報を追加
    date: "2024-01-22",
    status: "approved",
    reason: "体調不良",
  },
  {
    id: 3,
    type: "vacation",
    staffName: "高橋 美咲",
    department: "産婦人科", // 部署情報を追加
    date: "2024-02-10",
    status: "pending",
    reason: "私用",
  },
  {
    id: 4,
    type: "substitute",
    staffName: "佐藤 花子",
    department: "外科", // 部署情報を追加
    date: "2024-02-15",
    status: "pending",
    reason: "急な出張",
  },
  // 2023年の休暇申請サンプル
  {
    id: 5,
    type: "vacation",
    staffName: "田中 太郎",
    department: "内科",
    date: "2023-08-01",
    status: "approved",
    reason: "夏季休暇",
  },
  {
    id: 6,
    type: "vacation",
    staffName: "田中 太郎",
    department: "内科",
    date: "2023-08-02",
    status: "approved",
    reason: "夏季休暇",
  },
  {
    id: 7,
    type: "vacation",
    staffName: "佐藤 花子",
    department: "外科",
    date: "2023-09-10",
    status: "approved",
    reason: "私用",
  },
  // 2025年の休暇申請サンプル
  {
    id: 8,
    type: "vacation",
    staffName: "鈴木 次郎",
    department: "小児科",
    date: "2025-01-05",
    status: "pending",
    reason: "旅行",
  },
]

const sampleShifts: Shift[] = [
  {
    id: 1,
    date: "2024-07-20",
    startTime: "08:00",
    endTime: "17:00",
    staffId: 1,
    staffName: "田中 太郎",
    department: "内科",
    shiftType: "日勤",
  },
  {
    id: 2,
    date: "2024-07-20",
    startTime: "17:00",
    endTime: "08:00",
    staffId: 2,
    staffName: "佐藤 花子",
    department: "外科",
    shiftType: "夜勤",
  },
  {
    id: 3,
    date: "2024-07-21",
    startTime: "09:00",
    endTime: "18:00",
    staffId: 3,
    staffName: "鈴木 次郎",
    department: "小児科",
    shiftType: "日勤",
  },
  {
    id: 4,
    date: "2024-07-21",
    startTime: "08:00",
    endTime: "17:00",
    staffId: 1,
    staffName: "田中 太郎",
    department: "内科",
    shiftType: "日直",
  },
  {
    id: 5,
    date: "2024-07-22",
    startTime: "17:00",
    endTime: "08:00",
    staffId: 4,
    staffName: "高橋 美咲",
    department: "産婦人科",
    shiftType: "当直",
  },
  // 2023年のシフトサンプル
  {
    id: 6,
    date: "2023-01-10",
    startTime: "09:00",
    endTime: "18:00",
    staffId: 1,
    staffName: "田中 太郎",
    department: "内科",
    shiftType: "日勤",
  },
  {
    id: 7,
    date: "2023-01-11",
    startTime: "09:00",
    endTime: "18:00",
    staffId: 1,
    staffName: "田中 太郎",
    department: "内科",
    shiftType: "日勤",
  },
  {
    id: 8,
    date: "2023-01-10",
    startTime: "17:00",
    endTime: "08:00",
    staffId: 2,
    staffName: "佐藤 花子",
    department: "外科",
    shiftType: "夜勤",
  },
  // 2025年のシフトサンプル
  {
    id: 9,
    date: "2025-01-15",
    startTime: "08:00",
    endTime: "17:00",
    staffId: 3,
    staffName: "鈴木 次郎",
    department: "小児科",
    shiftType: "日勤",
  },
]

// SidebarPropsの定義をここに移動
interface SidebarProps {
  userRole: UserRole
  isCollapsed: boolean
  onToggle: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

// Sidebarコンポーネントをapp/page.tsxからcomponents/sidebar.tsxに移動
function Sidebar({ userRole, isCollapsed, onToggle, activeTab, onTabChange }: SidebarProps) {
  const getMenuItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { id: "dashboard", label: "ダッシュボード", icon: Home },
          { id: "users", label: "ユーザー管理", icon: Users },
          { id: "departments", label: "部署管理", icon: Building2 },
          { id: "shifts", label: "シフト管理", icon: CalendarIcon },
          { id: "requests", label: "リクエスト管理", icon: ClipboardList },
          { id: "settings", label: "システム設定", icon: Cog },
        ]
      case "manager":
        return [
          { id: "dashboard", label: "ダッシュボード", icon: Home },
          { id: "shifts", label: "シフト管理", icon: CalendarIcon },
          { id: "approval", label: "承認ワークフロー", icon: CheckSquare },
          { id: "reports", label: "レポート", icon: PieChart },
        ]
      case "staff":
        return [
          { id: "my-shifts", label: "自分のシフト", icon: CalendarIcon },
          { id: "requests", label: "休暇申請", icon: ClipboardList },
          { id: "profile", label: "プロフィール", icon: User },
          { id: "notifications", label: "通知設定", icon: Notification },
        ]
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button variant="ghost" size="sm" onClick={onToggle} className="w-full justify-start">
          <Menu className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">メニュー</span>}
        </Button>
      </div>

      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
                onClick={() => onTabChange(item.id)}
              >
                <IconComponent className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">{item.label}</span>}
              </Button>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          {!isCollapsed && (
            <>
              <div>OnCall Scheduler v2.1.0</div>
              <div className="mt-1">
                <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                  サポート
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// AdminDashboardPropsの定義をここに移動
type AdminDashboardProps = {}

// AdminDashboardコンポーネントをapp/page.tsxからcomponents/admin-dashboard.tsxに移動
function AdminDashboard({}: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">アクティブ部署</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>最近のアクティビティ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm">新規ユーザー登録</div>
                  <div className="text-xs text-gray-500">山田 太郎 - 内科</div>
                </div>
                <div className="text-xs text-gray-500">2分前</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm">シフト変更申請</div>
                  <div className="text-xs text-gray-500">外科 - 1月25日</div>
                </div>
                <div className="text-xs text-gray-500">15分前</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm">システムアラート</div>
                  <div className="text-xs text-gray-500">高負荷警告 - 小児科</div>
                </div>
                <div className="text-xs text-gray-500">1時間前</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm">新規部署作成</div>
                  <div className="text-xs text-gray-500">リハビリテーション科</div>
                </div>
                <div className="text-xs text-gray-500">3時間前</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm">承認完了</div>
                  <div className="text-xs text-gray-500">田中 太郎 - 休暇申請</div>
                </div>
                <div className="text-xs text-gray-500">5時間前</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ManagerDashboardPropsの定義をここに移動
type ManagerDashboardProps = {
  currentUserDepartment: string
  sampleShifts: Shift[]
}

// ManagerDashboardコンポーネントをapp/page.tsxからcomponents/manager-dashboard.tsxに移動
function ManagerDashboard({ currentUserDepartment, sampleShifts }: ManagerDashboardProps) {
  // 今週の日付を取得するヘルパー関数
  const getWeekDates = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 for Sunday, 1 for Monday, etc.
    const startOfWeek = new Date(today)
    // 月曜日を週の開始とする (日曜日が0の場合、-6で前週の月曜日に、それ以外は1で今週の月曜日に)
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))

    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()

  // マネージャーの部署に属するシフトのみをフィルタリング
  const shiftsForDepartment = sampleShifts.filter((shift) => shift.department === currentUserDepartment)

  // シフトを日付ごとにグループ化
  const shiftsByDate: { [key: string]: Shift[] } = {}
  shiftsForDepartment.forEach((shift) => {
    if (!shiftsByDate[shift.date]) {
      shiftsByDate[shift.date] = []
    }
    shiftsByDate[shift.date].push(shift)
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>承認待ちリクエスト</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests
              .filter((req) => req.status === "pending")
              .map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{request.staffName}</div>
                    <div className="text-sm text-gray-500">
                      {request.type === "vacation" ? "休暇申請" : "代替シフト"} - {request.date}
                    </div>
                    <div className="text-xs text-gray-400">{request.reason}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      承認
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                      却下
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>週間シフトカレンダー ({currentUserDepartment})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {weekDates.map((date, index) => {
              const dateString = date.toISOString().split("T")[0] // YYYY-MM-DD
              const dayName = new Intl.DateTimeFormat("ja-JP", { weekday: "short" }).format(date)
              const displayDate = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" }).format(date)
              const dailyShifts = shiftsByDate[dateString] || []

              return (
                <div key={index} className="border rounded-lg p-3 space-y-2 min-h-[120px] flex flex-col">
                  <div className="text-center font-medium text-sm">
                    {displayDate} ({dayName})
                  </div>
                  <Separator />
                  <div className="flex-1 overflow-y-auto">
                    {dailyShifts.length > 0 ? (
                      <ul className="space-y-1 text-sm">
                        {dailyShifts.map((shift, shiftIndex) => (
                          <li key={shiftIndex} className="flex items-center justify-between">
                            <span>{shift.staffName}</span>
                            <Badge variant="secondary">{shift.shiftType}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-2">シフトなし</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// StaffDashboardPropsの定義をここに移動
type StaffDashboardProps = {
  currentUser: StaffMember // currentUserをpropsとして受け取る
  sampleShifts: Shift[]
}

// StaffDashboardコンポーネントをapp/page.tsxからcomponents/staff-dashboard.tsxに移動
function StaffDashboard({ currentUser, sampleShifts }: StaffDashboardProps) {
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date()) // 表示する月の基準日

  const displayYear = currentDisplayDate.getFullYear()
  const displayMonth = currentDisplayDate.getMonth() // 0-indexed

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay() // 0 for Sunday, 1 for Monday

  // 月曜日を週の開始とする (日曜日が0の場合、-6で前週の月曜日に、それ以外は1で今週の月曜日に)
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const calendarDays = []
  for (let i = 0; i < startDayOffset; i++) {
    calendarDays.push(null) // 月の初めまでの空白セル
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // 現在のユーザーの表示月のシフトをフィルタリング
  const userShiftsThisMonth = sampleShifts.filter(
    (shift) =>
      shift.staffId === currentUser.id &&
      new Date(shift.date).getFullYear() === displayYear &&
      new Date(shift.date).getMonth() === displayMonth,
  )

  // シフトがある日付のセットを作成
  const shiftDates = new Set(userShiftsThisMonth.map((shift) => new Date(shift.date).getDate()))

  // 前の月に移動
  const handlePreviousMonth = () => {
    setCurrentDisplayDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  // 次の月に移動
  const handleNextMonth = () => {
    setCurrentDisplayDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 今月のシフトカレンダーを大きく表示するため、col-span-full を適用 */}
        <Card className="col-span-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                {displayYear}年 {displayMonth + 1}月
              </span>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center text-base">
              {" "}
              {/* gapとtext-baseを調整 */}
              {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
                <div key={day} className="font-medium text-gray-500 dark:text-gray-400 py-2">
                  {" "}
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-md aspect-square flex items-center justify-center", // paddingとaspect-squareを調整
                    day && shiftDates.has(day)
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold"
                      : "text-gray-700 dark:text-gray-300",
                    day === new Date().getDate() &&
                      displayMonth === new Date().getMonth() &&
                      displayYear === new Date().getFullYear()
                      ? "border-2 border-blue-500" // 今日の日付をハイライト
                      : "",
                    !day && "opacity-0 pointer-events-none", // 空のセルを非表示
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 申請ステータスカードは残す */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">申請ステータス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">1</div>
            <p className="text-xs text-muted-foreground">承認待ち</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>今週のスケジュール</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "1/22 (月)", shift: "日勤", time: "8:00-17:00", status: "confirmed" },
                { date: "1/23 (火)", shift: "休み", time: "-", status: "confirmed" },
                { date: "1/24 (水)", shift: "夜勤", time: "17:00-8:00", status: "confirmed" },
                { date: "1/25 (木)", shift: "休み", time: "-", status: "confirmed" },
                { date: "1/26 (金)", shift: "日勤", time: "8:00-17:00", status: "pending" },
              ].map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{schedule.date}</div>
                    <div className="text-sm text-gray-500">{schedule.time}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={schedule.shift === "休み" ? "secondary" : "default"}>{schedule.shift}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              休暇申請
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Shuffle className="h-4 w-4 mr-2" />
              シフト交換申請
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              シフト表ダウンロード
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// StaffRequestManagementPropsの定義をここに移動
interface StaffRequestManagementProps {
  currentUser: StaffMember
  requests: Request[]
}

// StaffRequestManagementコンポーネントをapp/page.tsxからcomponents/staff-request-management.tsxに移動
function StaffRequestManagement({ currentUser, requests }: StaffRequestManagementProps) {
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false)
  const [newRequestDate, setNewRequestDate] = useState("")
  const [newRequestReason, setNewRequestReason] = useState("")

  // Calculate deadline for next month's requests
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() // 0-indexed

  const deadlineDate = new Date(currentYear, currentMonth, 25) // 25th of the current month
  const nextMonth = new Date(today)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  const deadlineDisplayMonth = new Intl.DateTimeFormat("ja-JP", { month: "numeric" }).format(deadlineDate)
  const nextMonthDisplay = new Intl.DateTimeFormat("ja-JP", { month: "numeric" }).format(nextMonth)

  const handleNewRequestSubmit = () => {
    // TODO: Implement actual request submission logic
    console.log("New request submitted:", {
      staffName: currentUser.name,
      department: currentUser.department,
      date: newRequestDate,
      reason: newRequestReason,
      type: "vacation", // Assuming vacation for now
    })
    alert("休暇申請が送信されました！")
    setIsNewRequestDialogOpen(false)
    setNewRequestDate("")
    setNewRequestReason("")
  }

  const getStatusBadgeVariant = (status: Request["status"]) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Filter requests for the current user
  const currentUserRequests = requests.filter((req) => req.staffName === currentUser.name)

  return (
    <Card>
      <CardHeader>
        <CardTitle>休暇申請</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Deadline Display */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-700 dark:text-blue-300">
            <p>
              <span className="font-semibold">重要:</span> 来月（{nextMonthDisplay}月）の休暇申請締め切りは
              <span className="font-bold">{deadlineDisplayMonth}月25日</span>です。
            </p>
          </div>

          <Dialog open={isNewRequestDialogOpen} onOpenChange={setIsNewRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新規申請
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>新規休暇申請</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="request-date">休暇希望日 *</Label>
                  <Input
                    id="request-date"
                    type="date"
                    value={newRequestDate}
                    onChange={(e) => setNewRequestDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="request-reason">理由 *</Label>
                  <Input
                    id="request-reason"
                    placeholder="例: 私用、家族旅行"
                    value={newRequestReason}
                    onChange={(e) => setNewRequestReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsNewRequestDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleNewRequestSubmit} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  申請
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-3">
            {currentUserRequests.length > 0 ? (
              currentUserRequests.map((request) => (
                <div key={request.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{request.type === "vacation" ? "休暇申請" : "代替シフト申請"}</div>
                      <div className="text-sm text-gray-500">{request.date}</div>
                      <div className="text-xs text-gray-400">{request.reason}</div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {request.status === "pending"
                        ? "承認待ち"
                        : request.status === "approved"
                          ? "承認済み"
                          : "却下済み"}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">申請履歴がありません。</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// AdminRequestManagementPropsの定義をここに移動
interface AdminRequestManagementProps {
  requests: Request[]
  departments: Department[]
}

// AdminRequestManagementコンポーネントをapp/page.tsxからcomponents/admin-request-management.tsxに移動
function AdminRequestManagement({ requests, departments }: AdminRequestManagementProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>("all")

  const filteredRequests =
    selectedDepartment === "all" ? requests : requests.filter((req) => req.department === selectedDepartment)

  const getStatusBadgeVariant = (status: Request["status"]) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "approved":
        return "default" // Or a custom green variant
      case "rejected":
        return "destructive" // Or a custom red variant
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>リクエスト管理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Select onValueChange={setSelectedDepartment} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="部署を選択" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* 新規リクエスト作成ボタンは管理者画面では不要な場合が多いので、今回は追加しません */}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>スタッフ</TableHead>
                <TableHead>部署</TableHead>
                <TableHead>タイプ</TableHead>
                <TableHead>理由</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>{request.staffName}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.type === "vacation" ? "休暇申請" : "代替シフト"}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {request.status === "pending"
                        ? "承認待ち"
                        : request.status === "approved"
                          ? "承認済み"
                          : "却下済み"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {request.status === "pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          承認
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                          却下
                        </Button>
                      </>
                    )}
                    {request.status !== "pending" && (
                      <Button size="sm" variant="outline" disabled>
                        処理済み
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// SystemSettingsPropsの定義をここに移動
type SystemSettingsProps = {}

// SystemSettingsコンポーネントをapp/page.tsxからcomponents/system-settings.tsxに移動
function SystemSettings({}: SystemSettingsProps) {
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true)

  const handleSaveSettings = () => {
    // TODO: 設定を保存するロジックを実装
    console.log("Settings saved:", {
      enableEmailNotifications,
    })
    alert("設定が保存されました！")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>システム設定</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 通知設定 */}
          <h3 className="text-lg font-semibold">通知設定</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">メール通知を有効にする</Label>
            <Switch
              id="emailNotifications"
              checked={enableEmailNotifications}
              onCheckedChange={setEnableEmailNotifications}
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-blue-500 to-cyan-500">
              設定を保存
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ManagerReportsPropsの定義をここに移動
interface ManagerReportsProps {
  currentUserDepartment: string
  sampleShifts: Shift[]
  requests: Request[]
}

// ManagerReportsコンポーネントをapp/page.tsxからcomponents/manager-reports.tsxに移動
function ManagerReports({ currentUserDepartment, sampleShifts, requests }: ManagerReportsProps) {
  const currentYear = new Date().getFullYear()
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0") // 01-12

  const [selectedYearForMonthly, setSelectedYearForMonthly] = useState<string>(currentYear.toString())
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [selectedYearForAnnual, setSelectedYearForAnnual] = useState<string>(currentYear.toString())

  const years = Array.from({ length: 3 }, (_, i) => (currentYear - 1 + i).toString()) // Current year, previous, next
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")) // 01-12

  // 月間勤務日数を計算
  const calculateMonthlyWorkingDays = () => {
    const monthlyData: { [key: string]: Set<string> } = {} // staffName -> Set of unique dates

    sampleShifts
      .filter(
        (shift) =>
          shift.department === currentUserDepartment &&
          shift.date.startsWith(`${selectedYearForMonthly}-${selectedMonth}`),
      )
      .forEach((shift) => {
        if (!monthlyData[shift.staffName]) {
          monthlyData[shift.staffName] = new Set()
        }
        monthlyData[shift.staffName].add(shift.date)
      })

    return Object.entries(monthlyData).map(([staffName, dates]) => ({
      staffName,
      days: dates.size,
    }))
  }

  // 年間休日取得日数を計算
  const calculateAnnualLeaveDays = () => {
    const annualLeaveData: { [key: string]: number } = {} // staffName -> count of leave requests

    requests
      .filter(
        (req) =>
          req.department === currentUserDepartment &&
          req.type === "vacation" &&
          req.date.startsWith(selectedYearForAnnual),
      )
      .forEach((req) => {
        annualLeaveData[req.staffName] = (annualLeaveData[req.staffName] || 0) + 1
      })

    return Object.entries(annualLeaveData).map(([staffName, days]) => ({
      staffName,
      days,
    }))
  }

  const monthlyWorkingDays = calculateMonthlyWorkingDays()
  const annualLeaveDays = calculateAnnualLeaveDays()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            月間勤務日数 ({selectedYearForMonthly}年{Number.parseInt(selectedMonth)}月)
          </CardTitle>
          <div className="flex gap-2">
            <Select value={selectedYearForMonthly} onValueChange={setSelectedYearForMonthly}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="年度" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="月" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {Number.parseInt(month)}月
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>スタッフ名</TableHead>
                <TableHead className="text-right">勤務日数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyWorkingDays.length > 0 ? (
                monthlyWorkingDays.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.staffName}</TableCell>
                    <TableCell className="text-right">{data.days}日</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    データがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">年間休日取得日数 ({selectedYearForAnnual}年)</CardTitle>
          {/* 年間休日取得日数のカード内に年度選択を配置 */}
          <Select value={selectedYearForAnnual} onValueChange={setSelectedYearForAnnual}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="年度を選択" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>スタッフ名</TableHead>
                <TableHead className="text-right">取得日数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {annualLeaveDays.length > 0 ? (
                annualLeaveDays.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.staffName}</TableCell>
                    <TableCell className="text-right">{data.days}日</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    データがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// StaffProfileEditDialogPropsの定義をここに移動
interface StaffProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUser: StaffMember
  onSave: (updatedUser: StaffMember) => void
}

// StaffProfileEditDialogコンポーネントをapp/page.tsxからcomponents/staff-profile-edit-dialog.tsxに移動
function StaffProfileEditDialog({ open, onOpenChange, currentUser, onSave }: StaffProfileEditDialogProps) {
  const [step, setStep] = useState<"email_entry" | "code_entry" | "profile_edit">(
    currentUser.email ? "email_entry" : "profile_edit", // メールアドレスがない場合は直接編集画面へ
  )
  const [emailForVerification, setEmailForVerification] = useState(currentUser.email || "")
  const [verificationCodeInput, setVerificationCodeInput] = useState("")
  const [sentCode, setSentCode] = useState("") // シミュレーション用の送信されたコード
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // プロフィール編集フォームのステート
  const [lastName, setLastName] = useState(currentUser.name.split(" ")[0] || "")
  const [firstName, setFirstName] = useState(currentUser.name.split(" ")[1] || "")
  const [lastNameKana, setLastNameKana] = useState(currentUser.nameKana?.split(" ")[0] || "")
  const [firstNameKana, setFirstNameKana] = useState(currentUser.nameKana?.split(" ")[1] || "")
  const [profileEmail, setProfileEmail] = useState(currentUser.email || "") // プロフィール編集フォームのメールアドレス
  const [birthDate, setBirthDate] = useState(currentUser.birthDate || "")

  // ダイアログが開かれたときに初期状態をリセット
  useState(() => {
    if (open) {
      setStep(currentUser.email ? "email_entry" : "profile_edit")
      setEmailForVerification(currentUser.email || "")
      setVerificationCodeInput("")
      setSentCode("")
      setIsSendingCode(false)
      setIsVerifyingCode(false)
      setErrorMessage(null)

      // プロフィール編集フォームのステートもリセット
      setLastName(currentUser.name.split(" ")[0] || "")
      setFirstName(currentUser.name.split(" ")[1] || "")
      setLastNameKana(currentUser.nameKana?.split(" ")[0] || "")
      setFirstNameKana(currentUser.nameKana?.split(" ")[1] || "")
      setProfileEmail(currentUser.email || "")
      setBirthDate(currentUser.birthDate || "")
    }
  }, [open, currentUser])

  const handleSendVerificationCode = () => {
    if (!emailForVerification) {
      setErrorMessage("メールアドレスを入力してください。")
      return
    }
    setErrorMessage(null)
    setIsSendingCode(true)

    // メール送信のシミュレーション
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString() // 6桁のランダムなコード
      setSentCode(code)
      console.log(`[DEBUG] Verification code for ${emailForVerification}: ${code}`) // 開発者向けにコンソールに表示
      setIsSendingCode(false)
      setStep("code_entry")
      setErrorMessage("認証コードをメールアドレスに送信しました。")
    }, 1500)
  }

  const handleVerifyCode = () => {
    if (!verificationCodeInput) {
      setErrorMessage("認証コードを入力してください。")
      return
    }
    setErrorMessage(null)
    setIsVerifyingCode(true)

    // コード認証のシミュレーション
    setTimeout(() => {
      if (verificationCodeInput === sentCode) {
        setIsVerifyingCode(false)
        setStep("profile_edit")
        setErrorMessage(null)
      } else {
        setIsVerifyingCode(false)
        setErrorMessage("無効な認証コードです。")
      }
    }, 1000)
  }

  const handleSaveProfile = () => {
    const updatedUser: StaffMember = {
      ...currentUser,
      name: `${lastName} ${firstName}`,
      nameKana: `${lastNameKana} ${firstNameKana}`,
      email: profileEmail,
      birthDate,
    }
    onSave(updatedUser)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>プロフィール編集</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {step === "email_entry" && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                プロフィールを編集するには、まずメールアドレスを認証してください。
              </p>
              <div className="grid gap-2">
                <Label htmlFor="email-for-verification">メールアドレス</Label>
                <Input
                  id="email-for-verification"
                  type="email"
                  value={emailForVerification}
                  onChange={(e) => setEmailForVerification(e.target.value)}
                  placeholder="メールアドレスを入力"
                  disabled={isSendingCode}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSendingCode}>
                  キャンセル
                </Button>
                <Button onClick={handleSendVerificationCode} disabled={isSendingCode}>
                  {isSendingCode ? "送信中..." : "認証コードを送信"}
                </Button>
              </div>
            </>
          )}

          {step === "code_entry" && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {emailForVerification}に送信された6桁の認証コードを入力してください。
              </p>
              <div className="grid gap-2">
                <Label htmlFor="verification-code">認証コード</Label>
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCodeInput}
                  onChange={(e) => setVerificationCodeInput(e.target.value)}
                  placeholder="認証コードを入力"
                  maxLength={6}
                  disabled={isVerifyingCode}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setStep("email_entry")} disabled={isVerifyingCode}>
                  メールアドレスを再入力
                </Button>
                <Button onClick={handleVerifyCode} disabled={isVerifyingCode}>
                  {isVerifyingCode ? "認証中..." : "コードを認証"}
                </Button>
              </div>
            </>
          )}

          {step === "profile_edit" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-lastName">姓 *</Label>
                  <Input id="edit-lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-firstName">名 *</Label>
                  <Input id="edit-firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-lastNameKana">セイ *</Label>
                  <Input
                    id="edit-lastNameKana"
                    value={lastNameKana}
                    onChange={(e) => setLastNameKana(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-firstNameKana">メイ *</Label>
                  <Input
                    id="edit-firstNameKana"
                    value={firstNameKana}
                    onChange={(e) => setFirstNameKana(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-birthDate">生年月日 *</Label>
                <Input
                  id="edit-birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-email">メールアドレス *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  更新
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// StaffNotificationsPropsの定義をここに移動
interface StaffNotificationsProps {
  currentUser: StaffMember
}

// StaffNotificationsコンポーネントをapp/page.tsxからcomponents/staff-notifications.tsxに移動
function StaffNotifications({ currentUser }: StaffNotificationsProps) {
  const [enableShiftNotifications, setEnableShiftNotifications] = useState(true)
  const [enableRequestStatusNotifications, setEnableRequestStatusNotifications] = useState(true)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleSaveSettings = () => {
    // TODO: 設定を保存するロジックを実装
    console.log("Notification settings saved for", currentUser.name, {
      enableShiftNotifications,
      enableRequestStatusNotifications,
    })
    setSaveMessage("設定が保存されました！")
    setTimeout(() => {
      setSaveMessage(null)
    }, 3000) // 3秒後にメッセージを非表示にする
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>通知設定</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {saveMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="status"
              aria-live="polite"
            >
              <span className="block sm:inline">{saveMessage}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="shift-notifications">シフト変更通知</Label>
            <Switch
              id="shift-notifications"
              checked={enableShiftNotifications}
              onCheckedChange={setEnableShiftNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="request-status-notifications">申請ステータス通知</Label>
            <Switch
              id="request-status-notifications"
              checked={enableRequestStatusNotifications}
              onCheckedChange={setEnableRequestStatusNotifications}
            />
          </div>
          <Button onClick={handleSaveSettings} className="w-full justify-start bg-transparent" variant="outline">
            設定を保存
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function RoleBasedShiftScheduler() {
  const [currentRole, setCurrentRole] = useState<UserRole>("admin")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<StaffMember | null>(null)
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [sortField, setSortField] = useState<"name" | "department" | "employeeId">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isStaffProfileEditOpen, setIsStaffProfileEditOpen] = useState(false) // スタッフプロフィール編集ダイアログの状態
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)

  const getCurrentUser = () => {
    return staff.find((s) => s.role === currentRole) || staff[0]
  }

  const handleSort = (field: "name" | "department" | "employeeId") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleEditUser = (user: StaffMember) => {
    setEditingUser(user)
    setIsEditUserOpen(true)
  }

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department)
    setIsEditDepartmentOpen(true)
  }

  const handleUpdateStaffProfile = (updatedUser: StaffMember) => {
    // In a real app, you'd send this to a backend API
    console.log("Updated staff profile:", updatedUser)
    // For simulation, find and update the user in the global staff array
    const staffIndex = staff.findIndex((s) => s.id === updatedUser.id)
    if (staffIndex !== -1) {
      staff[staffIndex] = updatedUser // Directly modifying global array for demo
      // To ensure re-render, you might need to update the state that holds the staff array
      // For this demo, direct modification is sufficient to show the concept.
    }
  }

  const sortedStaff = [...staff].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  const renderMainContent = () => {
    const currentUser = getCurrentUser() // renderMainContent内でcurrentUserを取得

    switch (currentRole) {
      case "admin":
        switch (activeTab) {
          case "dashboard":
            return <AdminDashboard />
          case "users":
            return (
              <Card>
                <CardHeader>
                  <CardTitle>ユーザー管理</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input placeholder="ユーザーを検索..." className="max-w-sm" />
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <UserPlus className="h-4 w-4 mr-2" />
                          新規ユーザー
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>新規ユーザー登録</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="lastName">姓 *</Label>
                              <Input id="lastName" placeholder="田中" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="firstName">名 *</Label>
                              <Input id="firstName" placeholder="太郎" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="lastNameKana">セイ *</Label>
                              <Input id="lastNameKana" placeholder="タナカ" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="firstNameKana">メイ *</Label>
                              <Input id="firstNameKana" placeholder="タロウ" />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="birthDate">生年月日 *</Label>
                            <Input id="birthDate" type="date" />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="department">所属部署 *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="部署を選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept.id} value={dept.name}>
                                    {dept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="employeeId">職員番号 *</Label>
                            <Input id="employeeId" placeholder="例: EMP001" />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="email">メールアドレス *</Label>
                            <Input id="email" type="email" placeholder="tanaka@hospital.com" />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="role">ロール *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="ロールを選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="staff">スタッフ</SelectItem>
                                <SelectItem value="manager">マネージャー</SelectItem>
                                <SelectItem value="admin">管理者</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div className="flex items-start gap-2">
                              <div className="w-4 h-4 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
                              <div className="text-sm text-blue-700 dark:text-blue-300">
                                <div className="font-medium mb-1">パスワードについて</div>
                                <div>初期パスワードは自動生成され、登録完了後にメールで送信されます。</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                            キャンセル
                          </Button>
                          <Button
                            onClick={() => {
                              // TODO: ユーザー登録処理
                              setIsAddUserOpen(false)
                            }}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500"
                          >
                            登録
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* テーブルヘッダー */}
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 dark:bg-gray-800 border-b font-medium text-sm">
                      <Button
                        variant="ghost"
                        className="justify-start p-0 h-auto font-medium hover:bg-transparent"
                        onClick={() => handleSort("name")}
                      >
                        氏名
                        {sortField === "name" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start p-0 h-auto font-medium hover:bg-transparent"
                        onClick={() => handleSort("department")}
                      >
                        部署
                        {sortField === "department" && (
                          <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start p-0 h-auto font-medium hover:bg-transparent"
                        onClick={() => handleSort("employeeId")}
                      >
                        職員番号
                        {sortField === "employeeId" && (
                          <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </Button>
                      <div>操作</div>
                    </div>

                    {/* ユーザーリスト */}
                    <div className="divide-y">
                      {sortedStaff.map((user) => (
                        <div
                          key={user.id}
                          className="grid grid-cols-4 gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-gray-600 dark:text-gray-400">{user.department}</div>
                          <div className="text-gray-600 dark:text-gray-400">{user.employeeId}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{user.role}</Badge>
                            <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                              <Edit className="h-3 w-3 mr-1" />
                              編集
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 編集ダイアログ */}
                  <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>ユーザー編集</DialogTitle>
                      </DialogHeader>
                      {editingUser && (
                        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-lastName">姓 *</Label>
                              <Input
                                id="edit-lastName"
                                defaultValue={editingUser.name.split(" ")[0]}
                                placeholder="田中"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-firstName">名 *</Label>
                              <Input
                                id="edit-firstName"
                                defaultValue={editingUser.name.split(" ")[1]}
                                placeholder="太郎"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-lastNameKana">セイ *</Label>
                              <Input
                                id="edit-lastNameKana"
                                defaultValue={editingUser.nameKana?.split(" ")[0]}
                                placeholder="タナカ"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-firstNameKana">メイ *</Label>
                              <Input
                                id="edit-firstNameKana"
                                defaultValue={editingUser.nameKana?.split(" ")[1]}
                                placeholder="タロウ"
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="edit-birthDate">生年月日 *</Label>
                            <Input id="edit-birthDate" type="date" defaultValue={editingUser.birthDate} />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="edit-department">所属部署 *</Label>
                            <Select defaultValue={editingUser.department}>
                              <SelectTrigger>
                                <SelectValue placeholder="部署を選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept.id} value={dept.name}>
                                    {dept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="edit-employeeId">職員番号 *</Label>
                            <Input
                              id="edit-employeeId"
                              defaultValue={editingUser.employeeId}
                              placeholder="例: EMP001"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="edit-email">メールアドレス *</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              defaultValue={editingUser.email}
                              placeholder="tanaka@hospital.com"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="edit-role">ロール *</Label>
                            <Select defaultValue={editingUser.role}>
                              <SelectTrigger>
                                <SelectValue placeholder="ロールを選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="staff">スタッフ</SelectItem>
                                <SelectItem value="manager">マネージャー</SelectItem>
                                <SelectItem value="admin">管理者</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                            <div className="flex items-start gap-2">
                              <div className="w-4 h-4 bg-yellow-500 rounded-full mt-0.5 flex-shrink-0"></div>
                              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                                <div className="font-medium mb-1">パスワードリセット</div>
                                <div>パスワードをリセットする場合は、新しいパスワードがメールで送信されます。</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between pt-4 border-t">
                        <Button
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent"
                        >
                          パスワードリセット
                        </Button>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                            キャンセル
                          </Button>
                          <Button
                            onClick={() => {
                              // TODO: ユーザー更新処理
                              setIsEditUserOpen(false)
                              setEditingUser(null)
                            }}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500"
                          >
                            更新
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )
          case "departments":
            return (
              <Card>
                <CardHeader>
                  <CardTitle>部署管理</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          新規部署作成
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>新規部署作成</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                          <div className="grid gap-2">
                            <Label htmlFor="new-dept-name">部署名 *</Label>
                            <Input id="new-dept-name" placeholder="例: リハビリテーション科" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="new-dept-work-system">勤務体系 *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="勤務体系を選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2交代">2交代</SelectItem>
                                <SelectItem value="3交代">3交代</SelectItem>
                                <SelectItem value="日直">日直</SelectItem>
                                <SelectItem value="当直">当直</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
                            キャンセル
                          </Button>
                          <Button
                            onClick={() => {
                              // TODO: 部署作成処理
                              setIsAddDepartmentOpen(false)
                            }}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500"
                          >
                            登録
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {departments.map((dept) => (
                        <Card key={dept.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{dept.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>勤務体系:</span>
                                <span>{dept.workSystem}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>メンバー数:</span>
                                <span>{dept.memberCount}名</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                                onClick={() => handleEditDepartment(dept)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                設定編集
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* 部署編集ダイアログ */}
                    <Dialog open={isEditDepartmentOpen} onOpenChange={setIsEditDepartmentOpen}>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>部署設定編集</DialogTitle>
                        </DialogHeader>
                        {editingDepartment && (
                          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-dept-name">部署名 *</Label>
                              <Input
                                id="edit-dept-name"
                                defaultValue={editingDepartment.name}
                                placeholder="例: リハビリテーション科"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-dept-work-system">勤務体系 *</Label>
                              <Select defaultValue={editingDepartment.workSystem}>
                                <SelectTrigger>
                                  <SelectValue placeholder="勤務体系を選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2交代">2交代</SelectItem>
                                  <SelectItem value="3交代">3交代</SelectItem>
                                  <SelectItem value="日直">日直</SelectItem>
                                  <SelectItem value="当直">当直</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setIsEditDepartmentOpen(false)}>
                            キャンセル
                          </Button>
                          <Button
                            onClick={() => {
                              // TODO: 部署更新処理
                              setIsEditDepartmentOpen(false)
                              setEditingDepartment(null)
                            }}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500"
                          >
                            更新
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )
          case "shifts":
            return (
              <ShiftManagement // Changed to ShiftManagement
                userRole={currentRole}
                sampleShifts={sampleShifts}
                departments={departments}
                staff={staff}
              />
            )
          case "requests": // 管理者向けのリクエスト管理を追加
            return <AdminRequestManagement requests={requests} departments={departments} />
          case "settings": // 管理者向けシステム設定を追加
            return <SystemSettings />
          default:
            return <AdminDashboard />
        }
      case "manager":
        switch (activeTab) {
          case "dashboard":
            return <ManagerDashboard currentUserDepartment={currentUser.department} sampleShifts={sampleShifts} />
          case "approval":
            return (
              <Card>
                <CardHeader>
                  <CardTitle>承認ワークフロー</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{request.staffName}</div>
                            <div className="text-sm text-gray-500">
                              {request.type === "vacation" ? "休暇申請" : "代替シフト申請"}
                            </div>
                            <div className="text-sm">日付: {request.date}</div>
                            <div className="text-sm">理由: {request.reason}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              承認
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                              却下
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          case "shifts":
            return (
              <ShiftManagement // Changed to ShiftManagement
                userRole={currentRole}
                sampleShifts={sampleShifts}
                departments={departments}
                staff={staff}
              />
            )
          case "reports": // マネージャー向けレポートを追加
            return (
              <ManagerReports
                currentUserDepartment={currentUser.department}
                sampleShifts={sampleShifts}
                requests={requests}
              />
            )
          default:
            return <ManagerDashboard currentUserDepartment={currentUser.department} sampleShifts={sampleShifts} />
        }
      case "staff":
        switch (activeTab) {
          case "my-shifts":
            return <StaffDashboard currentUser={currentUser} sampleShifts={sampleShifts} />
          case "requests":
            return <StaffRequestManagement currentUser={currentUser} requests={requests} />
          case "profile":
            return (
              <Card>
                <CardHeader>
                  <CardTitle>プロフィール</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{currentUser.name}</h3>
                        <p className="text-gray-500">{currentUser.department}</p>
                        <Badge variant="outline">{currentUser.role}</Badge>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid gap-2">
                      <Label>職員番号:</Label>
                      <p className="font-medium">{currentUser.employeeId}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>メールアドレス:</Label>
                      <p className="font-medium">{currentUser.email || "N/A"}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>生年月日:</Label>
                      <p className="font-medium">{currentUser.birthDate || "N/A"}</p>
                    </div>
                    <Dialog open={isStaffProfileEditOpen} onOpenChange={setIsStaffProfileEditOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          プロフィールを編集
                        </Button>
                      </DialogTrigger>
                      <StaffProfileEditDialog
                        open={isStaffProfileEditOpen}
                        onOpenChange={setIsStaffProfileEditOpen}
                        currentUser={currentUser}
                        onSave={handleUpdateStaffProfile}
                      />
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )
          case "notifications":
            return <StaffNotifications currentUser={currentUser} />
          default:
            return <StaffDashboard currentUser={currentUser} sampleShifts={sampleShifts} />
        }
      default:
        return <AdminDashboard />
    }
  }

  const currentUser = getCurrentUser()

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* ナビゲーションバー */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    OnCall Scheduler
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* ロール切替（開発用） */}
              <Select value={currentRole} onValueChange={(value: UserRole) => setCurrentRole(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">管理者</SelectItem>
                  <SelectItem value="manager">マネージャー</SelectItem>
                  <SelectItem value="staff">スタッフ</SelectItem>
                </SelectContent>
              </Select>

              {/* 通知 */}
              <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>通知</DialogTitle>
                  </DialogHeader>
                  <NotificationDisplay userRole={currentRole} />
                </DialogContent>
              </Dialog>

              {/* ダークモード切り替え */}
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                <Moon className="h-4 w-4" />
              </div>

              {/* プロフィールメニュー */}
              <Select>
                <SelectTrigger className="w-auto border-none shadow-none">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{currentUser.name}</span> {/* ユーザー名を表示 */}
                  </div>
                </SelectTrigger>

                <SelectContent align="end">
                  <div className="p-2">
                    <div className="font-medium">{currentUser.name}</div>
                    <div className="text-sm text-gray-500">{currentUser.department}</div>
                  </div>
                  <Separator />
                  <SelectItem
                    value="logout"
                    onClick={() => {
                      console.log("Logging out...")
                      setCurrentRole("admin") // ロールを管理者に戻してログアウトをシミュレート
                      setActiveTab("dashboard") // ダッシュボードタブにリセット
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    ログアウト
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー */}
        <Sidebar
          userRole={currentRole}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* メインコンテンツ */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentRole === "admin" && "管理者ダッシュボード"}
                {currentRole === "manager" && "マネージャーダッシュボード"}
                {currentRole === "staff" && "スタッフダッシュボード"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentRole === "admin" && "システム全体の管理と監視"}
                {currentRole === "manager" && "チームのシフト管理と承認業務"}
                {currentRole === "staff" && "個人のシフト確認と申請"}
              </p>
            </div>
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
