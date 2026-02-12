// Comprehensive Startup Script with Health Checks
// Ensures system is ready before starting

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fetch from 'node-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('=' .repeat(60))
console.log('🚀 HAWK TAEKWONDO - SYSTEM STARTUP')
console.log('=' .repeat(60))

// Helper to wait for API to be ready
async function waitForAPI(maxAttempts = 30, delayMs = 1000) {
  console.log('\n⏳ Waiting for backend API to be ready...')
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch('http://localhost:3001/api/data', {
        method: 'GET',
        timeout: 2000
      })
      
      if (response.ok) {
        console.log('✅ Backend API is ready!')
        return true
      }
    } catch (error) {
      // API not ready yet, continue waiting
      process.stdout.write('.')
    }
    
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }
  
  console.log('\n⚠️  Backend API did not respond within timeout')
  return false
}

// Step 1: Run startup checks (migration)
console.log('\n📋 Step 1: Running startup checks...')
const startupCheck = spawn('node', ['backend/src/scripts/startup.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
})

startupCheck.on('close', async (code) => {
  if (code !== 0) {
    console.error('\n❌ Startup checks failed. Cannot start system.')
    process.exit(1)
  }
  
  console.log('\n✅ Startup checks passed')
  
  // Step 2: Start backend and frontend
  console.log('\n📋 Step 2: Starting backend and frontend...')
  const servers = spawn('npm', ['run', 'start:servers'], {
    cwd: __dirname,
    stdio: 'pipe',
    shell: true
  })
  
  // Forward server output
  servers.stdout.on('data', (data) => {
    process.stdout.write(data)
  })
  
  servers.stderr.on('data', (data) => {
    process.stderr.write(data)
  })
  
  // Wait for API to be ready
  const apiReady = await waitForAPI()
  
  if (apiReady) {
    // Step 3: Run health check
    console.log('\n📋 Step 3: Running health check...')
    const healthCheck = spawn('node', ['backend/src/scripts/healthCheck.js'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    })
    
    healthCheck.on('close', (healthCode) => {
      if (healthCode !== 0) {
        console.warn('\n⚠️  Health check detected issues, but servers are running')
      } else {
        console.log('\n✅ All systems operational')
      }
      console.log('\n' + '='.repeat(60))
      console.log('🎉 SYSTEM READY')
      console.log('   Backend: http://localhost:3001')
      console.log('   Frontend: http://localhost:5173')
      console.log('   Press Ctrl+C to stop')
      console.log('=' .repeat(60))
    })
  } else {
    console.log('\n⚠️  Skipping health check - API not ready')
    console.log('\n' + '='.repeat(60))
    console.log('⚠️  SYSTEM STARTED (with warnings)')
    console.log('   Backend: http://localhost:3001 (may not be ready)')
    console.log('   Frontend: http://localhost:5173')
    console.log('   Press Ctrl+C to stop')
    console.log('=' .repeat(60))
  }
  
  // Handle shutdown
  const shutdown = () => {
    console.log('\n\n👋 Shutting down servers...')
    servers.kill('SIGINT')
    setTimeout(() => {
      process.exit(0)
    }, 1000)
  }
  
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
  
  servers.on('close', () => {
    console.log('👋 Servers stopped')
    process.exit(0)
  })
})

startupCheck.on('error', (error) => {
  console.error('\n❌ Failed to run startup checks:', error.message)
  process.exit(1)
})
