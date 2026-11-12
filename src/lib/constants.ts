export const CATEGORIES = [
  'Electronics',
  'Documents / ID Cards',
  'Bags',
  'Accessories',
  'Books',
  'Clothing',
  'Bottles',
  'Keys',
  'Wallets',
  'Other',
] as const;

export const CAMPUS_LOCATIONS = [
  'Main Building',
  'Library',
  'Canteen',
  'Computer Lab',
  'Laboratory',
  'Auditorium',
  'Sports Ground',
  'Parking Area',
  'Hostel',
  'Other',
] as const;

export const ITEM_COLOURS = [
  'Black',
  'White',
  'Blue',
  'Red',
  'Green',
  'Yellow',
  'Brown',
  'Grey',
  'Silver',
  'Gold',
  'Pink',
  'Purple',
  'Orange',
  'Multicolor',
  'Other',
] as const;

export const MEETING_LOCATIONS = [
  'College Security Office',
  'Main Reception',
  'Student Help Desk',
  'Library Front Desk',
  'Admin Block Lobby',
] as const;

export const RECOVERY_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  REQUESTED: { label: 'Pending', color: 'warning' },
  ACCEPTED: { label: 'Accepted', color: 'info' },
  REJECTED: { label: 'Rejected', color: 'danger' },
  MEETING_SCHEDULED: { label: 'Meeting Scheduled', color: 'info' },
  VERIFICATION_PENDING: { label: 'Verification', color: 'warning' },
  COMPLETED: { label: 'Completed', color: 'success' },
  CANCELLED: { label: 'Cancelled', color: 'neutral' },
  DISPUTED: { label: 'Disputed', color: 'danger' },
};

export const ITEM_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: 'success' },
  MATCHED: { label: 'Matched', color: 'info' },
  CLAIM_PENDING: { label: 'Claim Pending', color: 'warning' },
  RETURNED: { label: 'Returned', color: 'success' },
  CLOSED: { label: 'Closed', color: 'neutral' },
  REJECTED: { label: 'Rejected', color: 'danger' },
};

