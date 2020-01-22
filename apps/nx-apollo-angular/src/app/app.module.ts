import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFeatureSetsModule } from '@nx-apollo-example/angular/feature-sets';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, GraphQLModule, AngularFeatureSetsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
