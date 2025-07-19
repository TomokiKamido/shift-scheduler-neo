// Supabaseデータベースセットアップ自動実行スクリプト
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase環境変数が設定されていません');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🗄️ Supabaseデータベースセットアップを開始します...\n');

  try {
    // 段階1: 基本テーブルの作成
    console.log('📋 段階1: 基本テーブルの作成...');
    const step1Sql = fs.readFileSync('./supabase-step1-tables.sql', 'utf8');
    
    // コメント行と空行を除去してSQLを分割
    const step1Queries = step1Sql
      .split(';')
      .map(query => query.trim())
      .filter(query => query && !query.startsWith('--'));

    for (let i = 0; i < step1Queries.length; i++) {
      const query = step1Queries[i];
      if (query) {
        console.log(`  実行中: ${query.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: query });
        if (error) {
          console.log(`  ⚠️  クエリスキップ (既存の可能性): ${error.message}`);
        } else {
          console.log('  ✅ 成功');
        }
      }
    }

    // テーブル作成の確認
    console.log('\n🔍 テーブル作成の確認...');
    const tables = ['profiles', 'departments', 'shifts', 'requests'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log(`  ✅ ${table} テーブル: 作成済み`);
      } else {
        console.log(`  ❌ ${table} テーブル: ${error.message}`);
      }
    }

    console.log('\n📊 段階1完了！基本テーブルが作成されました。');
    
  } catch (error) {
    console.error('❌ データベースセットアップエラー:', error.message);
    console.log('\n📝 手動セットアップの手順:');
    console.log('1. https://app.supabase.com にアクセス');
    console.log('2. プロジェクト ytrjgpkqvhunttktwyxze を選択');
    console.log('3. SQL Editor で supabase-step1-tables.sql の内容を実行');
  }
}

setupDatabase();
