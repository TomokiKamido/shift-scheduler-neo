#!/bin/bash

# Render.com デプロイスクリプト（512MB制限対応）
# エラー時は即座に停止
set -e

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
if [ -f "package-lock.json" ]; then
    echo "package-lock.json が見つかりました。npm ci を使用します..."
    npm ci --legacy-peer-deps --no-audit --no-fund --maxsockets=3
else
    echo "package-lock.json が見つかりません。npm install を使用します..."
    npm install --legacy-peer-deps --no-audit --no-fund --maxsockets=3
fi

# インストール確認
echo "📋 インストールされたパッケージを確認..."
npm list --depth=0 || true

# プロジェクトのビルド
echo "🔨 アプリケーションをビルド中（メモリ制限モード）..."
npm run build

echo "✅ ビルド完了!"

# ビルド結果確認
if [ -d ".next" ]; then
    echo "📁 .next ディレクトリが正常に作成されました"
    ls -la .next/ || true
else
    echo "❌ .next ディレクトリが見つかりません！"
    exit 1
fi
