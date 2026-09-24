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
      <header class="form-hero">
        <span class="eyebrow">TUSA / ДЛЯ ОРГАНИЗАТОРОВ</span>
        <h1>Пусть о вашем событии<br /><em>узнают.</em></h1>
        <p class="intro">Разместите ближайшее событие в каталоге Астаны. Мы проверим заявку, подготовим страницу и отправим вам ссылку для публикации.</p>
        <div class="quick-start" aria-label="Быстрый шаблон события">
          <span>Быстрый старт</span>
          <button type="button" (click)="applyTemplate('concert')">Концерт</button>
          <button type="button" (click)="applyTemplate('party')">Вечеринка</button>
          <button type="button" (click)="applyTemplate('comedy')">Стендап</button>
        </div>
        <div class="offer">
          <span class="offer-mark">01</span>
          <div><strong>Первое размещение бесплатно</strong><small>Без подписки и обязательств. Свяжемся после проверки заявки.</small></div>
        </div>
      </header>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <section class="form-section">
          <div class="section-heading"><span>01</span><div><h2>О событии</h2><p>Расскажите, что произойдет и почему стоит прийти.</p></div></div>
          <div class="field-grid">
            <label class="wide">Название события <b>*</b><input formControlName="title" type="text" placeholder="Например, Jazz под звёздами" /></label>
            <label class="wide">Описание <textarea formControlName="description" rows="4" placeholder="Коротко: программа, атмосфера, для кого событие"></textarea></label>
            <label>Дата <b>*</b><input formControlName="date" type="date" /></label>
            <label>Время <input formControlName="time" type="time" /></label>
            <label>Категория <select formControlName="category"><option value="концерт">Концерт</option><option value="вечеринка">Вечеринка</option><option value="развлечения">Развлечения</option></select></label>
            <label>Цена входа, ₸<input formControlName="price" type="number" min="0" placeholder="0 — бесплатно" /></label>
          </div>
        </section>
        <section class="form-section">
          <div class="section-heading"><span>02</span><div><h2>Место и обложка</h2><p>Помогите гостям быстро понять, куда ехать.</p></div></div>
          <div class="field-grid">
            <label>Площадка <b>*</b><input formControlName="place" type="text" placeholder="Название клуба или площадки" /></label>
            <label class="address-field">Адрес
              <input formControlName="address" type="text" autocomplete="street-address" (input)="searchAddress()" placeholder="Начните вводить адрес в Астане" />
              @if (addressLoading()) { <small class="field-hint">Ищем адрес…</small> }
              @if (addressSuggestions().length) { <div class="suggestions">@for (suggestion of addressSuggestions(); track suggestion.display_name) { <button type="button" (click)="selectAddress(suggestion)">{{ suggestion.display_name }}</button> }</div> }
            </label>
            <label class="wide">Обложка события <span class="optional">необязательно</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" (change)="selectImage($event)" />
              @if (imagePreview()) { <img class="image-preview" [src]="imagePreview()" alt="Предпросмотр обложки" /> }
              @if (imageError()) { <small class="field-error">{{ imageError() }}</small> }
            </label>
          </div>
        </section>
        <section class="form-section">
          <div class="section-heading"><span>03</span><div><h2>Билеты</h2><p>Добавьте тарифы, если вход платный или мест ограничено.</p></div></div>
          <fieldset formArrayName="ticketCategories">
            <legend>Тарифы и количество мест</legend>
            @for (category of ticketCategories.controls; track category; let index = $index) {
              <div class="ticket-tier" [formGroupName]="index">
                <input formControlName="name" placeholder="Название тарифа" aria-label="Название тарифа" />
                <input formControlName="price" type="number" min="0" placeholder="Цена, ₸" aria-label="Цена тарифа" />
                <input formControlName="capacity" type="number" min="1" placeholder="Мест" aria-label="Лимит тарифа" />
              </div>
            }
            <button type="button" class="add-tier" (click)="addTicketCategory()">+ Добавить тариф</button>
          </fieldset>
        </section>
        <section class="form-section">
          <div class="section-heading"><span>04</span><div><h2>Как с вами связаться</h2><p>Нужны только рабочие контакты для уточнения деталей.</p></div></div>
          <div class="field-grid">
            <label>Имя или команда <input formControlName="organizerName" type="text" placeholder="Как к вам обращаться" /></label>
            <label>Email <input formControlName="organizerEmail" type="email" placeholder="name@example.com" /></label>
            <label>Телефон <input formControlName="organizerPhone" type="tel" placeholder="+7 700 000 00 00" /></label>
          </div>
        </section>
        <div class="submit-panel">
          <label class="toggle-row"><input type="checkbox" formControlName="featured" /><span>Рассмотреть промо-размещение в подборке</span></label>
          <button type="submit" [disabled]="form.invalid || submitting()">{{ submitting() ? 'Отправляем заявку…' : 'Отправить заявку' }} <span aria-hidden="true">→</span></button>
          <small>Нажимая кнопку, вы отправляете заявку на модерацию TUSA.</small>
        </div>
      </form>
      @if (success()) { <p class="success">Заявка отправлена. Мы свяжемся с вами после проверки.</p> }
      @if (submitError()) { <p class="field-error submit-error">Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.</p> }
    </div>
  `,
  styles: [
    `
      .create-event { max-width: 900px; padding: 2rem 1.25rem 6rem; margin: 0 auto; }
      .form-hero { padding: 1rem 0 2rem; }
      .eyebrow { color: var(--tg-button, #d7f36b); font-size: .65rem; font-weight: 800; letter-spacing: .17em; }
      h1 { margin: .8rem 0 1rem; font-size: clamp(2.5rem, 9vw, 5rem); line-height: .92; font-weight: 500; }
      h1 em { color: var(--tg-button, #d7f36b); font-weight: 400; }
      .intro { max-width: 620px; margin: 0 0 1.2rem; opacity: .68; line-height: 1.55; font-size: .95rem; }
      .quick-start { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem; margin-bottom: 1.25rem; color: rgba(242,240,232,.5); font-size: .7rem; }
      .quick-start button { margin: 0; padding: .45rem .65rem; background: transparent; color: var(--tg-text); border: 1px solid rgba(242,240,232,.18); box-shadow: none; border-radius: 999px; font-size: .72rem; font-weight: 600; }
      .quick-start button:hover { border-color: var(--tg-button); color: var(--tg-button); }
      .offer { display: flex; align-items: center; gap: .85rem; max-width: 540px; padding: .9rem 1rem; border: 1px solid rgba(215,243,107,.28); background: rgba(215,243,107,.06); border-radius: 4px; line-height: 1.35; }
      .offer-mark, .section-heading > span { color: var(--tg-button, #d7f36b); font-size: .68rem; font-weight: 800; letter-spacing: .1em; }
      .offer strong, .offer small { display: block; }
      .offer strong { font-size: .85rem; }
      .offer small { margin-top: .18rem; color: rgba(242,240,232,.6); font-size: .75rem; }
      form { display: grid; gap: 1rem; }
      .form-section { padding: 1.35rem 0; border-top: 1px solid rgba(242,240,232,.12); }
      .section-heading { display: grid; grid-template-columns: 2rem 1fr; gap: .7rem; margin-bottom: 1.15rem; }
      .section-heading h2 { margin: 0; font-size: 1.3rem; font-weight: 500; }
      .section-heading p { margin: .3rem 0 0; color: rgba(242,240,232,.55); font-size: .78rem; line-height: 1.4; }
      .field-grid { display: grid; gap: .85rem; }
      label { display: flex; flex-direction: column; gap: .35rem; color: rgba(242,240,232,.78); font-size: .78rem; font-weight: 700; }
      label b { color: var(--tg-button, #d7f36b); font-weight: 700; }
      .optional { color: rgba(242,240,232,.4); font-size: .68rem; font-weight: 400; }
      input, textarea, select { width: 100%; box-sizing: border-box; padding: .78rem .8rem; color: var(--tg-text, #f2f0e8); background: rgba(255,255,255,.045); border: 1px solid rgba(242,240,232,.16); border-radius: 3px; font: inherit; font-weight: 400; outline: none; }
      textarea { resize: vertical; min-height: 100px; }
      input::placeholder, textarea::placeholder { color: rgba(242,240,232,.3); }
      input:focus, textarea:focus, select:focus { border-color: var(--tg-button, #d7f36b); box-shadow: 0 0 0 3px rgba(215,243,107,.1); }
      .address-field { position: relative; }
      .suggestions { position: absolute; left: 0; right: 0; top: 100%; z-index: 10; background: var(--tg-surface, #252529); border: 1px solid rgba(255,255,255,.15); border-radius: 6px; overflow: hidden; }
      .suggestions button { width: 100%; margin: 0; padding: .65rem; text-align: left; background: transparent; color: var(--tg-text, #e4e4e7); box-shadow: none; border: 0; border-radius: 0; font-size: .8rem; }
      .suggestions button:hover { background: rgba(215,243,107,.08); }
      .image-preview { display: block; width: 100%; max-height: 220px; object-fit: cover; margin-top: .5rem; border-radius: 3px; }
      .field-hint { opacity: .65; font-size: .78rem; }
      .field-error { color: #f27b68; font-size: .78rem; }
      .toggle-row { display: flex; flex-direction: row; align-items: center; gap: .65rem; font-size: .78rem; font-weight: 400; }
      .toggle-row input { width: 1rem; height: 1rem; accent-color: var(--tg-button); }
      fieldset { border: 1px solid rgba(242,240,232,.14); border-radius: 3px; padding: 1rem; }
      legend { padding: 0 .35rem; font-size: .85rem; }
      .ticket-tier { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: .4rem; margin-bottom: .5rem; }
      .ticket-tier input { min-width: 0; }
      .add-tier { width: 100%; margin-top: .35rem; padding: .65rem; background: transparent; color: var(--tg-button, #d7f36b); box-shadow: none; border: 1px solid rgba(215,243,107,.45); font-size: .78rem; }
      button {
        padding: 0.85rem 1rem;
        background: var(--tg-button, #00FF41);
        color: var(--tg-button-text, #0a0a0c);
        box-shadow: var(--tg-glow, 0 0 12px #00FF41);
        border: none;
        border-radius: 3px;
        font-size: .9rem;
        font-weight: 800;
        cursor: pointer;
      }
      button:disabled { opacity: 0.6; cursor: not-allowed; }
      .submit-panel { display: grid; gap: .8rem; margin-top: .5rem; padding: 1.15rem; background: var(--tg-surface, #1c1e1d); border: 1px solid rgba(242,240,232,.1); border-radius: 3px; }
      .submit-panel button { justify-self: start; min-width: 220px; }
      .submit-panel button span { margin-left: .4rem; font-size: 1.1rem; }
      .submit-panel small { color: rgba(242,240,232,.4); font-size: .68rem; }
      .success { margin-top: 1rem; color: var(--tg-button, #d7f36b); }
      .submit-error { margin-top: 1rem; }
      @media (min-width: 700px) {
        .create-event { padding: 4.5rem clamp(2rem, 5vw, 5rem); }
        .form-hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, .55fr); column-gap: 4rem; align-items: end; padding-bottom: 3.5rem; }
        .eyebrow, h1, .intro, .quick-start { grid-column: 1; }
        .offer { grid-column: 2; grid-row: 2 / span 3; align-self: center; }
        .field-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .field-grid .wide { grid-column: 1 / -1; }
        .submit-panel { grid-template-columns: 1fr auto; align-items: center; }
        .submit-panel small { grid-column: 1 / -1; }
      }
      @media (max-width: 420px) { .ticket-tier { grid-template-columns: 1fr 1fr; } .ticket-tier input:first-child { grid-column: 1 / -1; } }
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
      organizerName: [this.savedContact('organizerName')],
      organizerEmail: [this.savedContact('organizerEmail'), Validators.email],
      organizerPhone: [this.savedContact('organizerPhone')],
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

  applyTemplate(template: 'concert' | 'party' | 'comedy'): void {
    const values = {
      concert: { category: 'концерт', time: '20:00', price: 3500, title: 'Живой концерт в Астане' },
      party: { category: 'вечеринка', time: '22:00', price: 5000, title: 'Вечеринка в Астане' },
      comedy: { category: 'развлечения', time: '19:00', price: 2500, title: 'Stand-up вечер' },
    }[template];
    this.form.patchValue(values);
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
    this.saveContact(v);
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

  private savedContact(key: 'organizerName' | 'organizerEmail' | 'organizerPhone'): string {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem(`tusa-${key}`) ?? '';
  }

  private saveContact(value: { organizerName?: string; organizerEmail?: string; organizerPhone?: string }): void {
    if (typeof localStorage === 'undefined') return;
    for (const key of ['organizerName', 'organizerEmail', 'organizerPhone'] as const) {
      if (value[key]) localStorage.setItem(`tusa-${key}`, value[key]);
    }
  }
}
