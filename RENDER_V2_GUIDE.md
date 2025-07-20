# Render.com デプロイガイド（改訂版）

## 🚀 新しいRender.comサービス設定

### 1. サービス作成設定
```
Name: shift-scheduler-neo-v2
Runtime: Node.js
Build Command: npm install --legacy-peer-deps && npm run build
Start Command: npm start
Plan: Starter ($7/月)
Node Version: 18.x (推奨)
```

### 2. 環境変数
```
NODE_OPTIONS=--max-old-space-size=1800
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 問題解決済み項目
- ✅ package-lock.jsonの削除（pnpm-lock.yamlと競合回避）
- ✅ output: 'standalone'でビルドサイズ最適化
- ✅ メモリ制限対応（NODE_OPTIONS）
- ✅ Starter Plan選択で2GBメモリ確保

### 4. 推奨設定変更
Build Command を以下に変更：
```bash
NODE_OPTIONS="--max-old-space-size=1800" npm install --legacy-peer-deps && npm run build
```

これでStarter Planの2GBメモリを最大活用できます。
