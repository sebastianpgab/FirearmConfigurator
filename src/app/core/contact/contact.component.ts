import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactService } from './contact.service';
import { ConfiguratorService } from '../services/configurator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./style.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  // UI komunikaty
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSending = false;

  // Anti-spam: honeypot + cooldown
  honeypot: string = '';
  private cooldownMs = 30_000;                 // 30 sekund
  private cooldownKey = 'lastEmailSent';       // klucz w localStorage
  cooldownRemaining = 0;                       // sekundy do końca cooldownu
  private cooldownTimer: any;                  // setInterval handler

  // Dane stanu i użytkownika
  state: any;
  userName = '';
  userEmail = '';
  userPhone = '';
  userMessage = '';
  contactMethod = ''; // jeśli puste, użyjemy userEmail jako reply_to

  constructor(
    private contactService: ContactService,
    public configuratorService: ConfiguratorService
  ) {}

  // ===== Lifecycle =====
  ngOnInit(): void {
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state;
    });

    // po wejściu na stronę sprawdź, czy jest aktywny cooldown i zacznij odliczanie
    this.startCooldownCheck();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
  }

  // ===== Cooldown helpers =====
  isCooldownActive(): boolean {
    const last = localStorage.getItem(this.cooldownKey);
    if (!last) return false;
    const remaining = this.cooldownMs - (Date.now() - parseInt(last, 10));
    return remaining > 0;
  }

  private startCooldownCheck(): void {
    const updateCooldown = () => {
      const last = localStorage.getItem(this.cooldownKey);
      if (!last) {
        this.cooldownRemaining = 0;
        return;
      }
      const remainingMs = this.cooldownMs - (Date.now() - parseInt(last, 10));
      this.cooldownRemaining = remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
    };

    updateCooldown();
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(updateCooldown, 1000);
  }

private isEmailValid(email: string): boolean {
  // prosty regex, sprawdza czy jest coś@coś.coś
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async sendEmail(): Promise<void> {
  this.successMessage = null;
  this.errorMessage = null;

  // Honeypot
  if (this.honeypot) {
    this.errorMessage = 'Wiadomość została oznaczona jako spam.';
    return;
  }

  // Cooldown
  if (this.isCooldownActive()) {
    this.errorMessage = `Musisz poczekać ${this.cooldownRemaining} s przed wysłaniem kolejnej wiadomości.`;
    return;
  }

  // Walidacje pól
  if (!this.userName.trim() || !this.userMessage.trim()) {
    this.errorMessage = 'Proszę podać imię i wiadomość.';
    return;
  }
  if (!this.userEmail.trim() || !this.isEmailValid(this.userEmail)) {
    this.errorMessage = 'Podaj poprawny adres e-mail.';
    return;
  }

    // 4) Składanie treści wiadomości
    const selectedOptions = [
      { label: 'Karabin', value: this.state?.selectedRifle?.name },
      { label: 'Konfiguracja chwytu', value: this.state?.selectedHandConfiguration?.name },
      { label: 'Kontur', value: this.state?.selectedContour?.name },
      { label: 'Kaliber', value: this.state?.selectedCaliber?.name },
      { label: 'Profil', value: this.state?.selectedProfile?.name },
      { label: 'Długość', value: this.state?.selectedLength?.name },
      { label: 'Celownik otwarty', value: this.state?.selectedOpenSight?.name },
      { label: 'Hamulec / tłumik', value: this.state?.selectedMuzzleBrakeOrSuppressor?.name },
      { label: 'Typ kolby', value: this.state?.selectedButtstockType?.name },
      { label: 'Kategoria drewna', value: this.state?.selectedWoodCategory?.name },
      { label: 'Stopka / amortyzator odrzutu', value: this.state?.selectedRecoilPad?.name },
      { label: 'Rodzaj wymiarów kolby', value: this.state?.selectedButtstockMeasuresType?.name },
      { label: 'Rączka zamka', value: this.state?.selectedBoltHandle?.name },
      { label: 'Spust', value: this.state?.selectedTrigger?.name },
      { label: 'Głowica zamka', value: this.state?.selectedBoltHead?.name },
      { label: 'Bezpiecznik suwakowy', value: this.state?.selectedSlidingSafety?.name },
      { label: 'Pas do broni', value: this.state?.selectedRifleSling?.name },
      { label: 'Pokrowiec miękki', value: this.state?.selectedSoftGunCover?.name },
      { label: 'Futerał / walizka', value: this.state?.selectedGunCase?.name },
    ];

    const chosenTextParts = selectedOptions
      .filter(item => item.value)
      .map(item => `${item.label}: ${item.value}`)
      .join('\n');

    const finalMessage = `
Wiadomość od ${this.userName}:
${this.userMessage}

Wybrane opcje:
${chosenTextParts || 'Brak wybranych opcji'}
`;

    const formData = {
      from_name: this.userName,
      message: finalMessage,
      reply_to: this.contactMethod || this.userEmail || 'no-email-provided'
    };

    // 5) Wysyłka + blokada
    this.isSending = true;
    try {
      await this.contactService.sendEmail(formData);
      this.successMessage = 'E-mail został wysłany pomyślnie!';
      localStorage.setItem(this.cooldownKey, Date.now().toString()); // start cooldownu po sukcesie
      this.resetForm();
      this.startCooldownCheck(); // włącz/odśwież odliczanie
      setTimeout(() => (this.successMessage = null), 5000);
    } catch {
      this.errorMessage = 'Wystąpił błąd podczas wysyłania e-maila.';
      setTimeout(() => (this.errorMessage = null), 5000);
    } finally {
      this.isSending = false;
    }
  }

  // ===== Reset =====
  resetForm(): void {
    this.userName = '';
    this.userEmail = '';
    this.userPhone = '';
    this.userMessage = '';
    this.contactMethod = '';
    this.honeypot = '';
  }
}
