"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[9021],{9021:(C,g,l)=>{l.r(g),l.d(g,{PlanoSemanalPageModule:()=>_});var d=l(177),m=l(4341),n=l(4742),s=l(7291),o=l(4438);const p=["modal"];function P(e,r){if(1&e){const i=o.RV6();o.j41(0,"ion-header")(1,"ion-toolbar")(2,"ion-buttons",15)(3,"ion-button",16),o.bIt("click",function(){o.eBV(i);const a=o.XpG();return o.Njj(a.closeModal())}),o.nrm(4,"ion-icon",20),o.k0s()(),o.j41(5,"ion-title"),o.EFF(6,"Detalhes do Dia"),o.k0s()()(),o.j41(7,"ion-content")(8,"p"),o.EFF(9,"Detalhes do dia selecionado..."),o.k0s(),o.j41(10,"ion-fab",21)(11,"ion-fab-button",16),o.bIt("click",function(){o.eBV(i);const a=o.XpG();return o.Njj(a.navigateToOtherPage())}),o.nrm(12,"ion-icon",22),o.k0s()()()}}let f=(()=>{var e;class r{constructor(t){this.router=t}navigateToServicos(){this.router.navigate(["/servicos"])}openModal(t){console.log("Data selecionada:",t.detail.value),this.modal.present()}closeModal(){this.modal.dismiss()}navigateToOtherPage(){this.modal.dismiss().then(()=>{this.router.navigate(["/criar-servicos"])})}navigateToPerfil(){console.log("Navegando para o perfil..."),this.modal.dismiss().then(()=>{this.router.navigate(["/perfil"]).then(()=>{console.log("Navega\xe7\xe3o para o perfil conclu\xedda.")})})}}return(e=r).\u0275fac=function(t){return new(t||e)(o.rXU(s.Ix))},e.\u0275cmp=o.VBU({type:e,selectors:[["app-plano-semanal"]],viewQuery:function(t,a){if(1&t&&o.GBs(p,5),2&t){let c;o.mGM(c=o.lsd())&&(a.modal=c.first)}},decls:47,vars:0,consts:[["modal",""],[1,"header-container"],["size","auto"],["src","assets/icon/logotipo.png","alt","Logo",1,"logo"],[1,"user-title"],[1,"top-bar"],["size","12"],["placeholder","Procurar Tarefa"],[1,"label-title"],["interface","popover"],["value","5"],["value","7"],["value","15"],["value","30"],["presentation","date",3,"ionChange"],["slot","start"],[3,"click"],["name","checkmark-circle"],["slot","end"],["name","person"],["name","arrow-back"],["vertical","bottom","horizontal","end","slot","fixed"],["name","add-circle"]],template:function(t,a){if(1&t){const c=o.RV6();o.j41(0,"ion-header")(1,"ion-toolbar")(2,"ion-row",1)(3,"ion-col",2),o.nrm(4,"img",3),o.k0s(),o.j41(5,"ion-col")(6,"ion-title",4),o.EFF(7,"Ol\xe1, (User)"),o.k0s()()()()(),o.j41(8,"ion-content")(9,"ion-grid")(10,"ion-row",5)(11,"ion-col",6),o.nrm(12,"ion-searchbar",7),o.k0s(),o.j41(13,"ion-col",6)(14,"ion-label",8),o.EFF(15,"Cronograma"),o.k0s(),o.j41(16,"ion-select",9)(17,"ion-select-option",10),o.EFF(18,"Pr\xf3ximos 5 dias"),o.k0s(),o.j41(19,"ion-select-option",11),o.EFF(20,"Pr\xf3ximos 7 dias"),o.k0s(),o.j41(21,"ion-select-option",12),o.EFF(22,"Pr\xf3ximos 15 dias"),o.k0s(),o.j41(23,"ion-select-option",13),o.EFF(24,"Pr\xf3ximos 30 dias"),o.k0s()()()(),o.j41(25,"ion-row")(26,"ion-col")(27,"h2"),o.EFF(28,"Tarefas"),o.k0s(),o.j41(29,"p"),o.EFF(30,"Adicione suas tarefas aqui."),o.k0s()()(),o.j41(31,"ion-row")(32,"ion-col")(33,"ion-datetime",14),o.bIt("ionChange",function(M){return o.eBV(c),o.Njj(a.openModal(M))}),o.k0s()()()()(),o.j41(34,"ion-modal",null,0),o.DNE(36,P,13,0,"ng-template"),o.k0s(),o.j41(37,"ion-footer")(38,"ion-toolbar")(39,"ion-buttons",15)(40,"ion-button",16),o.bIt("click",function(){return o.eBV(c),o.Njj(a.navigateToServicos())}),o.nrm(41,"ion-icon",17),o.EFF(42," Servi\xe7os "),o.k0s()(),o.j41(43,"ion-buttons",18)(44,"ion-button",16),o.bIt("click",function(){return o.eBV(c),o.Njj(a.navigateToPerfil())}),o.nrm(45,"ion-icon",19),o.EFF(46," Perfil "),o.k0s()()()()}},dependencies:[d.MD,m.YN,n.bv,n.Jm,n.QW,n.hU,n.W9,n.A9,n.Q8,n.YW,n.M0,n.lO,n.eU,n.iq,n.he,n.ln,n.S1,n.Nm,n.Ip,n.BC,n.ai,n.Sb,n.Je,n.Gw],styles:['@charset "UTF-8";[_nghost-%COMP%]{--ion-background-color: #f0f7ff;--ion-text-color: #048}.header-container[_ngcontent-%COMP%]{display:flex;align-items:center;padding:10px;background:#07f;color:#fff}.logo[_ngcontent-%COMP%]{width:50px;height:auto;margin-right:10px}.user-title[_ngcontent-%COMP%]{font-size:1.3rem;font-weight:700;color:#fff}ion-toolbar[_ngcontent-%COMP%]{--background: #07f;--color: #fff;text-align:center;border-bottom:3px solid #0056b3}.top-bar[_ngcontent-%COMP%]{margin:15px 0}ion-label[_ngcontent-%COMP%]{font-size:1rem;font-weight:700;color:#048}ion-select[_ngcontent-%COMP%], ion-searchbar[_ngcontent-%COMP%]{--background: #fff;--border-radius: 25px;--box-shadow: 0 4px 6px rgba(0, 0, 0, .1);--color: #048;--placeholder-color: #6c757d;--placeholder-opacity: .8;padding:8px;width:100%}ion-searchbar.searchbar-has-focus[_ngcontent-%COMP%]{--box-shadow: 0 4px 12px rgba(0, 123, 255, .3);--background: #e3f2fd}ion-searchbar[_ngcontent-%COMP%]::part(search-icon){color:#07f;font-size:1.5rem}ion-searchbar[_ngcontent-%COMP%]::part(searchbar-input){font-size:1rem;font-weight:500}h2[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:700;color:#048;margin-top:20px}p[_ngcontent-%COMP%]{font-size:1rem;color:#6c757d}ion-datetime[_ngcontent-%COMP%]{width:100%;background:#e3f2fd;border-radius:10px;padding:10px;font-size:1rem;border:2px solid #07f;margin-top:15px}ion-footer[_ngcontent-%COMP%]{border-top:3px solid #0056b3}ion-button[_ngcontent-%COMP%]{--background: transparent;--color: #048;font-size:1rem;font-weight:700}ion-button[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:1.2rem;margin-right:5px}ion-modal[_ngcontent-%COMP%]{--background: #f0f7ff;--ion-background-color: #f0f7ff;--ion-text-color: #048;--width: 60%;--height: 40%;--border-radius: 10px}ion-modal[_ngcontent-%COMP%]   ion-header[_ngcontent-%COMP%], ion-modal[_ngcontent-%COMP%]   ion-footer[_ngcontent-%COMP%]{--background: #07f;--color: #fff}ion-modal[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]{--color: #fff}ion-modal[_ngcontent-%COMP%]   ion-button[slot=start][_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:1.5rem}ion-fab-button[_ngcontent-%COMP%]{--background: #38f;--background-activated: #3171e0;--color: #fff}ion-fab[_ngcontent-%COMP%]{margin-bottom:20px;margin-right:\\a0 20px}']}),r})();const b=[{path:"",component:f}];let h=(()=>{var e;class r{}return(e=r).\u0275fac=function(t){return new(t||e)},e.\u0275mod=o.$C({type:e}),e.\u0275inj=o.G2t({imports:[s.iI.forChild(b),s.iI]}),r})(),_=(()=>{var e;class r{}return(e=r).\u0275fac=function(t){return new(t||e)},e.\u0275mod=o.$C({type:e}),e.\u0275inj=o.G2t({imports:[d.MD,m.YN,n.bv,h,f]}),r})()}}]);