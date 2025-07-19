# シフト管理システム (Shift Management System)

Next.js + Supabase を使用したロールベースの当直シフト管理アプリケーション

## 🚀 特徴

- **ロールベースアクセス制御**: Admin、Manager、Staff の3つの役職
- **認証システム**: Supabase Auth による安全なログイン
- **シフト管理**: 直感的なUIでのシフト作成・管理
- **リクエスト管理**: 休暇申請・シフト交換申請の承認ワークフロー
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **リアルタイム更新**: Supabaseのリアルタイム機能

## 🛠 技術スタック

- **フロントエンド**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Auth, Realtime)
- **UI コンポーネント**: Radix UI, Lucide Icons
- **認証**: Supabase Auth with Row Level Security (RLS)

## 📦 インストール

1. リポジトリのクローン
```bash
git clone <repository-url>
cd shift-scheduler
```

2. 依存関係のインストール
```bash
npm install --legacy-peer-deps
```

3. 環境変数の設定
`.env.local` ファイルを作成し、以下を設定：
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Supabaseデータベースの設定
`supabase-setup.sql` のスクリプトをSupabase SQL Editorで実行

5. 開発サーバーの起動
```bash
npm run dev
```

## 🏗 アーキテクチャ

### ディレクトリ構造
```
├── app/
│   ├── api/                 # API Routes
│   │   ├── shifts/         # シフト関連API
│   │   └── requests/       # リクエスト関連API
│   ├── dashboard/          # ダッシュボード
│   ├── login/              # ログインページ
│   ├── signup/             # 新規登録ページ
│   └── unauthorized/       # アクセス権限エラーページ
├── components/             # 既存UIコンポーネント (v0生成)
├── lib/
│   ├── supabase.ts        # Supabaseクライアント設定
│   ├── auth.ts            # 認証ユーティリティ
│   └── utils.ts           # ユーティリティ関数
├── middleware.ts          # 認証・認可ミドルウェア
└── supabase-setup.sql     # データベース設定スクリプト
```

### データベース設計
- **profiles**: ユーザープロフィール情報
- **departments**: 部署情報
- **shifts**: シフト情報
- **requests**: 休暇・シフト交換申請

## 👥 ユーザーロール

### Admin (管理者)
- 全ユーザー・部署・シフトの管理
- システム設定の変更
- 全てのリクエストの承認・却下

### Manager (マネージャー)
- 所属部署のシフト管理
- 部署内スタッフのリクエスト承認・却下
- 部署レポートの確認

### Staff (スタッフ)
- 自分のシフト確認
- 休暇申請・シフト交換申請
- プロフィール編集

## 🔐 セキュリティ

- **Row Level Security (RLS)**: テーブルレベルでのアクセス制御
- **認証ミドルウェア**: ルートベースの認証チェック
- **ロールベースアクセス**: 役職に応じた機能制限
- **API保護**: 全てのAPIエンドポイントに認証必須

## 🚦 利用方法

### 初回セットアップ
1. `/signup` でアカウント作成
2. メール認証の完了
3. 管理者が適切な役職・部署を設定

### 基本操作
1. `/login` でログイン
2. `/dashboard` でダッシュボード確認
3. 役職に応じた機能の利用

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# 型チェック
npm run type-check

# リンティング
npm run lint
```

## 📝 既存UIについて

このプロジェクトは v0 by Vercel で生成された充実したUIを基盤としており、以下の方針で開発しています：

- ✅ **既存UIは一切変更しない**
- ✅ **デザイン・レイアウトの維持**
- ✅ **機能追加は既存枠組み内で実装**

## 🤝 貢献

1. フォークする
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🆘 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

---

**注意**: このアプリケーションは医療機関での実際の利用を想定して設計されていますが、本番環境で使用する前に十分なテストと検証を行ってください。
