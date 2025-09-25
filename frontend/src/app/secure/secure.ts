import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secure',
  imports: [CommonModule],
  templateUrl: './secure.html',
  styleUrl: './secure.scss'
})
export class Secure {
  constructor(public auth: AuthService) {}
}
