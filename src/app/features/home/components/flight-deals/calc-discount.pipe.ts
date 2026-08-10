import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'discount',
})
export class CalcDiscountPipe implements PipeTransform {
  transform(price: number, discount: number) {
    return price * ((100 - discount) / 100);
  }
}
