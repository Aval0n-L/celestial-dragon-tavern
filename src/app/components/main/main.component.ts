import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { EffectsComponent } from '../effects/effects.component';
import { LocationsComponent } from '../locations/locations.component';
import { AmbienceComponent } from "../ambience/ambience.component";
import { Router, RouterModule } from '@angular/router';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    LocationsComponent,
    EffectsComponent,
    AmbienceComponent,
    RouterModule
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  locationName: string = 'Tavern';
  backgroundImage: string = 'url(images/tavern.webp)';

  constructor(
    private locationService: LocationService,
    private router: Router) {}

  ngOnInit() {
    this.locationService.selectedLocation$.subscribe(location => {
      if (location) {
        this.locationName = location.name; // Обновляем имя выбранной локации
        this.backgroundImage = location.backgroundImage;
      }
    });
  }

  // Переход на страницу выбора локации
  navigateToLocations() {
    this.router.navigate(['/locations']);
    this.locationName = 'Tavern';
    this.backgroundImage = 'url(images/tavern.webp)';
  }
}
