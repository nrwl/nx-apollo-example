import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { SetListComponent } from './set-list/set-list.component';
import { SetFormComponent } from './set-form/set-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, SetListComponent, SetFormComponent],
  imports: [BrowserModule, HttpClientModule, GraphQLModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
