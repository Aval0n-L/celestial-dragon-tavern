import { Routes } from '@angular/router';
import { LocationsComponent } from './components/locations/locations.component';
import { EffectsComponent } from './components/effects/effects.component';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: 'locations', component: LocationsComponent },
            { path: 'effects', component: EffectsComponent },
        ]
    },
    { path: '**', redirectTo: '' }
];
