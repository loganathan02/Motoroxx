import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanymasterComponent } from './companymaster/companymaster.component';
import { BrandandmodelComponent } from './brandandmodel/brandandmodel.component';
import { CompanycreationComponent } from './companycreation/companycreation.component';

const routes: Routes = [
    
      {
        path: 'companymaster',
        component: CompanymasterComponent
      },
      {
        path: 'brandmodelmaster',
        component: BrandandmodelComponent
      },
      {
        path: 'companycreation',
        component: CompanycreationComponent
      },


] 

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class superadminRoutingModule { }
