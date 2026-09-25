export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  place: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  price: number | null;
  imageUrl: string;
  organizerName: string;
  organizerEmail?: string;
  organizerPhone?: string;
  featured?: boolean;
  featuredUntil?: string;
  /** Количество человек, которые нажали «Я пойду» (приходит с API) */
  goingCount?: number;
  /** Текущий пользователь нажал «Я пойду» (приходит с API) */
  userGoing?: boolean;
  ticketCategories?: TicketCategory[];
}

export interface TicketCategory {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  capacity: number;
  sold: number;
  isActive: boolean;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventPlace: string;
  qrCode?: string;
  purchasedAt: string;
  paymentMethod?: 'kaspi' | 'telegram';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
  ticketCategoryId?: string;
  ticketCategoryName?: string;
  quantity?: number;
  baseAmount?: number;
  discountAmount?: number;
  commissionAmount?: number;
  totalAmount?: number;
  promoCode?: string;
}

export interface TelegramGroupItem {
  id: string;
  title: string;
  username?: string;
  inviteLink: string;
  memberCount: number;
}

export interface OrganizerOrderRow {
  ticketId: string;
  eventId: string;
  eventTitle: string;
  paymentStatus: string;
  paymentMethod: string;
  quantity: number;
  totalAmount: number;
  purchasedAt: string;
}

export interface AdminEventReport {
  eventId: string;
  eventTitle: string;
  orders: number;
  tickets: number;
  paid: number;
  pending: number;
  revenue: number;
}

export interface OrganizerSubscriptionStatus {
  telegramUserId: number;
  plan: string;
  status: string;
  expiresAt?: string | null;
}
