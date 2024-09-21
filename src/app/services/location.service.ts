import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private selectedLocationSource = new BehaviorSubject<any>(null); // Хранит текущее состояние
  selectedLocation$ = this.selectedLocationSource.asObservable();  // Наблюдаемый поток для получения данных

  // Метод для изменения выбранной локации
  changeLocation(location: any) {
    this.selectedLocationSource.next(location);
  }
}
