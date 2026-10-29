import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { canTrackAnalytics } from './cookies';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-DN4DZEFLB8';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly router = inject(Router);

  public init(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd): void => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  public trackPageView(url: string): void {
    if (typeof window === 'undefined' || !window.gtag || !canTrackAnalytics()) {
      return;
    }
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }

  public trackEvent(eventName: string, params?: Record<string, unknown>): void {
    if (typeof window === 'undefined' || !window.gtag || !canTrackAnalytics()) {
      return;
    }
    window.gtag('event', eventName, params);
  }
}

