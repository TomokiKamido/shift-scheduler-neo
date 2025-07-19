# Render.com デプロイガイド

## 🚀 Renderでのデプロイ手順

### 1. 事前準備

#### Supabaseプロジェクトの準備
1. [Supabase](https://supabase.com) でプロジェクト作成
2. `supabase-setup.sql` の内容をSQL Editorで実行
3. Settings > API から以下を取得：
   - Project URL
   - Project API keys (anon public)

#### GitHubリポジトリの作成
```bash
# プロジェクトルートで実行
git init
git add .
git commit -m "Initial commit: Shift Management System"
git branch -M main
git remote add origin https://github.com/your-username/shift-scheduler.git
git push -u origin main
```

### 2. Renderでのデプロイ

#### Web Service作成
1. [Render Dashboard](https://dashboard.render.com/) にログイン
2. "New +" → "Web Service" を選択
3. GitHubリポジトリを接続

#### ビルド設定
- **Name**: shift-scheduler
- **Region**: Oregon (US West)
- **Branch**: main
- **Root Directory**: （空白）
- **Runtime**: Node
- **Build Command**: `chmod +x build.sh && ./build.sh`
- **Start Command**: `npm start`

#### 環境変数設定
以下の環境変数を設定：

```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
PORT=3000
```

### 3. 自動デプロイの確認

#### デプロイログの確認
- Renderダッシュボードでビルドログを確認
- エラーがある場合は "Logs" タブで詳細を確認

#### 動作確認
1. デプロイ完了後、提供されるURLにアクセス
2. `/signup` で新規ユーザー作成
3. 各機能の動作確認

### 4. トラブルシューティング

#### よくある問題

**ビルドエラー**
```bash
# 依存関係の問題の場合
npm install --legacy-peer-deps
```

**環境変数の問題**
- Supabase URLとキーが正しく設定されているか確認
- URLの末尾にスラッシュが含まれていないか確認

**認証の問題**
- Supabase Auth設定でRenderのドメインを許可リストに追加
- Site URL: `https://your-app-name.onrender.com`
- Redirect URLs: `https://your-app-name.onrender.com/auth/callback`

### 5. パフォーマンス最適化

#### キャッシュ設定
Renderは自動的にstatic assetsをキャッシュしますが、追加最適化が可能：

1. **Headers設定** (next.config.mjsで設定済み)
2. **Image最適化** (Supabase Storageまたは外部CDN使用推奨)
3. **Database Connection Pooling** (Supabaseで自動設定)

### 6. 監視とメンテナンス

#### ログ監視
- Renderダッシュボードの "Logs" タブで application logs確認
- Supabaseダッシュボードでデータベースメトリクス確認

#### 自動バックアップ
- Supabaseは自動バックアップを提供
- 重要なデータは定期的に手動エクスポート推奨

### 7. カスタムドメインの設定（オプション）

#### 独自ドメインの追加
1. Renderダッシュボードで "Settings" → "Custom Domains"
2. ドメインを追加し、CNAME/Aレコードを設定
3. SSL証明書の自動発行を確認

## 🔒 セキュリティチェックリスト

- [ ] 環境変数が正しく設定されている
- [ ] Supabase RLSポリシーが適用されている
- [ ] HTTPS接続が有効になっている
- [ ] セキュリティヘッダーが設定されている
- [ ] 認証フローが正常に動作している

## 📞 サポート

問題が発生した場合：
1. Renderのログを確認
2. Supabaseのログを確認
3. GitHub Issuesで報告

---

🎉 **デプロイ完了後は本格的なシフト管理システムとして運用開始！**
