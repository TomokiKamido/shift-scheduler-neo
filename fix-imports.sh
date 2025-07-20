#!/bin/bash

# インポートパス修正スクリプト
echo "🔧 インポートパスを修正中..."

# app/login/page.tsx
sed -i '' 's/@\/lib\/supabase/..\/..\/lib\/supabase/g' app/login/page.tsx
sed -i '' 's/@\/components\/ui\//..\/..\/components\/ui\//g' app/login/page.tsx

# app/signup/page.tsx  
sed -i '' 's/@\/lib\/supabase/..\/..\/lib\/supabase/g' app/signup/page.tsx
sed -i '' 's/@\/components\/ui\//..\/..\/components\/ui\//g' app/signup/page.tsx

# app/dashboard/page.tsx
sed -i '' 's/@\/lib\/auth/..\/..\/lib\/auth/g' app/dashboard/page.tsx
sed -i '' 's/@\/lib\/supabase/..\/..\/lib\/supabase/g' app/dashboard/page.tsx

# app/unauthorized/page.tsx
sed -i '' 's/@\/components\/ui\//..\/..\/components\/ui\//g' app/unauthorized/page.tsx

echo "✅ インポートパス修正完了"
