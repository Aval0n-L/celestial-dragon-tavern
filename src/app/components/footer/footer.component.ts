import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  public year : number = 0;
  public name : string = 'Avalon'

  constructor() {
  }
  ngOnInit(): void {
    let data = new Date();
    this.year = data.getUTCFullYear();
  }
}
