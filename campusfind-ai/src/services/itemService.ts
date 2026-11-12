// ──────────────────────────────────────────
// Item Service — Supabase + Demo fallback
// ──────────────────────────────────────────
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Item, ItemType, Match, RecoveryRequest, Notification as AppNotification } from '@/types';
import { findMatches } from '@/utils/matchingAlgorithm';

// ─── Demo Data Store (in-memory, for local dev) ──────────
const demoItems: Item[] = [
  {
    id: 'demo-item-1',
    user_id: 'demo-student-1',
    type: 'LOST',
    item_name: 'Black Leather Wallet',
    category: 'Wallets',
    description: 'Black leather bi-fold wallet with college ID, ATM card, and some cash. Has a small scratch on the front.',
    colour: 'Black',
    location: 'Library',
    item_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    private_details: 'Has a photo of my dog inside. Contains student ID CS2024001.',
  },
  {
    id: 'demo-item-2',
    user_id: 'demo-student-2',
    type: 'FOUND',
    item_name: 'Black Wallet',
    category: 'Wallets',
    description: 'Found a black leather wallet near the library entrance. Contains some cards and cash.',
    colour: 'Black',
    location: 'Library',
    item_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    private_details: 'Wallet has a small dog photo inside one of the card slots.',
  },
  {
    id: 'demo-item-3',
    user_id: 'demo-student-1',
    type: 'LOST',
    item_name: 'White AirPods Pro',
    category: 'Electronics',
    description: 'Lost my white AirPods Pro in their case. Case has a blue silicone cover.',
    colour: 'White',
    location: 'Canteen',
    item_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'demo-item-4',
    user_id: 'demo-student-2',
    type: 'FOUND',
    item_name: 'Blue Water Bottle',
    category: 'Bottles',
    description: 'Found a blue stainless steel water bottle near the sports ground. Has a sticker on it.',
    colour: 'Blue',
    location: 'Sports Ground',
    item_date: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-item-5',
    user_id: 'demo-student-2',
    type: 'FOUND',
    item_name: 'White Earbuds Case',
    category: 'Electronics',
    description: 'Found wireless earbuds in a white case near the canteen. Case has a blue cover.',
    colour: 'White',
    location: 'Canteen',
    item_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'demo-item-6',
    user_id: 'demo-student-1',
    type: 'LOST',
    item_name: 'Red Backpack',
    category: 'Bags',
    description: 'Lost a red Wildcraft backpack with laptop, notebooks, and charger inside.',
    colour: 'Red',
    location: 'Computer Lab',
    item_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const demoMatches: Match[] = [];
const demoRecoveryRequests: RecoveryRequest[] = [];
const demoNotifications: AppNotification[] = [
  {
    id: 'demo-notif-1',
    user_id: 'demo-student-1',
    title: 'Potential Match Found!',
    message: 'We found a potential match for your "Black Leather Wallet". Check your AI Matches.',
    type: 'MATCH_FOUND',
    related_item_id: 'demo-item-1',
    is_read: false,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'demo-notif-2',
    user_id: 'demo-student-1',
    title: 'Potential Match Found!',
    message: 'We found a potential match for your "White AirPods Pro". Check your AI Matches.',
    type: 'MATCH_FOUND',
    related_item_id: 'demo-item-3',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

// Initialize demo matches
function initDemoMatches() {
  if (demoMatches.length > 0) return;
  const lostItems = demoItems.filter(i => i.type === 'LOST');
  lostItems.forEach(lost => {
    const matches = findMatches(lost, demoItems, 30);
    matches.forEach((m, idx) => {
      demoMatches.push({
        ...m,
        id: `demo-match-${lost.id}-${idx}`,
        created_at: new Date().toISOString(),
      } as Match);
    });
  });
}

// ─── Service Functions ───────────────────────────────────

export async function getItems(filters?: {
  type?: ItemType;
  category?: string;
  location?: string;
  status?: string;
  userId?: string;
  search?: string;
}): Promise<Item[]> {
  if (!isSupabaseConfigured()) {
    let items = [...demoItems];
    if (filters?.type) items = items.filter(i => i.type === filters.type);
    if (filters?.category) items = items.filter(i => i.category === filters.category);
    if (filters?.location) items = items.filter(i => i.location === filters.location);
    if (filters?.status) items = items.filter(i => i.status === filters.status);
    if (filters?.userId) items = items.filter(i => i.user_id === filters.userId);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(i =>
        i.item_name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }
    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  let query = supabase.from('items').select('*, user:profiles(*)');
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.location) query = query.eq('location', filters.location);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.userId) query = query.eq('user_id', filters.userId);
  if (filters?.search) query = query.or(`item_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getItem(id: string): Promise<Item | null> {
  if (!isSupabaseConfigured()) {
    return demoItems.find(i => i.id === id) || null;
  }
  const { data, error } = await supabase
    .from('items')
    .select('*, user:profiles(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function createItem(item: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item> {
  if (!isSupabaseConfigured()) {
    const newItem: Item = {
      ...item,
      id: `demo-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    demoItems.unshift(newItem);

    // Trigger matching
    const matches = findMatches(newItem, demoItems, 30);
    matches.forEach((m, idx) => {
      demoMatches.push({
        ...m,
        id: `demo-match-${newItem.id}-${idx}`,
        created_at: new Date().toISOString(),
      } as Match);
    });

    return newItem;
  }

  const { data, error } = await supabase.from('items').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateItem(id: string, updates: Partial<Item>): Promise<void> {
  if (!isSupabaseConfigured()) {
    const idx = demoItems.findIndex(i => i.id === id);
    if (idx >= 0) Object.assign(demoItems[idx], updates, { updated_at: new Date().toISOString() });
    return;
  }
  const { error } = await supabase.from('items').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function uploadImage(file: File, itemId: string): Promise<string> {
  if (!isSupabaseConfigured()) {
    return URL.createObjectURL(file); // local blob URL for demo
  }
  const ext = file.name.split('.').pop();
  const path = `items/${itemId}.${ext}`;
  const { error } = await supabase.storage.from('item-images').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('item-images').getPublicUrl(path);
  return data.publicUrl;
}

// ─── Matches ─────────────────────────────────────────────
export async function getMatches(userId?: string): Promise<Match[]> {
  if (!isSupabaseConfigured()) {
    initDemoMatches();
    let matches = [...demoMatches];
    if (userId) {
      const userItemIds = demoItems.filter(i => i.user_id === userId).map(i => i.id);
      matches = matches.filter(m =>
        userItemIds.includes(m.lost_item_id) || userItemIds.includes(m.found_item_id)
      );
    }
    // Attach items
    return matches.map(m => ({
      ...m,
      lost_item: demoItems.find(i => i.id === m.lost_item_id),
      found_item: demoItems.find(i => i.id === m.found_item_id),
    })).sort((a, b) => b.similarity_score - a.similarity_score);
  }

  let query = supabase.from('matches').select('*, lost_item:items!lost_item_id(*), found_item:items!found_item_id(*)');
  const { data, error } = await query.order('similarity_score', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ─── Recovery Requests ───────────────────────────────────
export async function getRecoveryRequests(userId?: string): Promise<RecoveryRequest[]> {
  if (!isSupabaseConfigured()) {
    let reqs = [...demoRecoveryRequests];
    if (userId) {
      reqs = reqs.filter(r => r.owner_id === userId || r.finder_id === userId);
    }
    return reqs.map(r => ({
      ...r,
      lost_item: demoItems.find(i => i.id === r.lost_item_id),
      found_item: demoItems.find(i => i.id === r.found_item_id),
    }));
  }

  let query = supabase.from('recovery_requests')
    .select('*, lost_item:items!lost_item_id(*), found_item:items!found_item_id(*), owner:profiles!owner_id(*), finder:profiles!finder_id(*)');
  if (userId) query = query.or(`owner_id.eq.${userId},finder_id.eq.${userId}`);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createRecoveryRequest(req: {
  lost_item_id: string;
  found_item_id: string;
  owner_id: string;
  finder_id: string;
}): Promise<RecoveryRequest> {
  if (!isSupabaseConfigured()) {
    const newReq: RecoveryRequest = {
      ...req,
      id: `demo-recovery-${Date.now()}`,
      status: 'REQUESTED',
      owner_confirmed: false,
      finder_confirmed: false,
      admin_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    demoRecoveryRequests.push(newReq);
    // Notification
    demoNotifications.push({
      id: `demo-notif-${Date.now()}`,
      user_id: req.finder_id,
      title: 'Recovery Request Received',
      message: 'Someone claims the item you found. Check Recovery Requests.',
      type: 'RECOVERY_REQUESTED',
      related_request_id: newReq.id,
      is_read: false,
      created_at: new Date().toISOString(),
    });
    return newReq;
  }

  const { data, error } = await supabase.from('recovery_requests')
    .insert({ ...req, status: 'REQUESTED', owner_confirmed: false, finder_confirmed: false, admin_verified: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateRecoveryRequest(id: string, updates: Partial<RecoveryRequest>): Promise<void> {
  if (!isSupabaseConfigured()) {
    const idx = demoRecoveryRequests.findIndex(r => r.id === id);
    if (idx >= 0) Object.assign(demoRecoveryRequests[idx], updates, { updated_at: new Date().toISOString() });
    return;
  }
  const { error } = await supabase.from('recovery_requests').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

// ─── Notifications ───────────────────────────────────────
export async function getNotifications(userId: string): Promise<AppNotification[]> {
  if (!isSupabaseConfigured()) {
    return demoNotifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function markNotificationRead(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const n = demoNotifications.find(n => n.id === id);
    if (n) n.is_read = true;
    return;
  }
  await supabase.from('notifications').update({ is_read: true }).eq('id', id);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    demoNotifications.filter(n => n.user_id === userId).forEach(n => { n.is_read = true; });
    return;
  }
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
}

// ─── Dashboard Stats ─────────────────────────────────────
export async function getDashboardStats(userId?: string) {
  const items = await getItems(userId ? { userId } : undefined);
  const matches = await getMatches(userId);
  const recoveries = await getRecoveryRequests(userId);

  return {
    totalReports: items.length,
    lostItems: items.filter(i => i.type === 'LOST').length,
    foundItems: items.filter(i => i.type === 'FOUND').length,
    potentialMatches: matches.length,
    pendingRequests: recoveries.filter(r => ['REQUESTED', 'ACCEPTED', 'MEETING_SCHEDULED'].includes(r.status)).length,
    completedRecoveries: recoveries.filter(r => r.status === 'COMPLETED').length,
    disputed: recoveries.filter(r => r.status === 'DISPUTED').length,
    recentItems: items.slice(0, 5),
    recentRecoveries: recoveries.slice(0, 5),
  };
}

