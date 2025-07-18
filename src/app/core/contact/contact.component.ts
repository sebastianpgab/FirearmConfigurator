import { Component } from '@angular/core';
import { ContactService } from './contact.service';
import { ConfiguratorService } from '../services/configurator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./style.scss']
})
export class ContactComponent {
  // Pola z podstawowymi danymi

  private subscription!: Subscription;
  
  state: any;
  userName = '';
  userEmail = '';
  userPhone = '';
  userMessage = '';
  contactMethod = '';

  constructor(
    private contactService: ContactService,
    public configuratorService: ConfiguratorService
  ) {}

  ngOnInit(): void {
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state; 
    });
  }

  sendEmail() {
    if (!this.userName.trim() || !this.userMessage.trim()) {
      alert('Proszę podać imię i wiadomość.');
      return;
    }
  
  
    const selectedOptions = [
      { label: 'Karabin', value: this.state.selectedRifle?.name },
      { label: 'Konfiguracja chwytu', value: this.state.selectedHandConfiguration?.name },
      { label: 'Kontur', value: this.state.selectedContour?.name },
      { label: 'Kaliber', value: this.state.selectedCaliber?.name },
      { label: 'Profil', value: this.state.selectedProfile?.name },
      { label: 'Długość', value: this.state.selectedLength?.name },
      { label: 'Celownik otwarty', value: this.state.selectedOpenSight?.name },
      { label: 'Hamulec / tłumik', value: this.state.selectedMuzzleBrakeOrSuppressor?.name },
      { label: 'Typ kolby', value: this.state.selectedButtstockType?.name },
      { label: 'Kategoria drewna', value: this.state.selectedWoodCategory?.name },
      { label: 'Stopka / amortyzator odrzutu', value: this.state.selectedRecoilPad?.name },
      { label: 'Rodzaj wymiarów kolby', value: this.state.selectedButtstockMeasuresType?.name },
      { label: 'Rączka zamka', value: this.state.selectedBoltHandle?.name },
      { label: 'Spust', value: this.state.selectedTrigger?.name },
      { label: 'Głowica zamka', value: this.state.selectedBoltHead?.name },
      { label: 'Bezpiecznik suwakowy', value: this.state.selectedSlidingSafety?.name },
      { label: 'Pas do broni', value: this.state.selectedRifleSling?.name },
      { label: 'Pokrowiec miękki', value: this.state.selectedSoftGunCover?.name },
      { label: 'Futerał / walizka', value: this.state.selectedGunCase?.name },
    ];
  
    const chosenTextParts = selectedOptions
      .filter(item => item.value)
      .map(item => `${item.label}: ${item.value}`)
      .join('\n'); // ✅ Każda opcja w nowej linii
  
  
    // 🌟 Pełna wiadomość (bez HTML, poprawne formatowanie)
    const finalMessage = `
Wiadomość od ${this.userName}:
${this.userMessage}


Wybrane opcje:
${chosenTextParts || 'Brak wybranych opcji'}
`;
  
    // 🌟 Obiekt danych do wysłania
    const formData = {
      from_name: this.userName,
      message: finalMessage,
      reply_to: this.contactMethod,
    };
  
    // 🌟 Wysyłanie maila
    this.contactService.sendEmail(formData)
      .then(() => {
        alert('E-mail wysłany pomyślnie!');
        this.resetForm();
      })
      .catch(() => alert('Błąd podczas wysyłania e-maila!'));
  }
  
  // ➡️ Resetowanie formularza po wysłaniu
  resetForm() {
    this.userName = '';
    this.userEmail = '';
    this.userPhone = '';
    this.userMessage = '';
    this.contactMethod = '';
  }
}
