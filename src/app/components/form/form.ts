import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { applyEach, form, maxLength, required, FormField } from '@angular/forms/signals';

interface LoginData {
  fullName: string;
  email: string;
  news: boolean;
  moneyList: {
    id: string;
    title: string;
    price: number;
  }[];
}

@Component({
  selector: 'app-form',
  imports: [FormField, JsonPipe],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  loginModel = signal<LoginData>({
    fullName: '',
    email: '',
    news: false,
    moneyList: [],
  });

  totalPrice = computed(() => {
    return this.loginModel().moneyList.reduce((acc, item) => acc + item.price, 0);
  })

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.fullName);
    required(schemaPath.email);
    maxLength(schemaPath.fullName, 40);
    maxLength(schemaPath.email, 40);
    applyEach(schemaPath.moneyList, (schemaPath) => {
      required(schemaPath.title);
      required(schemaPath.price);
    });
  });

  addMoneyRow() {
    this.loginModel.update((model) => ({
      ...model,
      moneyList: [
        ...model.moneyList,
        {
          id: Math.random().toString(),
          title: '',
          price: 0,
        },
      ],
    }));
  }

  removeMoneyRow(id: string) {
    this.loginModel.update((model) => {
      model.moneyList = model.moneyList.filter((item) => item.id !== id);
      return model;
    });
  }
}
