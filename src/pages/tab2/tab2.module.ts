import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tab2Page } from './tab2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    Tab2Page,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicPageModule.forChild(Tab2Page),
  ]
})
export class Tab2PageModule {}

export interface Comments {
  description?: string
}

export interface Months {
  mon?: string
}

export interface Methods {
  met?: string
}