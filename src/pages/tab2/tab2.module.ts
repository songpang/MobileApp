import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tab2Page } from './tab2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule
} from "@angular/material";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


@NgModule({
  declarations: [
    Tab2Page,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatIconModule,

    MatButtonToggleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRadioModule,
    IonicPageModule.forChild(Tab2Page),
  ],
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