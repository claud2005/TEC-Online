import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // ✅ Importado corretamente
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent], // ✅ Não incluir standalone components aqui
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule, // ✅ Mantido aqui corretamente
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
