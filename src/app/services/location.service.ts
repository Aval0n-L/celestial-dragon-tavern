import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private selectedLocationSource = new BehaviorSubject<any>(null); // Stores the current state
  selectedLocation$ = this.selectedLocationSource.asObservable();  // Observable stream for receiving data

  // Method to change the selected location
  changeLocation(location: any) {
    this.selectedLocationSource.next(location);
  }
}
