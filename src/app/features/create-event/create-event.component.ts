import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="create-event">
      <h1>Для организаторов</h1>
      <p class="intro">Оставьте заявку, и мы подготовим страницу события, публикацию в Telegram и продажи билетов.</p>
      <div class="offer">
        <strong>Старт для первых организаторов</strong>
        <ul>
          <li>Первая публикация и настройка бесплатно</li>
          <li>Продвижение в подборке по согласованию</li>
          <li>Продажи билетов с комиссией только после оплаты</li>
        </ul>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Название <input formControlName="title" type="text" /></label>
        <label>Описание <textarea formControlName="description"></textarea></label>
        <label>Дата <input formControlName="date" type="date" /></label>
        <label>Время <input formControlName="time" type="time" /></label>
        <label>Место <input formControlName="place" type="text" /></label>
        <label class="address-field">Адрес
          <input formControlName="address" type="text" autocomplete="street-address" (input)="searchAddress()" placeholder="Начните вводить адрес в Астане" />
          @if (addressLoading()) { <small class="field-hint">Ищем адрес…</small> }
          @if (addressSuggestions().length) {
            <div class="suggestions">
              @for (suggestion of addressSuggestions(); track suggestion.display_name) {
                <button type="button" (click)="selectAddress(suggestion)">{{ suggestion.display_name }}</button>
              }
            </div>
          }
        </label>
        <label>Категория
          <select formControlName="category">
            <option value="концерт">Концерт</option>
            <option value="вечеринка">Вечеринка</option>
            <option value="развлечения">Развлечения</option>
          </select>
        </label>
        <label>Цена (₸), 0 = бесплатно <input formControlName="price" type="number" min="0" /></label>
        <label class="toggle-row">
          <input type="checkbox" formControlName="featured" />
          <span>Платное поднятие в подборке</span>
        </label>
        <label>Обложка события
          <input type="file" accept="image/png,image/jpeg,image/webp" (change)="selectImage($event)" />
          @if (imagePreview()) { <img class="image-preview" [src]="imagePreview()" alt="Предпросмотр обложки" /> }
          @if (imageError()) { <small class="field-error">{{ imageError() }}</small> }
        </label>
        <label>Имя организатора <input formControlName="organizerName" type="text" /></label>
        <label>Email для связи <input formControlName="organizerEmail" type="email" placeholder="name@example.com" /></label>
        <label>Телефон для связи <input formControlName="organizerPhone" type="tel" placeholder="+7 700 000 00 00" /></label>
        <fieldset formArrayName="ticketCategories">
          <legend>Тарифы билетов</legend>
          @for (category of ticketCategories.controls; track category; let index = $index) {
            <div class="ticket-tier" [formGroupName]="index">
              <input formControlName="name" placeholder="Например, VIP" aria-label="Название тарифа" />
              <input formControlName="price" type="number" min="0" placeholder="Цена, ₸" aria-label="Цена тарифа" />
              <input formControlName="capacity" type="number" min="1" placeholder="Количество мест" aria-label="Лимит тарифа" />
            </div>
          }
          <button type="button" class="add-tier" (click)="addTicketCategory()">Добавить тариф</button>
        </fieldset>
        <button type="submit" [disabled]="form.invalid || submitting()">{{ submitting() ? 'Отправляем…' : 'Отправить на проверку' }}</button>
      </form>
      @if (success()) {
        <p class="success">Заявка отправлена. Мы свяжемся с вами после проверки.</p>
      }
      @if (submitError()) { <p class="field-error submit-error">Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.</p> }
    </div>
  `,
  styles: [
    `
      .create-event { padding: 1.5rem; padding-bottom: 80px; max-width: 480px; }
      h1 { margin: 0 0 .5rem; font-size: 1.25rem; }
      .intro { margin: 0 0 1.25rem; opacity: .78; line-height: 1.45; font-size: .92rem; }
      .offer { display: flex; flex-direction: column; gap: .3rem; margin: 0 0 1.25rem; padding: .85rem; border-left: 3px solid var(--tg-button, #aabd7e); background: var(--tg-surface, #252529); border-radius: 0 8px 8px 0; font-size: .85rem; line-height: 1.4; }
      .offer span { opacity: .75; }
      .offer ul { display: grid; gap: .35rem; margin: .35rem 0 0; padding-left: 1.1rem; opacity: .78; }
      .offer li::marker { color: var(--tg-button, #aabd7e); }
      form { display: flex; flex-direction: column; gap: 0.75rem; }
      label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.9rem; }
      input, textarea, select { padding: 0.5rem; border-radius: 6px; border: 1px solid #ccc; }
      .address-field { position: relative; }
      .suggestions { position: absolute; left: 0; right: 0; top: 100%; z-index: 10; background: var(--tg-surface, #252529); border: 1px solid rgba(255,255,255,.15); border-radius: 6px; overflow: hidden; }
      .suggestions button { width: 100%; margin: 0; padding: .65rem; text-align: left; background: transparent; color: var(--tg-text, #e4e4e7); box-shadow: none; border-radius: 0; font-size: .8rem; }
      .image-preview { display: block; width: 100%; max-height: 180px; object-fit: cover; margin-top: .5rem; border-radius: 6px; }
      .field-hint { opacity: .65; font-size: .78rem; }
      .field-error { color: #f27b68; font-size: .78rem; }
      .toggle-row { display: flex; flex-direction: row; align-items: center; gap: .65rem; }
      .toggle-row input { width: 1rem; height: 1rem; }
      fieldset { border: 1px solid rgba(255,255,255,.14); border-radius: 8px; padding: .75rem; }
      legend { padding: 0 .35rem; font-size: .85rem; }
      .ticket-tier { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: .4rem; margin-bottom: .5rem; }
      .ticket-tier input { min-width: 0; }
      .add-tier { width: 100%; background: transparent; color: var(--tg-text, #e4e4e7); box-shadow: none; border: 1px solid var(--tg-button, #aabd7e); font-size: .85rem; }
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
      .submit-error { margin-top: 1rem; }
    `,
  ],
})
export class CreateEventComponent {
  form: FormGroup;
  success = signal(false);
  submitting = signal(false);
  submitError = signal(false);
  addressSuggestions = signal<Array<{ display_name: string; lat: string; lon: string }>>([]);
  imagePreview = signal('');
  addressLoading = signal(false);
  imageError = signal('');

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
      featured: [false],
      imageUrl: ['https://picsum.photos/400/200'],
      organizerName: ['Организатор'],
      organizerEmail: ['', Validators.email],
      organizerPhone: [''],
      ticketCategories: this.fb.array([this.createTicketCategory('Стандарт', 0, 100)]),
    });
  }

  get ticketCategories(): FormArray {
    return this.form.get('ticketCategories') as FormArray;
  }

  private createTicketCategory(name = '', price = 0, capacity = 100): FormGroup {
    return this.fb.group({
      name: [name, [Validators.required, Validators.maxLength(80)]],
      price: [price, [Validators.required, Validators.min(0)]],
      capacity: [capacity, [Validators.required, Validators.min(1)]],
    });
  }

  addTicketCategory(): void {
    this.ticketCategories.push(this.createTicketCategory());
  }

  async searchAddress(): Promise<void> {
    const query = String(this.form.get('address')?.value ?? '').trim();
    if (query.length < 3) { this.addressSuggestions.set([]); return; }
    this.addressLoading.set(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=kz&city=Astana&q=${encodeURIComponent(query)}`);
      if (response.ok) this.addressSuggestions.set(await response.json());
    } catch { this.addressSuggestions.set([]); }
    finally { this.addressLoading.set(false); }
  }

  selectAddress(suggestion: { display_name: string; lat: string; lon: string }): void {
    this.form.patchValue({ address: suggestion.display_name, lat: Number(suggestion.lat), lng: Number(suggestion.lon) });
    this.addressSuggestions.set([]);
  }

  selectImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.imageError.set('');
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { this.imageError.set('Файл должен быть меньше 5 МБ.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      this.imagePreview.set(dataUrl);
      this.form.patchValue({ imageUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.submitError.set(false);
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
      featured: Boolean(v.featured),
      imageUrl: v.imageUrl || 'https://picsum.photos/400/200',
      organizerName: v.organizerName,
      organizerEmail: v.organizerEmail,
      organizerPhone: v.organizerPhone,
      ticketCategories: v.ticketCategories.map((category: { name: string; price: number; capacity: number }) => ({
        id: '',
        eventId: '',
        name: category.name,
        price: Number(category.price),
        capacity: Number(category.capacity),
        sold: 0,
        isActive: true,
      })),
    }).subscribe((created) => {
      this.submitting.set(false);
      if (!created) { this.submitError.set(true); return; }
      this.success.set(true);
      setTimeout(() => this.router.navigate(['/events']), 1500);
    });
  }
}
