import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignupPage } from './signup/signup.page';
import { PerfilPage } from './perfil/perfil.page'; // Importando o PerfilPage standalone

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'signup',
    component: SignupPage,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'perfil',
    component: PerfilPage, // Usando o PerfilPage diretamente como componente standalone
  },
  {
    path: 'criar-servicos',
    loadChildren: () => import('./criar-servicos/criar-servicos.module').then(m => m.CriarServicosPageModule), // Carregamento do módulo de criação de serviços
  },
  {
    path: 'servicos',
    loadChildren: () => import('./servicos/servicos.module').then(m => m.ServicosPageModule), // Carregamento do módulo de serviços
  },
  {
    path: 'plano-semanal',
    loadChildren: () => import('./plano-semanal/plano-semanal.module').then(m => m.PlanoSemanalPageModule),
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./editar-perfil/editar-perfil.module').then(m => m.EditarPerfilPageModule),
  },
  {
    path: 'editar-servicos/:numero', // Rota para editar serviços, com o parâmetro :numero
    loadChildren: () => import('./editar-servicos/editar-servicos.module').then(m => m.EditarServicosPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
