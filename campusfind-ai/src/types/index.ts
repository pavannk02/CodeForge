// ──────────────────────────────────────────
// CampusFind AI — Shared Types
// ──────────────────────────────────────────

export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  student_id?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  account_status: 'active' | 'suspended';
}

export type ItemType = 'LOST' | 'FOUND';

export type ItemStatus = 'ACTIVE' | 'MATCHED' | 'CLAIM_PENDING' | 'RETURNED' | 'CLOSED' | 'REJECTED';

export type ItemCategory =
  | 'Electronics'
  | 'Documents / ID Cards'
  | 'Bags'
  | 'Accessories'
  | 'Books'
  | 'Clothing'
  | 'Bottles'
  | 'Keys'
  | 'Wallets'
  | 'Other';

export type CampusLocation =
  | 'Main Building'
  | 'Library'
  | 'Canteen'
  | 'Computer Lab'
  | 'Laboratory'
  | 'Auditorium'
  | 'Sports Ground'
  | 'Parking Area'
  | 'Hostel'
  | 'Other';

export interface Item {
  id: string;
  user_id: string;
  type: ItemType;
  item_name: string;
  category: ItemCategory;
  description: string;
  colour: string;
  location: CampusLocation;
  item_date: string;
  approximate_time?: string;
  image_url?: string;
  private_details?: string;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
  // Joined
  user?: UserProfile;
}

export type MatchStatus = 'PENDING' | 'VIEWED' | 'DISMISSED';

export interface Match {
  id: string;
  lost_item_id: string;
  found_item_id: string;
  similarity_score: number;
  description_score: number;
  category_score: number;
  location_score: number;
  date_score: number;
  match_reasons: string[];
  status: MatchStatus;
  created_at: string;
  // Joined
  lost_item?: Item;
  found_item?: Item;
}

export type RecoveryStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'MEETING_SCHEDULED'
  | 'VERIFICATION_PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface RecoveryRequest {
  id: string;
  lost_item_id: string;
  found_item_id: string;
  owner_id: string;
  finder_id: string;
  status: RecoveryStatus;
  meeting_location?: string;
  meeting_date?: string;
  meeting_time?: string;
  owner_confirmed: boolean;
  finder_confirmed: boolean;
  admin_verified: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  lost_item?: Item;
  found_item?: Item;
  owner?: UserProfile;
  finder?: UserProfile;
}

export type NotificationType =
  | 'MATCH_FOUND'
  | 'RECOVERY_REQUESTED'
  | 'RECOVERY_ACCEPTED'
  | 'RECOVERY_REJECTED'
  | 'MEETING_SCHEDULED'
  | 'MEETING_CHANGED'
  | 'VERIFICATION_REQUIRED'
  | 'ITEM_RETURNED';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  related_item_id?: string;
  related_request_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_id: string;
  description: string;
  created_at: string;
}

// UI helpers
export interface StatsCard {
  label: string;
  value: number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

