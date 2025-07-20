# Render.com Simple Build Recipe

# Install with reduced parallelism
npm config set maxsockets 3
npm config set progress false
npm config set audit false
npm config set fund false

# Install dependencies
npm install --legacy-peer-deps --no-audit --no-fund

# Build the application
npm run build
