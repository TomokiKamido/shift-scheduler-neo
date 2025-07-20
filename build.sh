#!/bin/bash

# Render.com デプロイスクリプト（512MB制限対応）
# このスクリプトはRender上でアプリケーションをビルド・起動します

echo "🚀 Shift Scheduler デプロイ開始..."

# メモリ制限を設定（Render.com 512MB制限対応）
export NODE_OPTIONS="--max-old-space-size=480"
export NPM_CONFIG_CACHE="false"
export NPM_CONFIG_PROGRESS="false"

# Node.jsのバージョン確認
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "Memory limit: $NODE_OPTIONS"

# キャッシュクリア（メモリ使用量削減のため）
echo "🧹 キャッシュをクリア中..."
npm cache clean --force 2>/dev/null || true

# 依存関係のインストール（メモリ制限モード）
echo "📦 依存関係をインストール中（メモリ制限モード）..."
npm ci --legacy-peer-deps --no-audit --no-fund --maxsockets=3

# プロジェクトのビルド
echo "🔨 アプリケーションをビルド中（メモリ制限モード）..."
npm run build

echo "✅ ビルド完了!"
echo "🌐 アプリケーションを起動します..."

# アプリケーションの起動
npm start
