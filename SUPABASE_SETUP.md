# Supabaseデータベースセットアップ手順

## 1. Supabase プロジェクトにアクセス

1. [Supabase Dashboard](https://app.supabase.com) にアクセス
2. プロジェクト `ytrjgpkqvhunttktwyxze` を選択

## 2. SQL Editor でスクリプト実行

左側のメニューから「SQL Editor」をクリックし、以下の順序でスクリプトを実行してください：

### 段階1: 基本テーブルの作成
`supabase-step1-tables.sql` の内容をコピー&ペーストして実行

**含まれる内容:**
- profiles テーブル
- departments テーブル 
- shifts テーブル
- requests テーブル

### 段階2: セキュリティポリシーの設定
`supabase-step2-rls.sql` の内容をコピー&ペーストして実行

**含まれる内容:**
- Row Level Security (RLS) の有効化
- 各テーブルのアクセス制御ポリシー
- 役割ベースのアクセス権限

### 段階3: 関数とサンプルデータ
`supabase-step3-functions.sql` の内容をコピー&ペーストして実行

**含まれる内容:**
- 新規ユーザー自動プロファイル作成関数
- トリガー関数の設定
- サンプル部署データの挿入
- パフォーマンス向上のためのインデックス

## 3. 実行結果の確認

1. **Table Editor** タブに移動
2. 以下のテーブルが作成されていることを確認:
   - profiles
   - departments
   - shifts
   - requests

3. **departments** テーブルにサンプルデータが挿入されていることを確認

## 4. 認証設定の確認

1. **Authentication** タブに移動
2. **Settings** → **Auth** で以下を確認:
   - Enable email confirmations: 有効
   - Enable phone confirmations: 無効（メール認証のみ）

## 5. API設定の確認

**Settings** → **API** で以下の情報を確認:
- Project URL: `https://ytrjgpkqvhunttktwyxze.supabase.co`
- anon public key: （既に.env.localに設定済み）

## トラブルシューティング

### エラー: "must be owner of table users"
- 段階3のトリガー作成で発生する可能性があります
- auth.usersテーブルはSupabaseが管理するため、トリガーの作成に失敗することがあります
- アプリケーションでの手動プロファイル作成で対応可能です

### エラー: "relation does not exist"
- 前の段階のテーブル作成が完了していない可能性があります
- 段階1から順番に実行してください

## 次のステップ

データベースセットアップが完了したら:
1. ローカル開発サーバーでの動作確認
2. Render.comへのデプロイ
3. 本番環境での動作テスト
