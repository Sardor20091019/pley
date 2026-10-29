import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turnstile-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center w-full min-h-[65px] my-1 overflow-hidden">
      <div #container class="w-[300px] min-h-[65px] flex items-center justify-center"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TurnstileWidgetComponent implements OnInit, OnDestroy {
  @Input() public theme: 'light' | 'dark' | 'auto' = 'auto';
  @Output() public readonly verified = new EventEmitter<string>();
  @Output() public readonly expired = new EventEmitter<void>();
  @Output() public readonly errorOccurred = new EventEmitter<string>();

  @ViewChild('container', { static: true })
  public containerRef!: ElementRef<HTMLDivElement>;

  private widgetId: string | null = null;
  private timer: any = null;
  private readonly siteKey = '0x4AAAAAAFpYVK4Lc7_KcYai';

  public ngOnInit(): void {
    if (typeof window === 'undefined') return;

    let script = document.getElementById('cf-turnstile-script') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const turnstile = (window as any).turnstile;
    if (turnstile && typeof turnstile.ready === 'function') {
      turnstile.ready(() => this.renderWidget());
    } else {
      this.timer = setInterval(() => {
        const t = (window as any).turnstile;
        if (t) {
          clearInterval(this.timer);
          this.renderWidget();
        }
      }, 100);
    }
  }

  private renderWidget(): void {
    const turnstile = (window as any).turnstile;
    if (!turnstile || !this.containerRef?.nativeElement || this.widgetId) {
      return;
    }

    try {
      this.containerRef.nativeElement.innerHTML = '';
      this.widgetId = turnstile.render(this.containerRef.nativeElement, {
        sitekey: this.siteKey,
        theme: this.theme,
        'refresh-expired': 'auto',
        callback: (token: string) => this.verified.emit(token),
        'expired-callback': () => this.expired.emit(),
        'error-callback': (code?: string) => this.errorOccurred.emit(code || 'error'),
        'timeout-callback': () => this.errorOccurred.emit('timeout'),
      });
    } catch {
      this.errorOccurred.emit('render_error');
    }
  }

  public ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    const turnstile = (window as any).turnstile;
    if (turnstile && this.widgetId) {
      try {
        turnstile.remove(this.widgetId);
      } catch {}
      this.widgetId = null;
    }
  }
}
