import { Routes } from '@angular/router';
import { LocationsComponent } from './components/locations/locations.component';
import { EffectsComponent } from './components/effects/effects.component';

export const routes: Routes = [
    { path: '', component: LocationsComponent }, // Главная страница
    { path: 'locations', component: LocationsComponent }, // Выбор локации
    { path: 'effects', component: EffectsComponent }, // Эффекты после выбора локации
    { path: '**', redirectTo: '' } // Редирект на главную, если путь не найден
];
