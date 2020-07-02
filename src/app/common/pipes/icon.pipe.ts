import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'icon'
})
export class IconPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value == undefined || value == "" ?
      "./assets/icons/vault.svg" : value;
  }

}
