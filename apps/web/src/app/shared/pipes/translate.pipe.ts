import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationKey } from '../../core/models/translations';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  public transform(key: TranslationKey | string): string {
    return this.i18n.t(key as TranslationKey);
  }
}
