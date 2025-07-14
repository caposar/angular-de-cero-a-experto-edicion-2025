import { DatePipe, LowerCasePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, effect, inject, LOCALE_ID, signal } from '@angular/core';
import { AvailableLocale, LocaleService } from '@services/locale.service';

@Component({
  selector: 'app-basic-page',
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe, DatePipe],
  templateUrl: './basic-page.component.html',
})
export class BasicPageComponent {
  localeService = inject(LocaleService);
  currentLocale = signal<string>(inject(LOCALE_ID));

  nameLower = signal('cesar');
  nameUpper = signal('CESAR');
  fullName = signal('cEsAr pAreDeS');

  customDate = signal(new Date());
  tickingDateEffect = effect((onCleanUp) => {
    const interval = setInterval(() => {
      console.log('tick');
      this.customDate.set(new Date());
    }, 1000);

    onCleanUp(() => {
      clearInterval(interval);
      console.log('tick effect cleaned up');
    });
  });

  changeLocale(locale: AvailableLocale) {
    this.localeService.changeLocale(locale);
    console.log(`Locale changed to: ${locale}`);
  }
}
