# Render.com デプロイガイド（最終版）

## 🚀 重要：Render.comサービス設定

### 1. サービス作成設定

```
Name: shift-scheduler-neo-v3
Runtime: Node.js
Build Command: NODE_OPTIONS="--max-old-space-size=1800" npm install --legacy-peer-deps --no-audit --no-fund --maxsockets=3 && npm run build
Start Command: npm start
Plan: Starter ($7/月) ← 必須！
Node Version: 18.x
```

### 2. 環境変数設定

```
NODE_OPTIONS=--max-old-space-size=1800
NPM_CONFIG_MAXSOCKETS=3
NPM_CONFIG_PROGRESS=false
NPM_CONFIG_AUDIT=false
NPM_CONFIG_FUND=false
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 成功のための重要ポイント

- ✅ **Starter Plan必須**: Free Tierでは512MB制限でビルド不可
- ✅ **NODE_OPTIONS**: 1800MBでメモリ最大活用
- ✅ **npm最適化**: --maxsockets=3で並列処理制限
- ✅ **audit/fund無効**: 不要な処理でメモリ節約
- ✅ **output: standalone**: 軽量ビルド

### 4. デプロイ手順

1. Render.com Dashboardで「New +」→「Web Service」
2. GitHubリポジトリ「shift-scheduler-neo」を選択
3. 上記設定を**完全に一致**するよう入力
4. 環境変数を**すべて**設定
5. 「Create Web Service」をクリック

### 5. トラブルシューティング

- **ビルド失敗**: Starter Planが選択されているか確認
- **メモリエラー**: NODE_OPTIONSが正しく設定されているか確認
- **依存関係エラー**: Build Commandが完全一致しているか確認

**重要**: Free Tierでは絶対にビルドできません。必ずStarter Plan ($7/月)を選択してください。
