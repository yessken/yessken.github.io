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
  /** Количество человек, которые нажали «Я пойду» (приходит с API) */
  goingCount?: number;
  /** Текущий пользователь нажал «Я пойду» (приходит с API) */
  userGoing?: boolean;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventPlace: string;
  qrCode?: string;
  purchasedAt: string;
}

export interface TelegramGroupItem {
  id: string;
  title: string;
  username?: string;
  inviteLink: string;
  memberCount: number;
}
