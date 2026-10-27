import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Client } from '../../../lib/types';
import { DEFAULT_CLIENTS } from '../../../lib/data';

const filePath = path.join(process.cwd(), 'src', 'data', 'clients.json');
const tmpPath = path.join(os.tmpdir(), 'review_hub_clients.json');

// In-memory fallback
let memoryClients: Client[] = [...DEFAULT_CLIENTS];

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
        DEFAULT_CLIENTS.forEach((dc) => {
          if (!parsed.some((c: Client) => c.id === dc.id)) {
            parsed.push(dc);
          }
        });
        memoryClients = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading clients.json:", err);
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
      console.error("Error writing clients fallback:", tmpErr);
    }
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const all = readClientsFromFile();

  if (id) {
    const client = all.find((c) => c.id === id) || DEFAULT_CLIENTS.find((c) => c.id === id);
    if (client) {
      return NextResponse.json({ success: true, client });
    }
    return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, clients: all });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body)) {
      writeClientsToFile(body);
      return NextResponse.json({ success: true, count: body.length });
    } else if (body && body.id) {
      // update or insert single client
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
    console.error("API POST error:", err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
