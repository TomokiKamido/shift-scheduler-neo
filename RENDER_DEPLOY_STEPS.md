# 🚀 Render.com デプロイ実行ガイド

## 📋 設定項目一覧（コピー用）

### Repository Information
```
Repository: TomokiKamido/shift-scheduler-neo
Branch: main
```

### Build Settings
```
Name: shift-scheduler-neo
Environment: Node
Region: Oregon (US West)
Build Command: ./build.sh
Start Command: npm start
Auto-Deploy: Yes
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://ytrjgpkqvhunttktwyxze.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cmpncGtxdmh1bnR0a3dreHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzI1MjMsImV4cCI6MjA2ODUwODUyM30.xZMtJ1Wz7uFCnLwp3L8rUsk-v1Y16z8C10IT9-eJUEM
NEXTAUTH_SECRET=shift_scheduler_production_secret_2025
NODE_ENV=production
```

## 🔧 デプロイ手順

### Step 1: Repository連携
1. Render Dashboard で「New +」→「Web Service」
2. 「Connect a repository」をクリック
3. GitHubを選択
4. `TomokiKamido/shift-scheduler-neo` を検索・選択
5. 「Connect」をクリック

### Step 2: 基本設定
- **Name**: `shift-scheduler-neo`
- **Environment**: `Node`
- **Region**: `Oregon (US West)` 
- **Branch**: `main`

### Step 3: Build設定
- **Build Command**: `./build.sh`
- **Start Command**: `npm start`
- **Auto-Deploy**: `Yes`

### Step 4: 環境変数設定
「Environment Variables」セクションで上記の4つの変数を追加

### Step 5: デプロイ実行
「Create Web Service」をクリック

## ⏱️ 予想デプロイ時間
- ビルド時間: 5-8分
- 起動時間: 1-2分
- 合計: 約10分

## ✅ 成功確認
デプロイ完了後、提供されるURLにアクセスして動作確認

---
**🎯 目標: 本格的なシフト管理システムを本番環境で運用開始！**
