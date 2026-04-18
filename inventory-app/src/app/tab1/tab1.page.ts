/**
 * Tab1Page - Inventory List & Search
 *
 * Purpose:
 *   - List every inventory record fetched from the REST backend.
 *   - Filter / look-up a single record by its unique name.
 *   - Pull-to-refresh, retry and per-item detail view.
 *
 * Author: Kangzhe Zhao
 */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonIcon,
  IonBadge,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonChip,
  IonButton,
  IonText,
  AlertController,
  RefresherCustomEvent
} from '@ionic/angular/standalone';

import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory.model';
import { HelpButtonComponent } from '../components/help-button/help-button.component';

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonList,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonIcon,
    IonBadge,
    IonNote,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonChip,
    IonButton,
    IonText,
    HelpButtonComponent
  ],
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss']
})
export class Tab1Page implements OnInit {
  /** All items loaded from the backend. */
  public items: InventoryItem[] = [];
  /** Current search query bound to the searchbar. */
  public query: string = '';
  /** Currently selected record from a name-lookup. */
  public selected: InventoryItem | null = null;
  /** Loading state toggle. */
  public loading: boolean = false;
  /** Most recent error message (empty when no error). */
  public errorMessage: string = '';

  private readonly inventory = inject(InventoryService);
  private readonly alertCtrl = inject(AlertController);

  /** Text rendered by the help widget on this page. */
  public readonly helpText: string =
    'Use the search bar to find a record by its exact name. ' +
    'Pull the list down to refresh. Tap an item to see full details.';

  /** Filtered view over the full list based on the query. */
  public get filteredItems(): InventoryItem[] {
    const q = this.query.trim().toLowerCase();
    if (!q) {
      return this.items;
    }
    return this.items.filter((it) =>
      it.item_name.toLowerCase().includes(q)
    );
  }

  public ngOnInit(): void {
    this.loadAll();
  }

  /** Download the full inventory list. */
  public loadAll(): void {
    this.loading = true;
    this.errorMessage = '';
    this.inventory.getAll().subscribe({
      next: (data: InventoryItem[]) => {
        this.items = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  /** Refresher callback bound to ion-refresher. */
  public handleRefresh(event: RefresherCustomEvent): void {
    this.inventory.getAll().subscribe({
      next: (data: InventoryItem[]) => {
        this.items = Array.isArray(data) ? data : [];
        event.target.complete();
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        event.target.complete();
      }
    });
  }

  /** Fetch a single record by name using the backend endpoint. */
  public async lookupByName(): Promise<void> {
    const name = this.query.trim();
    if (!name) {
      await this.presentAlert(
        'Missing name',
        'Please type the exact item name to look it up.'
      );
      return;
    }
    this.loading = true;
    this.inventory.getByName(name).subscribe({
      next: (item: InventoryItem) => {
        this.selected = item;
        this.loading = false;
      },
      error: async (err: Error) => {
        this.selected = null;
        this.loading = false;
        await this.presentAlert('Not found', err.message);
      }
    });
  }

  /** Clear the detail card. */
  public clearSelection(): void {
    this.selected = null;
  }

  /** CSS class mapping for a stock-status chip. */
  public statusClass(status: InventoryItem['stock_status']): string {
    switch (status) {
      case 'In Stock':
        return 'status-in-stock';
      case 'Low Stock':
        return 'status-low-stock';
      case 'Out of Stock':
        return 'status-out-of-stock';
      default:
        return '';
    }
  }

  /** True when the record is flagged as a featured item. */
  public isFeatured(item: InventoryItem): boolean {
    return Number(item.featureditem) > 0;
  }

  /** Show a simple alert dialog. */
  private async presentAlert(
    header: string,
    message: string
  ): Promise<void> {
    const a = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await a.present();
  }
}
