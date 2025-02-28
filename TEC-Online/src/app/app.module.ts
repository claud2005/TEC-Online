import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importe o HttpClientModule
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupPage } from './signup/signup.page'; // Importe o seu componente

@NgModule({
  declarations: [AppComponent], // Não declare o SignupPage aqui, pois é standalone
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule, // Não se esqueça de adicionar o HttpClientModule aqui
    AppRoutingModule,
    SignupPage // Importe o SignupPage diretamente aqui
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
