import { Component } from '@angular/core';
import { ConfiguratorService } from '../core/services/configurator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styles: [
  ]
})
export class SummaryComponent {

  private subscription!: Subscription; 
  state: any;
  constructor(private configuratorService: ConfiguratorService) {}

  ngOnInit(): void {
    // Subskrybujemy stan
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state; 
    });
  }
}
