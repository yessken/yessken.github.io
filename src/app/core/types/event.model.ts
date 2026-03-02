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
