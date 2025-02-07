import { Component } from '@angular/core';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styles: [
  ]
})
export class ContactComponent {

  userName = '';
  userEmail = '';
  userMessage = '';

  constructor(private contactService: ContactService) { }

  sendEmail() {
    const formData = {
      from_name: this.userName,
      message: this.userMessage,
      reply_to: this.userEmail
    };

    this.contactService.sendEmail(formData)
      .then(() => alert('E-mail wysłany pomyślnie!'))
      .catch(() => alert('Błąd podczas wysyłania e-maila!'));
  }
}
