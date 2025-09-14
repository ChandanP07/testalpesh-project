import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@printcare.com' },
      update: {},
      create: {
        email: 'admin@printcare.com',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })
    console.log('✅ Admin user created:', adminUser.username)

    // Create default printer models
    const printerModels = [
      { modelName: 'HP LaserJet Pro M404n', brand: 'HP', type: 'LASER' as const },
      { modelName: 'Canon PIXMA G2010', brand: 'Canon', type: 'INKJET' as const },
      { modelName: 'Epson L3150', brand: 'Epson', type: 'INKJET' as const },
      { modelName: 'Brother HL-L2321D', brand: 'Brother', type: 'LASER' as const },
    ]

    for (const model of printerModels) {
      await prisma.printerModel.upsert({
        where: { modelName: model.modelName },
        update: {},
        create: model,
      })
    }
    console.log('✅ Printer models created:', printerModels.length)

    // Get created printer models for cartridge relations
    const hpModel = await prisma.printerModel.findUnique({
      where: { modelName: 'HP LaserJet Pro M404n' }
    })
    const canonModel = await prisma.printerModel.findUnique({
      where: { modelName: 'Canon PIXMA G2010' }
    })

    if (hpModel && canonModel) {
      // Create cartridge models
      const cartridgeModels = [
        {
          modelName: 'HP 58A (CF258A)',
          printerModelId: hpModel.id,
          type: 'ORIGINAL' as const,
          color: 'BLACK' as const,
          pageYield: 3000,
        },
        {
          modelName: 'Canon GI-790 Black',
          printerModelId: canonModel.id,
          type: 'ORIGINAL' as const,
          color: 'BLACK' as const,
          pageYield: 7000,
        }
      ]

      for (const cartridge of cartridgeModels) {
        await prisma.cartridgeModel.upsert({
          where: { modelName: cartridge.modelName },
          update: {},
          create: cartridge,
        })
      }
      console.log('✅ Cartridge models created:', cartridgeModels.length)
    }

    // Create default settings
    const settings = [
      { key: 'COMPANY_NAME', value: 'PrintCare Solutions', description: 'Company Name' },
      { key: 'GST_NUMBER', value: '27XXXXX1234X1Z5', description: 'GST Registration Number' },
      { key: 'DEFAULT_TAX_RATE', value: '18', description: 'Default Tax Rate (%)' },
      { key: 'CURRENCY', value: 'INR', description: 'Currency' },
    ]

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting,
      })
    }
    console.log('✅ Settings created:', settings.length)

    console.log('🎉 Database seeded successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })