/**
 * Tab3Page - Update / Delete by Name
 *
 * Workflow:
 *   1. User types an item name and taps "Load".
 *   2. App calls GET /<name>, populates the edit form.
 *   3. User edits fields -> PUT /<name>.
 *   4. User can also delete the record via DELETE /<name> with confirm.
 *
 * Author: Kangzhe Zhao
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
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
  IonNote,
  IonSpinner,
  IonToggle,
  IonSearchbar,
  IonText,
  AlertController,
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
  selector: 'app-tab3',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    IonNote,
    IonSpinner,
    IonToggle,
    IonSearchbar,
    IonText,
    HelpButtonComponent
  ],
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss']
})
export class Tab3Page {
  public readonly categories: readonly ItemCategory[] = ITEM_CATEGORIES;
  public readonly statuses: readonly StockStatus[] = STOCK_STATUSES;

  /** Name typed in the top search bar. */
  public lookupName: string = '';
  /** Record currently loaded for editing (null before lookup). */
  public loaded: InventoryItem | null = null;
  /** Async state flags. */
  public loading: boolean = false;
  public saving: boolean = false;
  public deleting: boolean = false;
  /** Last error message to surface to the user. */
  public errorMessage: string = '';

  public readonly helpText: string =
    'Type an existing item name exactly, then tap "Load" to pull its ' +
    'record. Change any field and tap "Save" to PUT the update. Use ' +
    '"Delete" to remove the record. The server refuses to delete the ' +
    'protected item called "Laptop".';

  public form: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly inventory = inject(InventoryService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  constructor() {
    this.form = this.fb.group({
      item_name: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(2)]
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
      supplier_name: ['', [Validators.required, Validators.minLength(2)]],
      stock_status: ['In Stock' as StockStatus, [Validators.required]],
      featured: [false],
      special_note: ['']
    });
  }

  /** Pull a record from the backend into the edit form. */
  public loadRecord(): void {
    const name = this.lookupName.trim();
    if (!name) {
      this.errorMessage = 'Please enter an item name first.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.inventory.getByName(name).subscribe({
      next: (item: InventoryItem) => {
        this.loaded = item;
        this.form.reset({
          item_name: item.item_name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
          supplier_name: item.supplier_name,
          stock_status: item.stock_status,
          featured: Number(item.featureditem) > 0,
          special_note: item.special_note ?? ''
        });
        this.loading = false;
      },
      error: (err: Error) => {
        this.loaded = null;
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  /** Persist the current form values. */
  public async save(): Promise<void> {
    if (!this.loaded) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.presentToast(
        'Please fix the highlighted fields before saving.',
        'warning'
      );
      return;
    }
    const raw = this.form.getRawValue() as {
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

    this.saving = true;
    this.inventory.update(this.loaded.item_name, payload).subscribe({
      next: async () => {
        this.saving = false;
        await this.presentToast(
          `Item "${payload.item_name}" updated.`,
          'success'
        );
        // Refresh in-memory snapshot with new values.
        this.loaded = { ...this.loaded!, ...payload };
      },
      error: async (err: Error) => {
        this.saving = false;
        await this.presentToast(err.message, 'danger');
      }
    });
  }

  /** Confirm then issue a DELETE. */
  public async remove(): Promise<void> {
    if (!this.loaded) {
      return;
    }
    const name = this.loaded.item_name;

    const confirm = await this.alertCtrl.create({
      header: 'Confirm delete',
      message: `Delete "${name}"? This cannot be undone.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive' }
      ]
    });
    await confirm.present();
    const result = await confirm.onDidDismiss();
    if (result.role !== 'destructive') {
      return;
    }

    this.deleting = true;
    this.inventory.delete(name).subscribe({
      next: async () => {
        this.deleting = false;
        await this.presentToast(
          `Item "${name}" deleted.`,
          'success'
        );
        this.loaded = null;
        this.lookupName = '';
        this.form.reset();
      },
      error: async (err: Error) => {
        this.deleting = false;
        await this.presentToast(err.message, 'danger');
      }
    });
  }

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
