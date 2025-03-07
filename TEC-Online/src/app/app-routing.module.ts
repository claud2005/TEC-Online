import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignupPage } from './signup/signup.page';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'signup',
    component: SignupPage,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'criar-servicos',
    loadChildren: () => import('./criar-servicos/criar-servicos.module').then(m => m.CriarServicosPageModule)
  },
  {
    path: 'servicos',
    loadChildren: () => import('./servicos/servicos.module').then(m => m.ServicosPageModule)
  },
  {
    path: 'plano-semanal',
    loadChildren: () => import('./plano-semanal/plano-semanal.module').then(m => m.PlanoSemanalPageModule)
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./editar-perfil/editar-perfil.module').then(m => m.EditarPerfilPageModule)
  },
  {
    path: 'editar-servicos/:numero', // Adicionado o parâmetro :numero
    loadChildren: () => import('./editar-servicos/editar-servicos.module').then(m => m.EditarServicosPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}