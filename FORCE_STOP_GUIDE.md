# Render.com デプロイ強制終了手順

## 🛑 強制終了方法

### 方法1: サービス停止 (推奨)
1. Render.com ダッシュボード
2. サービス詳細ページ
3. 右上の「Settings」タブ
4. 下部の「Suspend Service」ボタン
5. 確認ダイアログで「Suspend」
6. サービスが停止され、ビルドも強制終了

### 方法2: 新しいサービス作成
1. 現在のサービスを放置
2. 新しいWeb Serviceを作成
3. 同じGitHubリポジトリを接続
4. 新しいサービス名で作成
5. アップグレード済みプランで即座にデプロイ

### 方法3: GitHub側でビルドトリガーを回避
1. GitHub → リポジトリ → Settings
2. Webhooks → Render webhook を一時削除
3. Render側でManual Deploy無効化

## ⚠️ 注意事項
- Suspend後は手動でResumeが必要
- 新しいサービス作成時は古いものを削除推奨
- プラン料金は新サービス作成時に適用
