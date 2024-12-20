import { Component, OnInit } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'app-client-details-dashboard',
  // standalone: true,
  // imports: [],
  templateUrl: './client-details-dashboard.component.html',
  styleUrl: './client-details-dashboard.component.scss'
})
export class ClientDetailsDashboardComponent implements OnInit {
  alldatas: any

  constructor(private localservice: LocalStoreService) {

  }
  ngOnInit(): void {

    this.getonload_companydetails();


    
  }
  getonload_companydetails(){

    this.localservice.getallclients_forsuperadmin().subscribe(data=>{

      console.log("the data inasid ethe response superaDMIN ",data);
      this.alldatas = data

    })


  }


}
