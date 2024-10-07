import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentModules } from 'src/components/components.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ComponentModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
