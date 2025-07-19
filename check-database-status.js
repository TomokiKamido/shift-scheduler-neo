// Supabaseデータベース状態確認スクリプト
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStatus() {
  console.log('🔍 Supabaseデータベース状態を確認中...\n');

  const tables = [
    { name: 'profiles', description: 'ユーザープロファイル' },
    { name: 'departments', description: '部署情報' },
    { name: 'shifts', description: 'シフト情報' },
    { name: 'requests', description: 'リクエスト情報' }
  ];

  let tablesExist = 0;

  for (const table of tables) {
    try {
      console.log(`📋 ${table.name} テーブルをチェック中...`);
      
      const { data, error } = await supabase
        .from(table.name)
        .select('count')
        .limit(1);

      if (!error) {
        console.log(`  ✅ ${table.name}: 存在します (${table.description})`);
        tablesExist++;
        
        // データ件数を確認
        const { count } = await supabase
          .from(table.name)
          .select('*', { count: 'exact', head: true });
        console.log(`     レコード数: ${count || 0} 件`);
        
      } else if (error.message.includes('does not exist')) {
        console.log(`  ❌ ${table.name}: 未作成 (${error.message})`);
      } else {
        console.log(`  ⚠️  ${table.name}: エラー - ${error.message}`);
      }
    } catch (err) {
      console.log(`  ❌ ${table.name}: 接続エラー - ${err.message}`);
    }
    console.log('');
  }

  console.log(`📊 結果: ${tablesExist}/${tables.length} のテーブルが存在します\n`);

  if (tablesExist === 0) {
    console.log('🔧 手動セットアップが必要です:');
    console.log('1. https://app.supabase.com/project/ytrjgpkqvhunttktwyxze にアクセス');
    console.log('2. 左側メニューから「SQL Editor」を選択');
    console.log('3. 新しいクエリを作成');
    console.log('4. supabase-step1-tables.sql の内容をコピー&ペースト');
    console.log('5. 「Run」ボタンをクリック');
  } else if (tablesExist === tables.length) {
    console.log('🎉 すべてのテーブルが作成済みです！');
    console.log('📋 次のステップ: セキュリティポリシーの設定');
    console.log('   supabase-step2-rls.sql を実行してください');
  } else {
    console.log('⚠️  一部のテーブルが不完全です。手動で確認してください。');
  }
}

checkDatabaseStatus();
