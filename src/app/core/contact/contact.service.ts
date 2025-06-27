import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private serviceID = 'service_pd7t45l';
  private templateID = 'template_hlu91oi';
  private publicKey = 'CfesW4RkIZYS5Kqn0';

  constructor() { }

  sendEmail(formData: { from_name: string; message: string; reply_to: string }) {
    return emailjs.send(this.serviceID, this.templateID, formData, this.publicKey)
      .then(response => {
        console.log('E-mail wysłany!', response);
        return response;
      })
      .catch(error => {
        console.error('Błąd wysyłania emaila:', error);
        throw error;
      });
  }

}
