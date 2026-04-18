/**
 * Tab2Page - Add New Record + Featured Items
 *
 * Provides:
 *   - Reactive form to create a brand-new inventory record.
 *   - Strong validation (required fields, numeric constraints, enums).
 *   - List of current featured items (featureditem > 0) fetched from the
 *     backend.
 *
 * Author: Kangzhe Zhao
 */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonIcon,
  IonList,
  IonBadge,
  IonText,
  IonToggle,
  IonNote,
  IonSpinner,
  IonAccordion,
  IonAccordionGroup,
  ToastController
} from '@ionic/angular/standalone';

import { InventoryService } from '../services/inventory.service';
import {
  InventoryItem,
  ITEM_CATEGORIES,
  STOCK_STATUSES,
  ItemCategory,
  StockStatus,
  NewInventoryItem
} from '../models/inventory.model';
import { HelpButtonComponent } from '../components/help-button/help-button.component';

@Component({
  selector: 'app-tab2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonIcon,
    IonList,
    IonBadge,
    IonText,
    IonToggle,
    IonNote,
    IonSpinner,
    IonAccordion,
    IonAccordionGroup,
    HelpButtonComponent
  ],
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public readonly categories: readonly ItemCategory[] = ITEM_CATEGORIES;
  public readonly statuses: readonly StockStatus[] = STOCK_STATUSES;

  /** Featured records displayed below the form. */
  public featured: InventoryItem[] = [];
  /** Loading indicator for the featured list. */
  public loadingFeatured: boolean = false;
  /** Form submit in-flight flag. */
  public submitting: boolean = false;

  public readonly helpText: string =
    'Fill every required field to create a new inventory record. ' +
    'Item names must be unique on the server. Toggle "Featured" to ' +
    'highlight the record. The list below shows all currently featured items.';

  /** Reactive form backing the UI. */
  public form: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly inventory = inject(InventoryService);
  private readonly toastCtrl = inject(ToastController);

  constructor() {
    // Build the form with strict per-field validators.
    this.form = this.fb.group({
      item_name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          // Allow letters, numbers, spaces, and common punctuation.
          Validators.pattern(/^[A-Za-z0-9][A-Za-z0-9 _\-./()]*$/)
        ]
      ],
      category: ['Electronics' as ItemCategory, [Validators.required]],
      quantity: [
        0,
        [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]
      ],
      price: [
        0,
        [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]
      ],
      supplier_name: [
        '',
        [Validators.required, Validators.minLength(2)]
      ],
      stock_status: ['In Stock' as StockStatus, [Validators.required]],
      featured: [false],
      special_note: ['']
    });
  }

  public ngOnInit(): void {
    this.loadFeatured();
  }

  /** Refresh the featured list from the backend. */
  public loadFeatured(): void {
    this.loadingFeatured = true;
    this.inventory.getAll().subscribe({
      next: (items: InventoryItem[]) => {
        this.featured = (items ?? []).filter(
          (i) => Number(i.featureditem) > 0
        );
        this.loadingFeatured = false;
      },
      error: async (err: Error) => {
        this.loadingFeatured = false;
        await this.presentToast(err.message, 'danger');
      }
    });
  }

  /** Validate the form and POST the new record. */
  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.presentToast(
        'Please fix the highlighted fields before submitting.',
        'warning'
      );
      return;
    }

    const raw = this.form.value as {
      item_name: string;
      category: ItemCategory;
      quantity: number;
      price: number;
      supplier_name: string;
      stock_status: StockStatus;
      featured: boolean;
      special_note: string;
    };

    const payload: NewInventoryItem = {
      item_name: raw.item_name.trim(),
      category: raw.category,
      quantity: Number(raw.quantity),
      price: Number(raw.price),
      supplier_name: raw.supplier_name.trim(),
      stock_status: raw.stock_status,
      featureditem: raw.featured ? 1 : 0,
      special_note: (raw.special_note ?? '').trim() || undefined
    };

    this.submitting = true;
    this.inventory.create(payload).subscribe({
      next: async () => {
        this.submitting = false;
        await this.presentToast(
          `Item "${payload.item_name}" created successfully.`,
          'success'
        );
        this.form.reset({
          item_name: '',
          category: 'Electronics',
          quantity: 0,
          price: 0,
          supplier_name: '',
          stock_status: 'In Stock',
          featured: false,
          special_note: ''
        });
        this.loadFeatured();
      },
      error: async (err: Error) => {
        this.submitting = false;
        await this.presentToast(err.message, 'danger');
      }
    });
  }

  /** Convenience getter for template-driven validation messages. */
  public ctrl(name: string): ReturnType<FormGroup['get']> {
    return this.form.get(name);
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning'
  ): Promise<void> {
    const t = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await t.present();
  }
}
