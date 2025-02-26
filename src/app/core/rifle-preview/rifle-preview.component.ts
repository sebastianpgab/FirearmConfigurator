import { Component } from '@angular/core';
import { ConfiguratorService } from '../services/configurator.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-rifle-preview',
  templateUrl: './rifle-preview.component.html',
  styles: [
  ]
})
export class RiflePreviewComponent {

private subscription!: Subscription;

state: any;
constructor(public configuratorService: ConfiguratorService){}

  ngOnInit(): void {
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state; 
    });
  }
}
