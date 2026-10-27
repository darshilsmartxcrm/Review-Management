require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const User = require('../models/User');
const Client = require('../models/Client');
const Setting = require('../models/Setting');
const UsedReview = require('../models/UsedReview');
const Lead = require('../models/Lead');

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin@123',
  name: 'Master Admin',
  role: 'admin',
  phone: '919876543210',
};

const frontendDataDir = path.resolve(__dirname, '../../../Reviewmanagement_Platform/src/data');

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/review_management';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB.');

    // 1. Seed Admin User
    const existingAdmin = await User.findOne({ username: DEFAULT_ADMIN.username });
    if (!existingAdmin) {
      await User.create(DEFAULT_ADMIN);
      console.log(`👤 Admin user created: "${DEFAULT_ADMIN.username}" (password: "${DEFAULT_ADMIN.password}")`);
    } else {
      console.log(`👤 Admin user "${DEFAULT_ADMIN.username}" already exists.`);
    }

    // 2. Seed Settings
    const settingsFile = path.join(frontendDataDir, 'settings.json');
    let agencyPhone = '919876543210';
    if (fs.existsSync(settingsFile)) {
      try {
        const raw = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
        if (raw.agencyPhone) agencyPhone = raw.agencyPhone;
      } catch {}
    }
    const setting = await Setting.findOneAndUpdate(
      { key: 'master_agency_settings' },
      { key: 'master_agency_settings', agencyPhone, agencyName: 'SmartXCRM Review Hub' },
      { upsert: true, new: true }
    );
    console.log(`⚙️  Agency settings configured: WhatsApp contact = +${setting.agencyPhone}`);

    // 3. Seed Clients from existing clients.json
    const clientsFile = path.join(frontendDataDir, 'clients.json');
    if (fs.existsSync(clientsFile)) {
      try {
        const clientsData = JSON.parse(fs.readFileSync(clientsFile, 'utf-8'));
        if (Array.isArray(clientsData) && clientsData.length > 0) {
          let insertedCount = 0;
          for (const c of clientsData) {
            await Client.findOneAndUpdate(
              { id: c.id },
              { $set: c },
              { upsert: true, new: true, runValidators: true }
            );
            insertedCount++;
          }
          console.log(`🏢 Seeded/updated ${insertedCount} business clients from clients.json`);
        }
      } catch (e) {
        console.error('Error reading clients.json:', e);
      }
    }

    // 4. Seed Active Used Reviews from used_reviews.json
    const reviewsFile = path.join(frontendDataDir, 'used_reviews.json');
    if (fs.existsSync(reviewsFile)) {
      try {
        const reviewsData = JSON.parse(fs.readFileSync(reviewsFile, 'utf-8'));
        if (Array.isArray(reviewsData) && reviewsData.length > 0) {
          const now = Date.now();
          const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
          let seededLocks = 0;
          for (const r of reviewsData) {
            if (r.clientId && r.reviewText && now - (r.timestamp || 0) <= TWENTY_FOUR_HOURS) {
              await UsedReview.findOneAndUpdate(
                { clientId: r.clientId, normalized: r.normalized || r.reviewText.toLowerCase() },
                {
                  clientId: r.clientId,
                  reviewText: r.reviewText,
                  normalized: r.normalized || r.reviewText.toLowerCase(),
                  timestamp: r.timestamp || now,
                  expiresAt: new Date((r.timestamp || now) + TWENTY_FOUR_HOURS),
                },
                { upsert: true }
              );
              seededLocks++;
            }
          }
          console.log(`🔒 Seeded ${seededLocks} active 24-hr review locks from used_reviews.json`);
        }
      } catch (e) {
        console.error('Error reading used_reviews.json:', e);
      }
    }

    console.log('\n🎉 Database initialization and seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
