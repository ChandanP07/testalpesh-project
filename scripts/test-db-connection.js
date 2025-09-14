// scripts/test-db-connection.js
// Run this with: node scripts/test-db-connection.js

const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  console.log('🔍 Testing database connection...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'))
  
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

  try {
    // Test basic connection
    console.log('\n1. Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Test query execution
    console.log('\n2. Testing query execution...')
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query execution successful:', result)

    // Test user table existence
    console.log('\n3. Checking if tables exist...')
    try {
      const userCount = await prisma.user.count()
      console.log('✅ User table exists with', userCount, 'records')
    } catch (error) {
      console.log('❌ User table does not exist or has issues:', error.message)
      console.log('💡 You may need to run: npx prisma db push')
    }

    // Test creating a simple record (if table exists)
    console.log('\n4. Testing record creation...')
    try {
      const testUser = await prisma.user.findFirst({
        where: { username: 'admin' }
      })
      
      if (testUser) {
        console.log('✅ Found admin user:', testUser.username, testUser.email)
      } else {
        console.log('❌ Admin user not found')
        console.log('💡 You may need to run: npx prisma db seed')
      }
    } catch (error) {
      console.log('❌ Error querying users:', error.message)
    }

  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error('Error:', error.message)
    console.error('\n🔧 Troubleshooting steps:')
    console.error('1. Check if PostgreSQL is running: sudo systemctl status postgresql')
    console.error('2. Verify DATABASE_URL in .env.local')
    console.error('3. Test manual connection: psql -h localhost -U your_user -d your_db')
    console.error('4. Check PostgreSQL logs: sudo tail -f /var/log/postgresql/postgresql-*.log')
  } finally {
    await prisma.$disconnect()
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

testConnection().catch(console.error)