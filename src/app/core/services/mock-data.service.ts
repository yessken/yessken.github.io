import { Injectable } from '@angular/core';
import { EventItem, Ticket } from '../types/event.model';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private events: EventItem[] = [
    {
      id: '1',
      title: 'Ночной концерт в столице',
      description: 'Живая музыка, бар, танцы до утра. Возраст 18+.',
      date: '2025-03-15',
      time: '22:00',
      place: 'Клуб «Астана»',
      address: 'ул. Кенесары, 40',
      lat: 51.1605,
      lng: 71.4704,
      category: 'концерт',
      price: 3500,
      imageUrl: 'https://picsum.photos/400/200?random=1',
      organizerName: 'Астана Events',
    },
    {
      id: '2',
      title: 'Джаз под звёздами',
      description: 'Открытая площадка, джаз-бэнд, коктейли.',
      date: '2025-03-20',
      time: '20:00',
      place: 'Парк Первого Президента',
      address: 'пр. Республики',
      lat: 51.1252,
      lng: 71.4305,
      category: 'концерт',
      price: 0,
      imageUrl: 'https://picsum.photos/400/200?random=2',
      organizerName: 'Jazz Astana',
    },
    {
      id: '3',
      title: 'Техно-вечеринка',
      description: 'DJ-сет, два этажа, лаунж и танцпол.',
      date: '2025-03-22',
      time: '23:00',
      place: 'Лофт «Сходка»',
      address: 'ул. Сыганак, 12',
      lat: 51.1694,
      lng: 71.4494,
      category: 'вечеринка',
      price: 5000,
      imageUrl: 'https://picsum.photos/400/200?random=3',
      organizerName: 'Loft Club',
    },
    {
      id: '4',
      title: 'Stand-up вечер',
      description: 'Стендап комики из Астаны и Алматы.',
      date: '2025-03-18',
      time: '19:00',
      place: 'Театр «Жастар»',
      address: 'ул. Есенберлина, 10',
      lat: 51.1489,
      lng: 71.4369,
      category: 'развлечения',
      price: 2500,
      imageUrl: 'https://picsum.photos/400/200?random=4',
      organizerName: 'Comedy Astana',
    },
  ];

  /** В моках: какие сходки «текущий пользователь» отметил «Я пойду» */
  private userGoingEventIds = new Set<string>();

  private tickets: Ticket[] = [
    {
      id: 't1',
      eventId: '1',
      eventTitle: 'Ночной концерт в столице',
      eventDate: '2025-03-15',
      eventPlace: 'Клуб «Астана»',
      qrCode: 'TUSA-T1-XXXX',
      purchasedAt: '2025-03-01T12:00:00',
    },
  ];

  getEvents(): EventItem[] {
    return [...this.events];
  }

  getEventById(id: string): EventItem | undefined {
    const ev = this.events.find((e) => e.id === id);
    if (!ev) return ev;
    const userGoing = this.userGoingEventIds.has(id);
    return { ...ev, goingCount: userGoing ? 1 : 0, userGoing };
  }

  setGoing(eventId: string): { goingCount: number; userGoing: boolean } {
    if (this.userGoingEventIds.has(eventId)) {
      this.userGoingEventIds.delete(eventId);
      return { goingCount: 0, userGoing: false };
    }
    this.userGoingEventIds.add(eventId);
    return { goingCount: 1, userGoing: true };
  }

  getTickets(): Ticket[] {
    return [...this.tickets];
  }

  addEvent(event: Omit<EventItem, 'id'>): EventItem {
    const newEvent: EventItem = {
      ...event,
      id: String(this.events.length + 1),
    };
    this.events.push(newEvent);
    return newEvent;
  }

  addTicket(ticket: Omit<Ticket, 'id' | 'purchasedAt'>): Ticket {
    const newTicket: Ticket = {
      ...ticket,
      id: 't' + (this.tickets.length + 1),
      purchasedAt: new Date().toISOString(),
    };
    this.tickets.push(newTicket);
    return newTicket;
  }
}
