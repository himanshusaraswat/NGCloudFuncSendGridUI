import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  imports: [
    CommonModule,
    BrowserModule /* or CommonModule */,
    FormsModule, ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule
  ],
  declarations: [
    BlockCopyPasteDirective,
    DialogComponent,
  ],
  exports: [
    BlockCopyPasteDirective,
    DialogComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class SharedModule { }
