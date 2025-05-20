import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { of } from 'rxjs';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AsyncPipe],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css',
})
export class BillingComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private cartService: CartService) {}
  billingForm: FormGroup = this.formBuilder.group({});

  totalAmount = this.cartService.totalPrice$;


  ngOnInit(): void {
    this.billingForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      address: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.billingForm.valid) {
      console.log('Billing Info:', this.billingForm.value);
      // Handle payment logic here
    } else {
      console.log('Form is invalid');
    }
  }
}
