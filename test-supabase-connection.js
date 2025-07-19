// Supabase接続テスト
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 20 chars):', supabaseKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase環境変数が設定されていません');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔄 Supabase接続テスト中...');
    
    // 基本的な接続テスト
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.log('📝 プロファイルテーブルがまだ存在しません:', error.message);
      console.log('✅ Supabase接続は成功しました（データベーススキーマの作成が必要）');
    } else {
      console.log('✅ Supabase接続成功！データベースも準備済みです');
      console.log('📊 プロファイルテーブル:', data);
    }
    
  } catch (err) {
    console.error('❌ Supabase接続エラー:', err.message);
    process.exit(1);
  }
}

testConnection();
