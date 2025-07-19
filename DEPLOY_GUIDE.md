# 🚀 Shift Scheduler Neo - 完全デプロイガイド

## 📋 デプロイ前の確認事項

✅ **完了済み**
- [x] v0生成UIの保持（変更なし）
- [x] Supabase統合完了
- [x] 認証システム実装
- [x] 本番ビルド設定
- [x] GitHubリポジトリセットアップ
- [x] 環境変数設定

## 🗄️ Supabaseデータベースセットアップ

### ステップ1: Supabaseダッシュボードにアクセス
1. [Supabase Dashboard](https://app.supabase.com) にアクセス
2. プロジェクト `ytrjgpkqvhunttktwyxze` を選択

### ステップ2: SQL Editorでデータベースセットアップ
以下の順序で実行してください：

1. **段階1 - 基本テーブル作成**
   ```sql
   -- supabase-step1-tables.sql の内容を実行
   ```

2. **段階2 - セキュリティポリシー**
   ```sql
   -- supabase-step2-rls.sql の内容を実行
   ```

3. **段階3 - 関数とサンプルデータ**
   ```sql
   -- supabase-step3-functions.sql の内容を実行
   ```

詳細は `SUPABASE_SETUP.md` を参照してください。

## 🌐 Render.comデプロイ

### ステップ1: Renderアカウント作成
1. [Render.com](https://render.com) でアカウント作成
2. GitHubアカウント連携

### ステップ2: 新しいWebサービス作成
1. Dashboard で "New +" → "Web Service"
2. "Connect a repository" → `TomokiKamido/shift-scheduler-neo` を選択

### ステップ3: デプロイ設定
- **Name**: `shift-scheduler-neo`
- **Environment**: `Node`
- **Build Command**: `./build.sh`
- **Start Command**: `pnpm start`
- **Node Version**: `18` or `20`

### ステップ4: 環境変数設定
**Environment Variables** セクションで以下を追加：

```
NEXT_PUBLIC_SUPABASE_URL=https://ytrjgpkqvhunttktwyxze.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cmpncGtxdmh1bnR0a3dreHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzI1MjMsImV4cCI6MjA2ODUwODUyM30.xZMtJ1Wz7uFCnLwp3L8rUsk-v1Y16z8C10IT9-eJUEM
NEXTAUTH_SECRET=your_strong_production_secret_here
NODE_ENV=production
```

### ステップ5: デプロイ実行
"Create Web Service" をクリックしてデプロイを開始

## 🧪 デプロイ後テスト

### 基本機能テスト
1. **認証テスト**
   - サインアップ機能
   - ログイン機能
   - ダッシュボードアクセス

2. **UI動作確認**
   - 管理者ダッシュボード
   - マネージャーダッシュボード
   - スタッフダッシュボード

3. **データベース連携**
   - プロファイル作成
   - シフト管理
   - リクエスト処理

## 📊 アプリケーション概要

### 機能一覧
- **認証システム**: Supabase Auth
- **役割ベースアクセス**: Admin / Manager / Staff
- **シフト管理**: 作成・編集・削除
- **リクエスト管理**: 休暇・代替シフト申請
- **レポート機能**: 勤務時間分析
- **通知システム**: リアルタイム更新

### 技術スタック
- **Frontend**: Next.js 15 + App Router
- **UI**: Radix UI + Tailwind CSS（v0生成）
- **Backend**: Supabase（PostgreSQL + Auth）
- **Deployment**: Render.com
- **Repository**: GitHub

### セキュリティ機能
- **Row Level Security (RLS)**: データアクセス制御
- **役割ベース認証**: 部署別アクセス権限
- **セッション管理**: 自動ログアウト
- **データ暗号化**: Supabase標準セキュリティ

## 🔧 トラブルシューティング

### よくある問題

**ビルドエラー**
```bash
# 依存関係の問題
pnpm install --legacy-peer-deps
```

**認証エラー**
```
Supabase環境変数の確認
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**データベース接続エラー**
```
Supabaseプロジェクトの状態確認
RLSポリシーの設定確認
```

## 📞 サポート

問題が発生した場合：
1. `build.sh` スクリプトログの確認
2. Render.com デプロイログの確認  
3. Supabase ダッシュボードでのエラー確認
4. GitHubリポジトリのissue作成

---

**🎉 デプロイ成功後、本格的なシフト管理システムの運用開始！**
