import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [ NgFor ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent {
  @Output() locationChanged = new EventEmitter<any>();

  constructor(
    private locationService: LocationService,
    private router: Router) {}
  
  locations = [
    {
      name: 'Town',
      image: 'locations/town.webp',
      backgroundImage: 'url(locations/town.webp)'
    },
    {
      name: 'Merchant City',
      image: 'locations/merchant-city.webp',
      backgroundImage: 'url(locations/merchant-city.webp)'
    },
    {
      name: 'Arcane Tower',
      image: 'locations/arcane-tower.webp',
      backgroundImage: 'url(locations/arcane-tower.webp)'
    },
    {
      name: 'Underground Cavern',
      image: 'locations/underground-cavern.webp',
      backgroundImage: 'url(locations/underground-cavern.webp)'
    },
    {
      name: 'Demon’s Abyss',
      image: 'locations/demons-abyss.webp',
      backgroundImage: 'url(locations/demons-abyss.webp)'
    },
    {
      name: 'Temple of the Forgotten Gods',
      image: 'locations/temple-forgotten-gods.webp',
      backgroundImage: 'url(locations/temple-forgotten-gods.webp)'
    }
  ];

  selectLocation(location: any) {
    console.log('Location selected:', location); // Лог для отладки
    this.locationService.changeLocation(location); // Вызываем событие, чтобы сообщить о выборе
    this.router.navigate(['/effects']); // Переход на страницу эффектов
  }
}
