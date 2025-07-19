#!/bin/bash

# Render.com デプロイスクリプト
# このスクリプトはRender上でアプリケーションをビルド・起動します

echo "🚀 Shift Scheduler デプロイ開始..."

# Node.jsのバージョン確認
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install --legacy-peer-deps

# プロジェクトのビルド
echo "🔨 アプリケーションをビルド中..."
npm run build

echo "✅ ビルド完了!"
echo "🌐 アプリケーションを起動します..."

# アプリケーションの起動
npm start
