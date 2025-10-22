import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'appFilter'})
export class AppFilterPipe implements PipeTransform{
    transform(items: any[], searchText: string, propertyName: string) {
       if(!items || ! searchText){
         console.log(items);
       }

       searchText = searchText.toLowerCase();

       items.filter(item => {
        const value = item[propertyName] ? item[propertyName].toLowerCase(): '';
        value.includes(searchText);
       })
    }

    
}