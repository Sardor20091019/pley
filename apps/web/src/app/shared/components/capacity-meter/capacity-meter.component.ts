import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-capacity-meter',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (themeService.theme() === 'editorial') {
      <div class="w-full space-y-1 font-sans">
        <div class="flex items-center justify-between text-xs text-[#8B7355]">
          <span>{{ bookedSlots }}/{{ maxSlots }} oʻyinchi</span>
          <span class="font-bold text-[#1A1510]">
            {{ isFull() ? 'Barcha oʻrinlar band' : remainingSlots + ' ta joy mavjud' }}
          </span>
        </div>
        <div class="w-full h-1.5 bg-[rgba(45,41,38,0.15)] overflow-hidden">
          <div class="h-full bg-[#1A1510] transition-all duration-300" [style.width.%]="percentage()"></div>
        </div>
      </div>
    } @else {
      <div class="w-full space-y-1.5">
        <div class="flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#242424]">
          <span>{{ bookedSlots }} / {{ maxSlots }} oʻyinchi</span>
          <span
            class="px-2 py-0.5 rounded-full text-xs font-black uppercase"
            [class.bg-[#FF795D]]="isFull() || isAlmostFull()"
            [class.text-white]="isFull() || isAlmostFull()"
            [class.animate-pulse]="isAlmostFull()"
            [class.bg-[#D7FF64]]="!isFull() && !isAlmostFull()"
            [class.text-[#242424]]="!isFull() && !isAlmostFull()"
          >
            {{ isFull() ? 'Toʻlgan' : remainingSlots + ' ta joy qoldi' }}
          </span>
        </div>

        <div
          class="w-full bg-[#FFF9EF] border-2 border-[#242424] rounded-full overflow-hidden p-0.5"
          [class.h-3]="size === 'sm'"
          [class.h-4]="size === 'md'"
          [class.h-5]="size === 'lg'"
        >
          <div
            class="rounded-full transition-all duration-300 border border-[#242424] h-full"
            [class.bg-[#FF795D]]="isFull() || isAlmostFull()"
            [class.bg-[#D7FF64]]="!isFull() && !isAlmostFull()"
            [style.width.%]="percentage()"
          ></div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapacityMeterComponent {
  @Input() public maxSlots: number = 0;
  @Input() public bookedSlots: number = 0;
  @Input() public remainingSlots: number = 0;
  @Input() public size: 'sm' | 'md' | 'lg' = 'md';

  protected readonly themeService = inject(ThemeService);

  public percentage(): number {
    if (!this.maxSlots || this.maxSlots <= 0) return 0;
    return Math.min(100, Math.round((this.bookedSlots / this.maxSlots) * 100));
  }

  public isFull(): boolean {
    return this.remainingSlots <= 0;
  }

  public isAlmostFull(): boolean {
    return this.remainingSlots > 0 && this.remainingSlots <= 2;
  }
}
