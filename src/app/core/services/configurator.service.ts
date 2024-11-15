import { Injectable } from '@angular/core';
import { Rifle } from 'src/app/R8/rifle/model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {
  private configuration: any = {
    barrel: null,
    stock: null
  };

  private selectedRifle: Rifle | null = null;

  setSelectedRifle(rifle: Rifle): void {
    this.selectedRifle = rifle;
  }

  getSelectedRifle(): Rifle | null {
    return this.selectedRifle;
  }

  setConfiguration(key: string, value: any): void {
    this.configuration[key] = value;
  }

  getConfiguration(key: string): any {
    return this.configuration[key];
  }

  getFullConfiguration(): any {
    return this.configuration;
  }
}
