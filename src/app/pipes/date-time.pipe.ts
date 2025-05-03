import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTime',
  standalone: true,
})
@Injectable({
  providedIn: 'root',
})
export class DateTimePipe implements PipeTransform {

  transform(value: any): string | null {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); // Months are zero-based
    const year = date.getFullYear();
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

}
