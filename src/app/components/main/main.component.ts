import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { EffectsComponent } from '../effects/effects.component';
import { LocationsComponent } from '../locations/locations.component';
import { Router, RouterModule } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { NgIf } from '@angular/common';
import { PortalComponent } from "../animations/portal/portal.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NgIf,
    HeaderComponent,
    FooterComponent,
    LocationsComponent,
    EffectsComponent,
    RouterModule,
    PortalComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  locationName: string = 'Tavern';
  backgroundImage: string = 'url(images/tavern.webp)';

  isMainContentVisible = false;

  constructor(
    private locationService: LocationService,
    private router: Router) {}

  ngOnInit() {
    this.locationService.selectedLocation$.subscribe(location => {
      if (location) {
        this.locationName = location.name; // Update the name of the selected location
        this.backgroundImage = location.backgroundImage;
      }
    });
  }

  // Go to the location selection page
  navigateToLocations() {
    this.router.navigate(['/']);
    this.locationName = 'Tavern';
    this.backgroundImage = 'url(images/tavern.webp)';
    this.isMainContentVisible = false;
  }

  // Method to toggle display of main-content
  toggleMainContent() {
    this.isMainContentVisible = true;
    this.router.navigate(['/locations']);
  }
}
