/**
 * Inventory domain model.
 *
 * Mirrors the remote MySQL table columns described in the assignment brief.
 * Backend field names are kept in snake_case so that the object can be sent
 * directly as the PUT / POST JSON body without extra mapping.
 *
 * Author: Liwei Jin
 */

/** Allowed category values for an inventory item. */
export type ItemCategory =
  | 'Electronics'
  | 'Furniture'
  | 'Clothing'
  | 'Tools'
  | 'Miscellaneous';

/** Allowed stock-status values. */
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

/** All supported categories (convenient for dropdowns). */
export const ITEM_CATEGORIES: readonly ItemCategory[] = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Tools',
  'Miscellaneous'
];

/** All supported stock statuses (convenient for dropdowns). */
export const STOCK_STATUSES: readonly StockStatus[] = [
  'In Stock',
  'Low Stock',
  'Out of Stock'
];

/**
 * A single inventory record - the complete shape including backend
 * bookkeeping fields (`item_id`).
 */
export interface InventoryItem {
  /** Auto-incremented primary key assigned by the backend. */
  item_id?: number;
  /** Unique human-readable item name. */
  item_name: string;
  /** Category enum value. */
  category: ItemCategory;
  /** Quantity on hand. */
  quantity: number;
  /** Unit price in whole currency units. */
  price: number;
  /** Supplier name. */
  supplier_name: string;
  /** Stock-status enum value. */
  stock_status: StockStatus;
  /** Non-zero flag marking a featured item. */
  featureditem: number;
  /** Optional free-form note. */
  special_note?: string;
}

/**
 * Payload used when creating a brand new record.
 * `item_id` is intentionally omitted because the backend assigns it.
 */
export type NewInventoryItem = Omit<InventoryItem, 'item_id'>;
