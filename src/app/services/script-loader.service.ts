import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Carga scripts externos solo en el navegador (evita errores SSR)
   */
  async loadBootstrapAndLeaflet(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
  import('bootstrap');
  import('bootstrap/dist/js/bootstrap.bundle.min.js');
   }
 }
}