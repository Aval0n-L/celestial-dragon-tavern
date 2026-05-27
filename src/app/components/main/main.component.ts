import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { EffectsComponent } from '../effects/effects.component';
import { LocationsComponent } from '../locations/locations.component';
import { Router, RouterModule } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { TimeOfDayService } from '../../services/time-of-day.service';
import { NgIf } from '@angular/common';
import { PortalComponent } from "../animations/portal/portal.component";
import { TimeOverlayComponent } from '../overlays/time-overlay/time-overlay.component';
import { WeatherOverlayComponent } from '../overlays/weather-overlay/weather-overlay.component';
import { Subscription } from 'rxjs';

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
    PortalComponent,
    TimeOverlayComponent,
    WeatherOverlayComponent,
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {
  locationName: string = 'Tavern';
  backgroundImage: string = 'url(images/tavern.webp)';
  timeOfDay: string | null = null;

  isMainContentVisible = false;

  private timeSubscription?: Subscription;

  constructor(
    private locationService: LocationService,
    private timeOfDayService: TimeOfDayService,
    private router: Router) {}

  ngOnInit() {
    this.locationService.selectedLocation$.subscribe(location => {
      if (location) {
        this.locationName = location.name;
        this.backgroundImage = location.backgroundImage;
      }
    });

    this.timeSubscription = this.timeOfDayService.timeOfDay$.subscribe(time => {
      this.timeOfDay = time;
    });
  }

  ngOnDestroy() {
    this.timeSubscription?.unsubscribe();
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
