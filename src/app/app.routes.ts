import { Routes } from '@angular/router';
import { MapComponent } from './features/map/map.component';
import { EventsListComponent } from './features/events-list/events-list.component';
import { EventDetailComponent } from './features/event-detail/event-detail.component';
import { BuyTicketComponent } from './features/buy-ticket/buy-ticket.component';
import { MyTicketsComponent } from './features/my-tickets/my-tickets.component';
import { CreateEventComponent } from './features/create-event/create-event.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  { path: '', component: MapComponent },
  { path: 'events', component: EventsListComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'events/:id/buy', component: BuyTicketComponent },
  { path: 'my-tickets', component: MyTicketsComponent },
  { path: 'create-event', component: CreateEventComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' },
];
