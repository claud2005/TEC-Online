"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[8546],{8546:(U,c,a)=>{a.r(c),a.d(c,{EditarPerfilPageModule:()=>F});var m=a(177),s=a(4341),n=a(4742),u=a(9522),P=a(467),g=a(3114),o=a(4438),b=a(3656),E=a(1626);function C(t,l){1&t&&(o.j41(0,"ion-note",10),o.EFF(1," O nome completo \xe9 obrigat\xf3rio. "),o.k0s())}function M(t,l){1&t&&(o.j41(0,"ion-note",10),o.EFF(1," O nome de utilizador \xe9 obrigat\xf3rio. "),o.k0s())}let h=(()=>{var t;class l{constructor(e,r,i){this.platform=e,this.router=r,this.http=i,this.fotoPerfil="assets/icon/user.png",this.perfil={nomeCompleto:"",nomeUtilizador:""},this.userId="user-id",this.isWeb=!this.platform.is("hybrid")}ngOnInit(){this.carregarDadosPerfil()}carregarDadosPerfil(){this.http.get("http://localhost:3000/api/users/profile").subscribe(e=>{this.perfil.nomeCompleto=e.nomeCompleto,this.perfil.nomeUtilizador=e.nomeUtilizador,this.fotoPerfil=e.profilePicture||this.fotoPerfil},e=>{console.error("Erro ao carregar dados do perfil:",e)})}alterarFoto(){var e=this;return(0,P.A)(function*(){var r;if(e.isWeb)null===(r=document.getElementById("fileInput"))||void 0===r||r.click();else try{const i=yield g.i7.getPhoto({quality:90,allowEditing:!1,resultType:g.LK.DataUrl,source:g.ru.Prompt});i.dataUrl&&(e.fotoPerfil=i.dataUrl)}catch(i){console.error("Erro ao capturar imagem:",i)}})()}onFileSelected(e){const r=e.target.files[0];if(r){const i=new FileReader;i.onload=p=>{this.fotoPerfil=p.target.result},i.readAsDataURL(r)}}salvarPerfil(){console.log("Tentando salvar os dados do perfil:",this.perfil);const e={nomeCompleto:this.perfil.nomeCompleto,nomeUtilizador:this.perfil.nomeUtilizador,profilePicture:this.fotoPerfil},r=localStorage.getItem("jwtToken");r?(console.log("Dados do perfil a serem enviados:",e),this.http.put("http://localhost:3000/api/users/profile",e,{headers:{Authorization:`Bearer ${r}`}}).subscribe(i=>{console.log("Perfil atualizado com sucesso!",i),alert("Perfil atualizado com sucesso!"),this.router.navigate(["/perfil"])},i=>{console.error("Erro ao atualizar perfil:",i),alert(`Erro ao atualizar perfil: ${i.status} - ${i.message}`)})):alert("Voc\xea precisa estar autenticado para atualizar o perfil")}voltarParaPerfil(){this.router.navigate(["/perfil"])}}return(t=l).\u0275fac=function(e){return new(e||t)(o.rXU(b.OD),o.rXU(u.Ix),o.rXU(E.Qq))},t.\u0275cmp=o.VBU({type:t,selectors:[["app-editar-perfil"]],decls:22,vars:4,consts:[["form","ngForm"],["slot","start"],["defaultHref","/perfil"],[3,"ngSubmit"],["position","floating"],["name","nomeCompleto","aria-label","Nome Completo","required","","minlength","3",3,"ngModelChange","ngModel"],["color","danger",4,"ngIf"],["name","nomeUtilizador","aria-label","Nome de Utilizador","required","","minlength","3",3,"ngModelChange","ngModel"],["expand","full","type","submit"],["name","save-outline","slot","start"],["color","danger"]],template:function(e,r){if(1&e){const i=o.RV6();o.j41(0,"ion-header")(1,"ion-toolbar")(2,"ion-buttons",1),o.nrm(3,"ion-back-button",2),o.k0s(),o.j41(4,"ion-title"),o.EFF(5,"Editar Perfil"),o.k0s()()(),o.j41(6,"ion-content")(7,"form",3,0),o.bIt("ngSubmit",function(){return o.eBV(i),o.Njj(r.salvarPerfil())}),o.j41(9,"ion-item")(10,"ion-label",4),o.EFF(11,"Nome Completo:"),o.k0s(),o.j41(12,"ion-input",5),o.mxI("ngModelChange",function(f){return o.eBV(i),o.DH7(r.perfil.nomeCompleto,f)||(r.perfil.nomeCompleto=f),o.Njj(f)}),o.k0s()(),o.DNE(13,C,2,0,"ion-note",6),o.j41(14,"ion-item")(15,"ion-label",4),o.EFF(16,"Nome de Utilizador:"),o.k0s(),o.j41(17,"ion-input",7),o.mxI("ngModelChange",function(f){return o.eBV(i),o.DH7(r.perfil.nomeUtilizador,f)||(r.perfil.nomeUtilizador=f),o.Njj(f)}),o.k0s()(),o.DNE(18,M,2,0,"ion-note",6),o.j41(19,"ion-button",8),o.nrm(20,"ion-icon",9),o.EFF(21," Salvar "),o.k0s()()()}if(2&e){const i=o.sdS(8);o.R7$(12),o.R50("ngModel",r.perfil.nomeCompleto),o.R7$(),o.Y8G("ngIf",!r.perfil.nomeCompleto&&i.submitted),o.R7$(4),o.R50("ngModel",r.perfil.nomeUtilizador),o.R7$(),o.Y8G("ngIf",!r.perfil.nomeUtilizador&&i.submitted)}},dependencies:[n.bv,n.Jm,n.QW,n.W9,n.eU,n.iq,n.$w,n.uz,n.he,n.JI,n.BC,n.ai,n.Gw,n.el,m.MD,m.bT,s.YN,s.qT,s.BC,s.cb,s.YS,s.xh,s.vS,s.cV],styles:['@charset "UTF-8";ion-content[_ngcontent-%COMP%]{--background: #810773;position:relative;height:100vh;width:100%;margin:0;padding:0}form[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:400px;padding:24px;background:#ffffff1a;border-radius:16px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.2);box-shadow:0 4px 16px #0003;display:flex;flex-direction:column;align-items:center}ion-item[_ngcontent-%COMP%]{--background: transparent;--border-radius: 8px;width:100%;margin-bottom:16px}ion-label[_ngcontent-%COMP%]{font-weight:700;color:#fff}ion-input[_ngcontent-%COMP%]{--padding-start: 10px;font-size:16px;color:#fff}ion-button[_ngcontent-%COMP%]{--background: #ffcc00;--border-radius: 8px;margin-top:20px;font-size:18px;font-weight:700;text-transform:uppercase;width:100%}ion-note[_ngcontent-%COMP%]{display:block;margin-top:-10px;margin-bottom:16px;font-size:14px;color:#ff6b6b}']}),l})();const v=[{path:"",component:h}];let z=(()=>{var t;class l{}return(t=l).\u0275fac=function(e){return new(e||t)},t.\u0275mod=o.$C({type:t}),t.\u0275inj=o.G2t({imports:[u.iI.forChild(v),u.iI]}),l})(),F=(()=>{var t;class l{}return(t=l).\u0275fac=function(e){return new(e||t)},t.\u0275mod=o.$C({type:t}),t.\u0275inj=o.G2t({imports:[m.MD,s.YN,n.bv,z,h]}),l})()}}]);