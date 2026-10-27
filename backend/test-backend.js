require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./src/app');

const TEST_PORT = 5005;

async function runTests() {
  console.log('🧪 Starting backend endpoint verification tests...\n');

  // Connect to DB
  const testMongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/review_management';
  await mongoose.connect(testMongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  const baseUrl = `http://127.0.0.1:${TEST_PORT}`;
  console.log(`📡 Test server running at ${baseUrl}`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    console.log('\n--- 1. Health & Root ---');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 and ok');
    assert(healthData.database.status === 'connected', 'Database status is connected');

    // 2. Auth Login (Seed user)
    console.log('\n--- 2. Auth Endpoints ---');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin@123' }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.success === true, 'POST /api/auth/login succeeds with seeded credentials');
    assert(Boolean(loginData.token), 'JWT token returned in login response');
    const jwtToken = loginData.token;

    // 3. Auth Failed Login
    const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
    });
    assert(badLoginRes.status === 401, 'POST /api/auth/login rejects invalid password with 401');

    // 4. Auth /api/auth/me with Bearer token
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user.username === 'admin', 'GET /api/auth/me returns admin user with valid JWT');

    // 5. Auth /api/auth/me without token
    const noTokenRes = await fetch(`${baseUrl}/api/auth/me`);
    assert(noTokenRes.status === 401, 'GET /api/auth/me rejects unauthenticated request with 401');

    // 5b. Auth /api/auth/logout
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' });
    const logoutData = await logoutRes.json();
    assert(logoutRes.status === 200 && logoutData.success === true, 'POST /api/auth/logout returns 200 and success');

    // 6. Clients - GET all clients
    console.log('\n--- 3. Client Endpoints ---');
    const clientsRes = await fetch(`${baseUrl}/api/clients`);
    const clientsData = await clientsRes.json();
    assert(clientsRes.status === 200 && clientsData.success === true, 'GET /api/clients returns success');
    assert(clientsData.clients.length >= 6, `GET /api/clients returns seeded clients (count: ${clientsData.clients.length})`);

    // 7. Clients - GET by custom ID
    const singleClientRes = await fetch(`${baseUrl}/api/clients/client_1`);
    const singleClientData = await singleClientRes.json();
    assert(singleClientRes.status === 200 && singleClientData.client.id === 'client_1', 'GET /api/clients/client_1 finds client_1');

    // 8. Clients - Query param ?id=client_2 (frontend compatibility)
    const queryParamRes = await fetch(`${baseUrl}/api/clients?id=client_2`);
    const queryParamData = await queryParamRes.json();
    assert(queryParamRes.status === 200 && queryParamData.client.id === 'client_2', 'GET /api/clients?id=client_2 works for legacy frontend calls');

    // 9. Clients - Create new client
    const testClientId = `test_client_${Date.now()}`;
    const createClientRes = await fetch(`${baseUrl}/api/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        id: testClientId,
        name: 'Apollo Hospital Ahmedabad',
        category: 'healthcare',
        city: 'Ahmedabad',
        google_url: 'https://g.page/r/test/review',
        phone: '919876500000',
        keywords: 'Cardiology, Emergency, ICU',
        default_lang: 'gu',
        start_date: '2026-10-01',
        expiry_date: '2027-10-01',
      }),
    });
    const createClientData = await createClientRes.json();
    assert(createClientRes.status === 201 && createClientData.client.id === testClientId, 'POST /api/clients creates client successfully');

    // 10. Clients - Update client
    const updateClientRes = await fetch(`${baseUrl}/api/clients/${testClientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ city: 'Gandhinagar' }),
    });
    const updateClientData = await updateClientRes.json();
    assert(updateClientRes.status === 200 && updateClientData.client.city === 'Gandhinagar', 'PUT /api/clients/:id updates client city');

    // 11. Clients - Delete client
    const deleteClientRes = await fetch(`${baseUrl}/api/clients/${testClientId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    assert(deleteClientRes.status === 200, 'DELETE /api/clients/:id deletes client with 200');

    // 12. Leads - Create lead
    console.log('\n--- 4. Lead Endpoints ---');
    const testLeadId = `lead_test_${Date.now()}`;
    const createLeadRes = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testLeadId,
        name: 'Ketan Patel',
        business: 'Patel Orthopedic Clinic',
        city: 'Surat',
        industry: 'Healthcare',
        phone: '919876543210',
      }),
    });
    const createLeadData = await createLeadRes.json();
    assert(createLeadRes.status === 201 && createLeadData.lead.id === testLeadId, 'POST /api/leads creates lead inquiry');

    // 13. Leads - GET leads
    const getLeadsRes = await fetch(`${baseUrl}/api/leads`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const getLeadsData = await getLeadsRes.json();
    assert(getLeadsRes.status === 200 && getLeadsData.leads.some((l) => l.id === testLeadId), 'GET /api/leads lists the submitted lead');

    // 14. Leads - DELETE lead
    const deleteLeadRes = await fetch(`${baseUrl}/api/leads/${testLeadId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    assert(deleteLeadRes.status === 200, 'DELETE /api/leads/:id deletes lead');

    // 15. Settings - GET settings
    console.log('\n--- 5. Settings Endpoints ---');
    const settingsRes = await fetch(`${baseUrl}/api/settings`);
    const settingsData = await settingsRes.json();
    assert(settingsRes.status === 200 && Boolean(settingsData.settings.agencyPhone), 'GET /api/settings returns agency phone');

    // 16. Reviews - Lock review (POST /api/reviews)
    console.log('\n--- 6. Reviews (24-hr Anti-repetition Lock) ---');
    const testReviewText = `Exceptional service and caring staff at hospital ${Date.now()}`;
    const lockReviewRes = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: 'client_1',
        reviewText: testReviewText,
      }),
    });
    const lockReviewData = await lockReviewRes.json();
    assert(lockReviewRes.status === 201 && lockReviewData.success === true, 'POST /api/reviews locks review for 24h');

    // 17. Reviews - GET used reviews for client
    const getUsedRes = await fetch(`${baseUrl}/api/reviews?clientId=client_1`);
    const getUsedData = await getUsedRes.json();
    assert(getUsedRes.status === 200 && getUsedData.usedReviews.includes(testReviewText), 'GET /api/reviews?clientId=client_1 includes locked review');

    console.log(`\n===========================================`);
    console.log(`🏁 All tests completed: ${passed} Passed, ${failed} Failed`);
    console.log(`===========================================\n`);
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    await mongoose.disconnect();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
