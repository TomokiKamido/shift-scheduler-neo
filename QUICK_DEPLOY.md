# 🎯 ワンクリックデプロイガイド

## ✅ 前提条件
- [x] `supabase-complete-setup.sql` を実行済み
- [x] GitHubリポジトリ準備完了

## 🚀 Render.comデプロイ（5分で完了）

### 1. Renderアカウント作成
1. https://render.com にアクセス
2. 「Get Started」→「Sign up with GitHub」

### 2. Webサービス作成
1. Dashboard で「New +」→「Web Service」
2. 「Connect repository」→「TomokiKamido/shift-scheduler-neo」

### 3. 設定入力
```
Name: shift-scheduler-neo
Region: Oregon (US West)
Branch: main
Runtime: Node
Build Command: ./build.sh
Start Command: npm start
```

### 4. 環境変数設定
```
NEXT_PUBLIC_SUPABASE_URL=https://ytrjgpkqvhunttktwyxze.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cmpncGtxdmh1bnR0a3dreHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzI1MjMsImV4cCI6MjA2ODUwODUyM30.xZMtJ1Wz7uFCnLwp3L8rUsk-v1Y16z8C10IT9-eJUEM
NEXTAUTH_SECRET=shift_scheduler_production_secret_2025
NODE_ENV=production
```

### 5. デプロイ実行
「Create Web Service」をクリック → 5-10分待つ

## 🧪 動作確認

### 基本テスト
1. デプロイ完了後のURLにアクセス
2. サインアップでテストアカウント作成
3. ダッシュボードの動作確認

### 管理者権限設定
1. Supabase Dashboard → Table Editor → profiles
2. 作成したユーザーの `role` を `admin` に変更
3. 管理者ダッシュボードにアクセス確認

## 🎉 完了！
本格的なシフト管理システムが運用開始！
