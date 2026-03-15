import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="create-event">
      <h1>Создать сходку</h1>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Название <input formControlName="title" type="text" /></label>
        <label>Описание <textarea formControlName="description"></textarea></label>
        <label>Дата <input formControlName="date" type="date" /></label>
        <label>Время <input formControlName="time" type="time" /></label>
        <label>Место <input formControlName="place" type="text" /></label>
        <label>Адрес <input formControlName="address" type="text" /></label>
        <label>Широта <input formControlName="lat" type="number" step="any" /></label>
        <label>Долгота <input formControlName="lng" type="number" step="any" /></label>
        <label>Категория
          <select formControlName="category">
            <option value="концерт">Концерт</option>
            <option value="вечеринка">Вечеринка</option>
            <option value="развлечения">Развлечения</option>
          </select>
        </label>
        <label>Цена (₸), 0 = бесплатно <input formControlName="price" type="number" min="0" /></label>
        <label>URL обложки <input formControlName="imageUrl" type="url" /></label>
        <label>Имя организатора <input formControlName="organizerName" type="text" /></label>
        <button type="submit" [disabled]="form.invalid">Создать</button>
      </form>
      @if (success()) {
        <p class="success">Сходка создана. Переход к списку...</p>
      }
    </div>
  `,
  styles: [
    `
      .create-event { padding: 1.5rem; padding-bottom: 80px; max-width: 480px; }
      h1 { margin: 0 0 1rem; font-size: 1.25rem; }
      form { display: flex; flex-direction: column; gap: 0.75rem; }
      label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.9rem; }
      input, textarea, select { padding: 0.5rem; border-radius: 6px; border: 1px solid #ccc; }
      button {
        margin-top: 0.5rem;
        padding: 0.75rem;
        background: var(--tg-button, #00FF41);
        color: var(--tg-button-text, #0a0a0c);
        box-shadow: var(--tg-glow, 0 0 12px #00FF41);
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
      }
      button:disabled { opacity: 0.6; cursor: not-allowed; }
      .success { margin-top: 1rem; color: green; }
    `,
  ],
})
export class CreateEventComponent {
  form: FormGroup;
  success = signal(false);

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      time: ['20:00'],
      place: ['', Validators.required],
      address: [''],
      lat: [51.1694],
      lng: [71.4494],
      category: ['концерт'],
      price: [0],
      imageUrl: ['https://picsum.photos/400/200'],
      organizerName: ['Организатор'],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.data.createEvent({
      title: v.title,
      description: v.description,
      date: v.date,
      time: v.time,
      place: v.place,
      address: v.address,
      lat: Number(v.lat),
      lng: Number(v.lng),
      category: v.category,
      price: v.price ? Number(v.price) : null,
      imageUrl: v.imageUrl || 'https://picsum.photos/400/200',
      organizerName: v.organizerName,
    }).subscribe((created) => {
      this.success.set(true);
      setTimeout(() => this.router.navigate(['/events']), 1500);
    });
  }
}
