import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Client } from '../../../lib/types';

const filePath = path.join(process.cwd(), 'src', 'data', 'clients.json');
const tmpPath = path.join(os.tmpdir(), 'review_hub_clients.json');

// In-memory runtime cache for real DB clients
let memoryClients: Client[] = [];

function readClientsFromFile(): Client[] {
  try {
    if (fs.existsSync(tmpPath)) {
      const data = fs.readFileSync(tmpPath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryClients = parsed;
        return parsed;
      }
    }
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryClients = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading clients.json:', err);
  }
  return memoryClients;
}

function writeClientsToFile(clients: Client[]): boolean {
  memoryClients = clients;
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(clients, null, 2), 'utf-8');
    return true;
  } catch (err) {
    // Fallback for serverless read-only environments (e.g. Vercel)
    try {
      fs.writeFileSync(tmpPath, JSON.stringify(clients, null, 2), 'utf-8');
      return true;
    } catch (tmpErr) {
      console.error('Error writing clients fallback:', tmpErr);
    }
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const backendUrl = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

  // 1. Single client request
  if (id) {
    // Try live MongoDB backend first
    try {
      const backendRes = await fetch(`${backendUrl}/api/clients?id=${encodeURIComponent(id)}`, {
        signal: AbortSignal.timeout(3000),
        cache: 'no-store',
      });
      if (backendRes.ok) {
        const backendData = await backendRes.json();
        if (backendData && backendData.success && backendData.client) {
          return NextResponse.json({ success: true, client: backendData.client });
        }
      }
    } catch {}

    // Fallback to local DB cache
    const all = readClientsFromFile();
    const client = all.find((c) => c.id === id);
    if (client) {
      return NextResponse.json({ success: true, client });
    }
    return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
  }

  // 2. All clients request - Fetch live from MongoDB backend
  try {
    const backendRes = await fetch(`${backendUrl}/api/clients`, {
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
    });
    if (backendRes.ok) {
      const backendData = await backendRes.json();
      if (backendData && backendData.success && Array.isArray(backendData.clients)) {
        writeClientsToFile(backendData.clients);
        return NextResponse.json({
          success: true,
          count: backendData.clients.length,
          clients: backendData.clients,
        });
      }
    }
  } catch {}

  // Fallback to local cache from DB
  const all = readClientsFromFile();
  return NextResponse.json({ success: true, count: all.length, clients: all });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
    const authHeader = request.headers.get('authorization');

    // Forward to MongoDB Backend
    try {
      fetch(`${backendUrl}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
      }).catch(() => {});
    } catch {}

    if (Array.isArray(body)) {
      writeClientsToFile(body);
      return NextResponse.json({ success: true, count: body.length });
    } else if (body && body.id) {
      const current = readClientsFromFile();
      const idx = current.findIndex((c) => c.id === body.id);
      let updated: Client[];
      if (idx >= 0) {
        updated = current.map((c) => (c.id === body.id ? body : c));
      } else {
        updated = [body, ...current];
      }
      writeClientsToFile(updated);
      return NextResponse.json({ success: true, client: body });
    }
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (err) {
    console.error('API POST error:', err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
