# 🚀 実際のデプロイ実行手順

## ✅ 準備完了事項
- [x] GitHubリポジトリ: `TomokiKamido/shift-scheduler-neo`
- [x] 本番ビルド: 成功確認済み
- [x] 環境変数: 設定済み
- [x] デプロイスクリプト: 準備完了

## 🗄️ STEP 1: Supabaseデータベースセットアップ

### 1.1 Supabaseダッシュボードアクセス
1. ブラウザで https://app.supabase.com を開く
2. プロジェクト `ytrjgpkqvhunttktwyxze` を選択
3. 左側メニューから「SQL Editor」をクリック

### 1.2 段階1実行（基本テーブル）
1. 「New query」をクリック
2. `supabase-manual-step1.sql` の内容を全選択してコピー
3. SQL Editorにペースト
4. 「Run」ボタンをクリック
5. エラーがないことを確認

### 1.3 段階2実行（セキュリティポリシー）
1. 新しいクエリを作成
2. `supabase-step2-rls.sql` の内容をコピー&ペースト
3. 「Run」ボタンをクリック

### 1.4 段階3実行（関数とサンプルデータ）
1. 新しいクエリを作成
2. `supabase-step3-functions.sql` の内容をコピー&ペースト
3. 「Run」ボタンをクリック

### 1.5 確認
「Table Editor」タブで以下のテーブルが存在することを確認：
- [x] profiles
- [x] departments (サンプルデータ5件)
- [x] shifts
- [x] requests

## 🌐 STEP 2: Render.comデプロイ

### 2.1 Renderアカウントセットアップ
1. https://render.com にアクセス
2. 「Get Started」→「Sign up with GitHub」
3. GitHubアカウントで認証

### 2.2 新しいWebサービス作成
1. Dashboard で「New +」→「Web Service」
2. 「Connect a repository」をクリック
3. `TomokiKamido/shift-scheduler-neo` を選択
4. 「Connect」をクリック

### 2.3 デプロイ設定
以下の設定を入力：

**Basic Settings:**
- Name: `shift-scheduler-neo`
- Region: `Oregon (US West)`
- Branch: `main`
- Runtime: `Node`

**Build & Deploy:**
- Build Command: `./build.sh`
- Start Command: `npm start`

### 2.4 環境変数設定
「Environment Variables」セクションで以下を追加：

```
NEXT_PUBLIC_SUPABASE_URL=https://ytrjgpkqvhunttktwyxze.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cmpncGtxdmh1bnR0a3dreHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzI1MjMsImV4cCI6MjA2ODUwODUyM30.xZMtJ1Wz7uFCnLwp3L8rUsk-v1Y16z8C10IT9-eJUEM
NEXTAUTH_SECRET=shift_scheduler_secret_2025_production
NODE_ENV=production
```

### 2.5 デプロイ実行
1. 「Create Web Service」をクリック
2. ビルドログを確認（5-10分程度）
3. 成功したらURLをメモ

## 🧪 STEP 3: 動作確認

### 3.1 基本アクセステスト
1. RenderのURLにアクセス
2. ホームページが表示されることを確認
3. ローディング時間を確認

### 3.2 認証機能テスト
1. 「サインアップ」をクリック
2. テストアカウントを作成：
   - Name: テストユーザー
   - Email: test@example.com
   - Employee ID: EMP001
   - Department: 内科
   - Role: staff
3. ログイン/ログアウトを確認

### 3.3 ダッシュボード機能テスト
1. 各役割のダッシュボードアクセス
2. データ表示の確認
3. レスポンシブデザインの確認

### 3.4 データベース連携テスト
1. プロファイル更新
2. シフト作成（管理者）
3. リクエスト送信（スタッフ）

## 🎉 完了

すべてのテストが成功したら、本格運用開始！

### 本番URL
デプロイ後のURL: `https://shift-scheduler-neo.onrender.com`

### 管理者アクセス
初回は手動でadmin権限をSupabaseで設定：
1. Supabase Dashboard → Table Editor → profiles
2. 作成したユーザーのroleを'admin'に変更

---

**🎊 Shift Scheduler Neo デプロイ完了！**
