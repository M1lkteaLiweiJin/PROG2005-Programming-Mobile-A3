/**
 * InventoryService
 *
 * Thin wrapper around the remote RESTful inventory API.
 * Implements: list, get-by-name, create, update, delete.
 *
 * REST contract (from brief):
 *   GET    /            -> all items (array)
 *   GET    /<name>      -> single item by name
 *   POST   /            -> create new item
 *   PUT    /<name>      -> update existing item with given name
 *   DELETE /<name>      -> delete item by name (server refuses "Laptop")
 *
 * Author: Shihao Yang
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  InventoryItem,
  NewInventoryItem
} from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  /** Base URL for the remote inventory REST endpoint. */
  private readonly baseUrl = 'https://prog2005.it.scu.edu.au/ArtGalley';

  private readonly http = inject(HttpClient);

  /** Fetch every inventory record. */
  public getAll(): Observable<InventoryItem[]> {
    return this.http
      .get<InventoryItem[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  /** Fetch a single record by unique item name. */
  public getByName(name: string): Observable<InventoryItem> {
    return this.http
      .get<InventoryItem>(`${this.baseUrl}/${encodeURIComponent(name)}`)
      .pipe(catchError(this.handleError));
  }

  /** Create a new record. */
  public create(item: NewInventoryItem): Observable<InventoryItem> {
    return this.http
      .post<InventoryItem>(this.baseUrl, item)
      .pipe(catchError(this.handleError));
  }

  /** Update an existing record identified by its current name. */
  public update(
    name: string,
    item: NewInventoryItem
  ): Observable<InventoryItem> {
    return this.http
      .put<InventoryItem>(
        `${this.baseUrl}/${encodeURIComponent(name)}`,
        item
      )
      .pipe(catchError(this.handleError));
  }

  /** Delete a record by name. Server rejects name === "Laptop". */
  public delete(name: string): Observable<unknown> {
    return this.http
      .delete(`${this.baseUrl}/${encodeURIComponent(name)}`)
      .pipe(catchError(this.handleError));
  }

  /** Normalise backend errors into readable Error instances. */
  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      error.error instanceof ErrorEvent
        ? `Network error: ${error.error.message}`
        : `Server responded ${error.status}: ${
            typeof error.error === 'string'
              ? error.error
              : (error.message || 'Unknown error')
          }`;
    console.error('[InventoryService]', message, error);
    return throwError(() => new Error(message));
  }
}
