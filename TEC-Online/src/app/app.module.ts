import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // ✅ Importado corretamente
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ Importando o ReactiveFormsModule

@NgModule({
  declarations: [AppComponent], // ✅ Não incluir standalone components aqui
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule, // ✅ Mantido aqui corretamente
    ReactiveFormsModule, // ✅ Adicionando o ReactiveFormsModule
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
