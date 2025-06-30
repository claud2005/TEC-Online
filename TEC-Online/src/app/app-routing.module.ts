import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignupPage } from './signup/signup.page';
import { PerfilPage } from './perfil/perfil.page'; // Importando o PerfilPage standalone
import { GestorClientesPage } from './gestor-clientes/gestor-clientes.page';

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
    loadComponent: () => import('./criar-servicos/criar-servicos.page').then(m => m.CriarServicosPage)
  },
  {
    path: 'servicos',
    loadChildren: () => import('./servicos/servicos.module').then(m => m.ServicosPageModule),
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
    path: 'editar-servicos/:numero',
    loadChildren: () => import('./editar-servicos/editar-servicos.module').then(m => m.EditarServicosPageModule),
  },
  {
    path: 'gestor-clientes',
    component: GestorClientesPage, // Usando o GestorClientesPage diretamente como componente standalone
  },
  {
    path: 'esqueceu-password',
    loadChildren: () => import('./esqueceu-password/esqueceu-password.module').then(m => m.EsqueceuPasswordPageModule),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./reset-password/reset-password.page').then(m => m.ResetPasswordPage),
  },
  {
    path: 'adicionar-cliente',
    loadChildren: () => import('./adicionar-cliente/adicionar-cliente.module').then(m => m.AdicionarClientePageModule),
  },
  {
    path: 'editar-cliente/:id',
    loadComponent: () => import('./editar-cliente/editar-cliente.page').then(m => m.EditarClientePage)
  },
  {
    path: 'orcamentos-clientes/:id',
    loadComponent: () => import('./orcamentos-clientes/orcamentos-clientes.page').then(m => m.OrcamentosClientesPage)
  },
  {
    path: 'administradores',
    loadComponent: () => import('./administradores/administradores.page').then(m => m.AdministradoresPage)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
