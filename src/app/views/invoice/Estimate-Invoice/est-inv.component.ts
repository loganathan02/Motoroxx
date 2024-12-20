import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-est-inv',
  templateUrl: './est-inv.component.html',
  styleUrls: ['./est-inv.component.scss'],
  providers: [DatePipe],
})
export class EstinvComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer: ElementRef;

  spareControl = new FormControl();
  allmasterdata: any;
  servicespares: any[] = [];

  extraspares: any[] = [];
  complaintsparedata: any[] = [];
  complaint_spares: any[] = [];
  estimate_complaints: any[] = [];
  servicelabours: any[] = [];
  extralabours: any[] = [];
  complaint_labours: any[] = []
  complaintlaboursdata: any[] = [];

  //newly added
  package: any[] = [];




  jobcarddata_byid: any;
  dialogref: any;
  searchTerm: string = '';
  selectedOption: string = 'mobile';
  jobIdToUpdate: string = '';



  rowsPerPage: number = 10;
  currentPage: number = 1;
  startIndex: number = 0;


  gspRegularPriceChecked: boolean = false;



  selectedStatusKey: string;

  dropdownOptions: { key: string; text: string }[] = [];
  customeredit_jobcardid: any;
  customeredit_userid: any;
  customeredit_vehicleid: any;
  customereditname: any;
  customereditmobile: any;

  markdelete: boolean
  upd_est_spares: any;
  upd_est_labours: any;
  esti_servicespares: any;
  esti_extraspares: any;
  esti_complaint_spares: any;
  esti_servicelabours: any;
  esti_extralabours: any;
  esti_complaint_labours: any;
  esti_complaintsparedata: any;
  esti_complaintlaboursdata: any;


  spareSuggestions: { index: number, suggestions: any[], type: string }[] = [];
  brandforsuggestion: void;
  modelforsuggestion: void;
  specific_estimatedata: any;
  specific_invoicedata: any;
  est_wheninvoiceparespopup: any;

  selectedValue: string;

  checkfiltered: boolean = false;
  dropdownvalue: any;
  groupedlabour: string;
  groupedspares: string;
  vehiclehistorydata: [];
  jobCardCount: any;


  expandedIndex: number | null = null;
  vehiclehistory_no: any;
  vehiclehistory_brand: any;
  vehiclehistory_model: any;
  groupedgsp: string;
  estigroupedlabour: string;
  estigroupedspares: string;
  estigroupedgsp: string;

  gstvariable: any;
  groupedJobcardData: unknown[];
  inventory_customers: boolean = false;
  popupshowvehcileno: any;

  uom = [
    { value:'pcs',label:'Pcs'},
    { value:'pairs',label:'Pairs'},
    { value: 'boxes', label: 'Boxes' },
    { value: 'ltrs', label: 'Ltrs' },
    // { value: '0.15', label: '' }
  ];

  overalldiscount:any = "";
  popupshowcustomername: any;
  popupshowmobile: any;
  nogst_withpartcodepdf: boolean = false;
  selectedtemplate:any = ""
  templatespares:any=[]
  templateKeys: any;
  selectedtemplatespares: any = [];
  technician: any = [];
  selectedtech:any;
  invoicetech: {};
  advisor_remarks:any = "";
  buying: any;
  paymentdata_forpaypage: any = [];
  paymentpage_popup: any;
  paymentmode: any;

  isAdvance: boolean = false;
  isfinalpayment: boolean = false
  paymentamount: any = "";
  vehiclestatus_forpaymentpage: any;
  invamount_paymentpage: any;
  isinvoice: boolean = false;
  total_payment_received: any;
  balance_amount: any;
  paymentbalance_amount: any;
  jobcardid_payment: any;
  userid_paymentpage: any;
  vehicleid_paymentpage: any;
  mobile_paymentpage: any;
  name_paymentpage: any;
  vno_paymentpage: any;
  estamount_paymentpage: any;
  isestimate: boolean = false;
  isvehiclein: boolean = false;


  constructor(private LocalStoreService: LocalStoreService, private dialog: MatDialog, private router: Router, private toastr: ToastrService,private ngbModel: NgbModal,private datePipe: DatePipe) {


  }

  ngOnInit(): void {


    this.getmasterdata_estimate();
    this.loadStatusList()
    this.loadtemplatedata()
    this.loadtechniciandata()


    this.LocalStoreService.getbranchbybranchidid().subscribe(data => {

      this.gstvariable = data.response[0]['GST']
      this.buying = data.response[0]['buying']
      if(data.response[0]['nogst_withpartcodepdf']){
        console.log("entered with true nogst_withpartcodepdf")
        this.nogst_withpartcodepdf = data.response[0]['nogst_withpartcodepdf']
      }else{
        console.log("entered with false nogst_withpartcodepdf")
        this.nogst_withpartcodepdf =  false
      }


      console.log("the data of the branchid to get gst", data.response[0]['GST'])
      console.log("the data of the inventory customer", data.inventorycustomer)

      if(data.response[0].inventorycustomer){

        this.inventory_customers = data.response[0].inventorycustomer
      }else{

        this.inventory_customers = false

      }

    })

  }



  inputDataArray = [];
  inputLabourDataArray = []
  inputinvoiceDataArray = []
  inputinvoiceLabourDataArray = []


  scrollToBottom() {
    const container = this.scrollContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }


  addInputField() {
    this.inputDataArray.push({ spare: '', qty: '', rate: '.00', gst: '', gst18: '', gst28: '', buyingprice: '.00', total: "" });

    this.scrollToBottom();

  }


  addlabourInputField() {
    this.inputLabourDataArray.push({ name: '', qty: '', gst: '18%', rate: '', total: '' });


    this.scrollToBottom();
  }



  getmasterdata_estimate() {

    var cursor = ''

    this.LocalStoreService.getmasterdata(cursor).subscribe(data => {
      this.allmasterdata = data.response;

      this.allmasterdata.forEach(item => {
        item.complaintsString = item.complaints
          .map(c => c[Object.keys(c)[1]])
          .join(', ');
      });
    });
  }


  onSearch() {



    this.currentPage = 1;

    if (!this.searchTerm) {
      this.getmasterdata_estimate()
    } else if (this.searchTerm.length >= 4) {

      this.LocalStoreService.getsearchdata_forwebapp(this.searchTerm).subscribe(searchdata => {


        this.allmasterdata = []
        this.allmasterdata = searchdata.response

        console.log("the data inside the searchdata payments",searchdata)

        this.allmasterdata.forEach(item => {
          item.complaintsString = item.complaints
            .map(c => c[Object.keys(c)[1]])
            .join(', ');
        });

      })


    }

  }





  updatesparespopup(updatesparespage, jobcarid, alldata,) {

    this.groupedgsp = '';
    this.estigroupedlabour = '';
    this.estigroupedspares = '';
    this.estigroupedgsp = '';


    this.brandforsuggestion = alldata.vehicledetails[0].brand
    this.modelforsuggestion = alldata.vehicledetails[0].model

  
    this.popupshowvehcileno = alldata.vehicledetails[0].vh_number
    this.popupshowcustomername = alldata.customers[0].name
    this.popupshowmobile = alldata.customers[0].mobile


    var flag = "jobcard"
    this.LocalStoreService.getjobcarddata(jobcarid, flag).subscribe((jobcarddata) => {
      this.jobcarddata_byid = jobcarddata.response;
      this.jobcarddata_byid.forEach((estimatedata) => {
        if (estimatedata.estimate) {

          if (estimatedata.estimate.all_labours.length > 0) {
            this.estigroupedlabour = "Labours"
          } else {
            this.estigroupedlabour = ""
          }

          if (estimatedata.estimate.all_spares.length > 0) {
            this.estigroupedspares = "Spares"
          } else {
            this.estigroupedspares = ""
          }

          if (estimatedata.estimate.service_spares.length > 0) {
            this.estigroupedgsp = "Service"
          } else {
            this.estigroupedgsp = ""
          }

          this.groupedlabour = ""
          this.groupedspares = ""
          this.groupedgsp = ""

          if (estimatedata.genralservice == "1") {
            if (estimatedata.gs_selected_option_index == "0") {
              var keyvalue = Object.keys(estimatedata.gs_selectedservice)
              var offerselectedvalue = estimatedata.gs_selectedservice[keyvalue[1]].offerselectedvalue
              var obj = {
                "spare": keyvalue[1],
                "qty": "1",
                "gst": "18%",
                "gst18": true,
                "gst28": false,
                "rate": offerselectedvalue,
                "total": offerselectedvalue,
                "amount": offerselectedvalue
              }
              this.servicespares.push(obj)
            } else if (estimatedata.gs_selected_option_index == "1") {
              var keyvalue = Object.keys(estimatedata.gs_selectedservice[2])
              var offerselectedvalue = estimatedata.gs_selectedservice[keyvalue[2]].offerselectedvalue
              var obj = {
                "spare": keyvalue[2],
                "qty": "1",
                "gst": "18%",
                "gst18": true,
                "gst28": false,
                "rate": offerselectedvalue,
                "total": offerselectedvalue,
                "amount": offerselectedvalue
              }
              this.servicespares.push(obj)
            }
          }

          this.servicespares = estimatedata.estimate.service_spares || [];
          this.extraspares = estimatedata.estimate.extra_spares || [];
          this.complaint_spares = estimatedata.estimate.complaints || [];
          this.servicelabours = estimatedata.estimate.service_labours || [];
          this.extralabours = estimatedata.estimate.extra_labours || [];
          this.complaint_labours = estimatedata.estimate.complaints || []

          this.servicespares.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
          this.extraspares.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
          this.complaint_spares.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
          this.servicelabours.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })

          this.extralabours.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
          this.complaint_labours.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })


        } else {
          if (estimatedata.genralservice == "1") {
            if (estimatedata.gs_selected_option_index == "0") {
              var keyvalue = Object.keys(estimatedata.gs_selectedservice)
              var offerselectedvalue = estimatedata.gs_selectedservice[keyvalue[1]].offerselectedvalue
              var obj = {
                "spare": keyvalue[1],
                "qty": "1",
                "gst": "18%",
                "gst18": true,
                "gst28": false,
                "rate": offerselectedvalue,
                "total": offerselectedvalue,
                "amount": offerselectedvalue
              }
              this.servicespares = []
              this.servicespares.push(obj)
            } else if (estimatedata.gs_selected_option_index == "1") {
              var keyvalue = Object.keys(estimatedata.gs_selectedservice[2])
              var offerselectedvalue = estimatedata.gs_selectedservice[keyvalue[2]].offerselectedvalue
              var obj = {
                "spare": keyvalue[2],
                "qty": "1",
                "gst": "18%",
                "gst18": true,
                "gst28": false,
                "rate": offerselectedvalue,
                "total": offerselectedvalue,
                "amount": offerselectedvalue
              }
              this.servicespares = []
              this.servicespares.push(obj)
            }
          }


          this.servicespares.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })

        }

      });
    });
    this.dialogref = this.dialog.open(updatesparespage, {

      hasBackdrop:false,
      width: '90%',
      height: "90%"
    });
    this.jobIdToUpdate = jobcarid;
    this.servicespares = []
    this.extraspares = []
    this.complaint_spares = []
    this.servicelabours = []
    this.extralabours = []
    this.complaint_labours = []
    this.inputDataArray = []
    this.inputLabourDataArray = []
  }


  updatesinvoiceparespopup(updateinvoicesparespage, jobcarid, alldata) {

    this.selectedtech = ""
    console.log("the data in the all data updatesinvoiceparespopup ",alldata)

    this.groupedgsp = '';
    this.estigroupedlabour = '';
    this.estigroupedspares = '';
    this.estigroupedgsp = '';

    this.brandforsuggestion = alldata.vehicledetails[0].brand
    this.modelforsuggestion = alldata.vehicledetails[0].model
    this.popupshowvehcileno = alldata.vehicledetails[0].vh_number
    this.popupshowcustomername = alldata.customers[0].name
    this.popupshowmobile = alldata.customers[0].mobile

    var flag = "jobcard"

    this.LocalStoreService.getjobcarddata(jobcarid, flag).subscribe((jobcarddata) => {
      this.jobcarddata_byid = jobcarddata.response;
      this.jobcarddata_byid.forEach((invoicedata) => {

        this.est_wheninvoiceparespopup = invoicedata
        if (invoicedata.invoice) {
          if(this.nogst_withpartcodepdf){
            if(invoicedata.invoice.overalldiscount){
              this.overalldiscount = invoicedata.invoice.overalldiscount
              console.log("overall discount",invoicedata.invoice.overalldiscount)
            }
          }
          if(invoicedata.invoice.technician){
            this.selectedtech = invoicedata.invoice.technician.shortname
          }else{
            this.selectedtech = ""
          }
          if(invoicedata.invoice.advisor_remarks){
            this.advisor_remarks = invoicedata.invoice.advisor_remarks
          }
          if (invoicedata.invoice.all_labours.length > 0) {
            this.groupedlabour = "Labours"
          } else {
            this.groupedlabour = ""
          }

          if (invoicedata.invoice.all_spares.length > 0) {
            this.groupedspares = "Spares"
          } else {
            this.groupedspares = ""
          }

          if (invoicedata.invoice.service_spares.length > 0) {
            this.groupedgsp = "Service"
          } else {
            this.groupedgsp = ""
          }
          this.estigroupedlabour = ""
          this.estigroupedspares = ""
          this.estigroupedgsp = ""
          this.specific_invoicedata = invoicedata

          this.servicespares = invoicedata.invoice.service_spares || [];
          this.extraspares = invoicedata.invoice.extra_spares || [];
          this.complaint_spares = invoicedata.invoice.complaints || [];
          this.servicelabours = invoicedata.invoice.service_labours || [];
          this.extralabours = invoicedata.invoice.extra_labours || [];
          this.complaint_labours = invoicedata.invoice.complaints || []

          this.servicespares.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
                if(!data.partcode){

                  data.partcode = ""
  
                }
              }
          
            }
          })
          this.extraspares.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
                if(!data.partcode){

                  data.partcode = ""
  
                }
              }
            }

           
          })
          this.complaint_spares.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
          this.servicelabours.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })

          this.extralabours.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
          this.complaint_labours.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })

          this.esti_servicespares = [];
          this.esti_extraspares = [];
          this.esti_complaint_spares = [];
          this.esti_servicelabours = [];
          this.esti_extralabours = [];
          this.esti_complaint_labours = []
        } else {
          this.jobcarddata_byid.forEach((estimatedata) => {
            if(estimatedata.estimate){

              if (estimatedata.estimate.all_labours.length > 0) {
                this.estigroupedlabour = "Labours"
              } else {
                this.estigroupedlabour = ""
              }
  
              if (estimatedata.estimate.all_spares.length > 0) {
                this.estigroupedspares = "Spares"
              } else {
                this.estigroupedspares = ""
              }
  
              if (estimatedata.estimate.service_spares.length > 0) {
  
                this.estigroupedgsp = "Service"
  
              } else {
  
                this.estigroupedgsp = ""
  
              }
  
              this.groupedlabour = ""
              this.groupedspares = ""
              this.groupedgsp = ""
  
              this.esti_servicespares = estimatedata.estimate.service_spares || [];
              this.esti_extraspares = estimatedata.estimate.extra_spares || [];
              this.esti_complaint_spares = estimatedata.estimate.complaints || [];
              this.esti_servicelabours = estimatedata.estimate.service_labours || [];
              this.esti_extralabours = estimatedata.estimate.extra_labours || [];
              this.esti_complaint_labours = estimatedata.estimate.complaints || []
  
            }else{
              if(estimatedata.genralservice){
                if (estimatedata.genralservice == "1") {
                  if (estimatedata.gs_selected_option_index == "0") {
                    var keyvalue = Object.keys(estimatedata.gs_selectedservice)
                    var offerselectedvalue = estimatedata.gs_selectedservice[keyvalue[1]].offerselectedvalue
          
                    if(this.gstvariable == ""){
                      var obj = {
                        "spare": keyvalue[1],
                        "qty": "1",
                        "gst": "18%",
                        "gst18": false,
                        "gst28": false,
                        "rate": offerselectedvalue,
                        "total": offerselectedvalue,
                        "amount": offerselectedvalue
                      }
                    }else{
                      var obj = {
                        "spare": keyvalue[1],
                        "qty": "1",
                        "gst": "18%",
                        "gst18": true,
                        "gst28": false,
                        "rate": offerselectedvalue,
                        "total": offerselectedvalue,
                        "amount": offerselectedvalue
                      }
                    }
                    this.servicespares = []
                    this.servicespares.push(obj)
                  } else if (estimatedata.gs_selected_option_index == "1") {
                    var keyvalue = Object.keys(estimatedata.gs_selectedservice[2])
                    var offerselectedvalue = estimatedata.gs_selectedservice[keyvalue[2]].offerselectedvalue
          
                    if(this.gstvariable ==""){
                      var obj = {
                        "spare": keyvalue[2],
                        "qty": "1",
                        "gst": "18%",
                        "gst18": false,
                        "gst28": false,
                        "rate": offerselectedvalue,
                        "total": offerselectedvalue,
                        "amount": offerselectedvalue
                      }
                    }else{
                      var obj = {
                        "spare": keyvalue[2],
                        "qty": "1",
                        "gst": "18%",
                        "gst18": true,
                        "gst28": false,
                        "rate": offerselectedvalue,
                        "total": offerselectedvalue,
                        "amount": offerselectedvalue
                      }
                    }
                    this.servicespares = []
                    this.servicespares.push(obj)
                  }
                }
              }
            }
              
          })



        


          this.esti_servicespares.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
          this.esti_extraspares.forEach(data => {
            if(!data.partcode){

              data.partcode = ""
            
            }
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
          this.esti_complaint_spares.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
          this.esti_servicelabours.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })

          this.esti_extralabours.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
          this.esti_complaint_labours.forEach(data => {
            if (data) {
              if (data && data.rate && !data.rate.includes('.00')) {
                data.rate += '.00';
              }
            }
          })
        }
      });
    });
    this.dialogref = this.dialog.open(updateinvoicesparespage, {
      hasBackdrop:false,
      width: '99%',
      height: "90%"
    });
    this.jobIdToUpdate = jobcarid;
    this.servicespares = []
    this.extraspares = []
    this.complaint_spares = []
    this.servicelabours = []
    this.extralabours = []
    this.complaint_labours = []
    this.inputinvoiceDataArray = []
    this.inputinvoiceLabourDataArray = []
    this.esti_servicespares = [];
    this.esti_extraspares = [];
    this.esti_complaint_spares = [];
    this.esti_servicelabours = [];
    this.esti_extralabours = [];
    this.esti_complaint_labours = []

  }

  saveinvoicedata() {
    var invoice_amount = 0;
    var invoice_amount_without_discount = 0;
    var fullspares_totalsum = 0;
    var fullspares_totalwithoutgst = 0;
    var full_spares_with_18 = 0;
    var full_spares_with_28 = 0;
    var fullspares_with_18_total = 0;
    var fullspares_total_amount = 0;
    var fullspares_with_28_total = 0;
    var packagespares_totalsum = 0;
    var package_totalwithoutgst = 0;
    var package_with_18 = 0;
    var package_with_28 = 0;
    var servicespares_totalwithoutgst = 0;
    var servicespares_totalsum = 0;
    var servicespares_with_18 = 0;
    var servicespares_with_28 = 0;
    var package_with_18_total = 0;
    var package_with_28_total = 0;
    var servicespares_with_18_total = 0;
    var servicespares_with_28_total = 0;
    var full_labours_with_18 = 0;
    var fulllabour_totalsum = 0;
    var fulllabour_totalwithoutgst = 0;
    var fulllabours_with_18_total = 0;
    var fulllabours_total_amount = 0;
    var fulllabour_totalwithoutgst2 = 0;
    var fulllabour_totalsum2 = 0;
    var finaldatainvoice = {}
    var gstcalculationspare = localStorage.getItem("gstcalculationspare");
    var gstcalculationpack = localStorage.getItem("gstcalculationpack");
    var gstcalculationlab = localStorage.getItem("gstcalculationlabour");
    if (this.est_wheninvoiceparespopup.estimate && !this.est_wheninvoiceparespopup.invoice) {
      if (this.esti_complaintsparedata) {
        this.esti_complaintsparedata.forEach(data => {
          if (!data) {
            this.esti_complaintsparedata = []
          }
        })
      }
      this.esti_extraspares.forEach(data => {
        if (!data) {
          this.esti_extraspares = []
        } else {
          if(this.gstvariable == ""){
            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;

            if(data.discount != '0'){
              let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = (amount * discount) / 100
            let amountfinal = amount - final
            data.amount = amountfinal

            }
            if(data.discount == '0' || !data.discount){
             
              data.discount = '0'
            }
            data.gst = "18%";
            data.gst18 = false,
            data.gst28 =false,
            data.percent = "0",
            data.taxablevalue = "0",
            data.rate_tax_value = "0",
            data.rate_without_gst="0",
            data.payableamount = data.amount.toString(),
            data.spares_with_18 = "0",
            data.spares_with_28 =  "0"
            fullspares_totalsum += parseFloat(data.payableamount);
            fullspares_totalwithoutgst += data.amount;
            fullspares_total_amount += fullspares_totalwithoutgst;

          }else{
            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;

            if(data.discount != '0'){
              let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = (amount * discount) / 100
            let amountfinal = amount - final
            data.amount = amountfinal
            }
            if(data.discount == '0' || !data.discount){
              data.discount = '0'
            }


            if (data.gst18 == true) {
              data.percent = "0.18";
              data.gst = "18%"
              data.gst18 = true;
              data.gst28 = false;
              if (gstcalculationspare == "true") {
                data.spares_with_18 = (data.amount * 0.18).toFixed(2);
                data.spares_with_28 = "0";
                data.taxablevalue = (data.amount * 0.18).toFixed(2);
                data.rate_tax_value = (data.amount * 0.18).toFixed(2);
                data.rate_without_gst = data.amount.toString();
                data.payableamount = data.amount.toString();
              } else {
                data.rate_tax_value =
                  (data.amount * 100 / (100 + 18)).toFixed(2);
                data.spares_with_18 =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.spares_with_28 = "0"  
                data.rate_without_gst =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.taxablevalue =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.payableamount = (data.amount * 100 / (100 + 18)).toFixed(2);
              }
              full_spares_with_18 += parseFloat(data.spares_with_18);
              fullspares_totalsum += parseFloat(data.payableamount);
              fullspares_totalwithoutgst += data.amount;
              fullspares_with_18_total += full_spares_with_18;
              fullspares_total_amount += fullspares_totalwithoutgst;
            } else if (data.gst28 == true) {
              data.gst = "28%"
              data.percent = "0.28";
              data.gst18 = false;
              data.gst28 = true;
              if (gstcalculationspare == "true") {
                data.spares_with_28 = (data.amount * 0.28).toFixed(2);
                data.spares_with_18 = "0"
                data.taxablevalue = (data.amount * 0.28).toFixed(2);
                data.rate_tax_value = (data.amount * 0.28).toFixed(2);
                data.rate_without_gst = data.amount.toString();
                data.payableamount = data.amount.toString();
              } else {
                data.rate_tax_value =
                  (data.amount * 100 / (100 + 28)).toFixed(2);
                data.spares_with_28 =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                  data.spares_with_18 = "0" 
                data.rate_without_gst =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.taxablevalue =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.payableamount = (data.amount * 100 / (100 + 28)).toFixed(2);
              }
              full_spares_with_28 += parseFloat(data.spares_with_28);
              fullspares_totalsum += parseFloat(data.payableamount);
              fullspares_totalwithoutgst += data.amount;
              fullspares_with_28_total += full_spares_with_28;
              fullspares_total_amount += fullspares_totalwithoutgst;
            }
          }
        }
      })
      if (this.esti_complaintlaboursdata) {
        this.esti_complaintlaboursdata.forEach(data => {
          if (!data) {
            this.esti_complaintlaboursdata = []
          }
        })
      }
      this.esti_extralabours.forEach(data => {
        if (!data) {
          this.esti_extralabours = []
        } else {

          if(this.gstvariable == ""){

            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;

            if(data.discount != '0'){
              let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = amount * discount / 100
            let amountfinal = amount - final
            data.amount = amountfinal
            }
            if(data.discount == '0' || !data.discount){
              data.discount = '0'
            }
            data.gst = "18%";
            data.gst18 = false,
            data.gst28 =false,
            data.percent = "0",
            data.taxablevalue = "0",
            data.rate_tax_value = "0",
            data.rate_without_gst="0",
            data.payableamount = data.amount.toString(),
            data.labour_with_18 = "0",
            data.labour_with_28 = "0",
            fulllabour_totalsum += parseFloat(data.payableamount);
            fulllabour_totalwithoutgst += data.amount;

            if (data.laborwork != 'discount') {
              fulllabour_totalwithoutgst2 += data.amount;
              fulllabour_totalsum2 += parseFloat(data.payableamount);
            }
          }else{
            
            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.percent = "0.18";
            data.amount = qty * rate;
            

            if(data.discount != '0'){
              let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = (amount * discount) / 100
            let amountfinal = amount - final
            data.amount = amountfinal
            }
            if(data.discount == '0' || !data.discount){
              data.discount = '0'
            }

            var amount2 = parseFloat(data.amount);


            data.gst18 = true;
            data.gst28 = false;
            if (gstcalculationlab == "true") {
              data.labour_with_18 = (amount2 * 0.18).toFixed(2);
              data.labour_with_28 = "0";
              data.taxablevalue = (amount2 * 0.18).toFixed(2);
              data.rate_tax_value = (amount2 * 0.18).toFixed(2);
              data.rate_without_gst = amount2.toString();
              data.payableamount = amount2.toString();
            } else {
                data.rate_tax_value = (amount2 * 100 / (100 + 18)).toFixed(2);
                data.labour_with_18 =
                  (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
                  data.labour_with_28 = "0";  
                data.rate_without_gst =
                  (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
                data.taxablevalue =
                  (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
                data.payableamount = (amount2 * 100 / (100 + 18)).toFixed(2);
            }
            if (data.laborwork != 'discount') {
              fulllabour_totalwithoutgst2 += data.amount;
              fulllabour_totalsum2 += parseFloat(data.payableamount);
            }
            full_labours_with_18 += parseFloat(data.labour_with_18);
            fulllabour_totalsum += parseFloat(data.payableamount);
            fulllabour_totalwithoutgst += data.amount;
            fulllabours_with_18_total += parseFloat(data.labour_with_18);
            fulllabours_total_amount += fulllabour_totalwithoutgst;
          }
        }
      })
      this.esti_servicespares.forEach(data => {
        if (!data) {
          this.esti_servicespares = []
        } else {
          if(this.gstvariable == ""){
            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;

            if(data.discount != '0'){
              let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = (amount * discount) / 100
            let amountfinal = amount - final
            data.amount = amountfinal
            }
            if(data.discount == '0' || !data.discount){
              data.discount = '0'
            }
            data.gst = "18%";
            data.gst18 = false,
            data.gst28 =false,
            data.percent = "0",
            data.taxablevalue = "0",
            data.rate_tax_value = "0",
            data.rate_without_gst="0",
            data.payableamount = data.amount.toString(),
            data.spares_with_18 = "0",
            data.spares_with_28 =  "0"
            packagespares_totalsum += parseFloat(data.payableamount);
            package_totalwithoutgst += data.amount;
            servicespares_totalwithoutgst += data.amount;
            servicespares_totalsum += parseFloat(data.payableamount);
          }else{
            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;

            if(data.discount != '0'){
              let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = (amount * discount) / 100
            let amountfinal = amount - final
            data.amount = amountfinal
            }
            if(data.discount == '0' || !data.discount){
              data.discount = '0'
            }


            if (data.gst == '18 %' || data.gst == '18%') {
              data.percent = "0.18";
              data.gst18 = true;
              data.gst28 = false;
              if (gstcalculationpack == "true") {
                data.spares_with_18 = (data.amount * 0.18).toFixed(2);
                 data.spares_with_28 =  "0"
                data.taxablevalue = (data.amount * 0.18).toFixed(2);
                data.rate_tax_value = (data.amount * 0.18).toFixed(2);
                data.rate_without_gst = data.amount.toString();
                data.payableamount = data.amount.toString();
              } else {
                data.rate_tax_value =
                  (data.amount * 100 / (100 + 18)).toFixed(2);
                data.spares_with_18 =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                  data.spares_with_28 =  "0"  
                data.rate_without_gst =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.taxablevalue =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.payableamount = (data.amount * 100 / (100 + 18)).toFixed(2);
              }
              package_with_18 += parseFloat(data.spares_with_18);
              package_with_18_total += parseFloat(data.spares_with_18);
              packagespares_totalsum += parseFloat(data.payableamount);
              package_totalwithoutgst += data.amount;
              servicespares_totalwithoutgst += data.amount;
              servicespares_totalsum += parseFloat(data.payableamount);
              servicespares_with_18 += parseFloat(data.spares_with_18);
              servicespares_with_18_total +=
                parseFloat(data.spares_with_18);
            } else if (data.gst == '28 %' || data.gst == '28%') {
              data.percent = "0.28";
              data.gst18 = false;
              data.gst28 = true;
              if (gstcalculationpack == "true") {
                data.spares_with_28 = (data.amount * 0.28).toFixed(2);
                data.spares_with_18 = "0"
                data.taxablevalue = (data.amount * 0.28).toFixed(2);
                data.rate_tax_value = (data.amount * 0.28).toFixed(2);
                data.rate_without_gst = data.amount.toString();
                data.payableamount = data.amount.toString();
              } else {
                data.rate_tax_value =
                  (data.amount * 100 / (100 + 28)).toFixed(2);
                data.spares_with_28 =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                  data.spares_with_18 = "0"  
                data.rate_without_gst =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.taxablevalue =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.payableamount = (data.amount * 100 / (100 + 28)).toFixed(2);
              }
              package_with_28 += parseFloat(data.spares_with_28);
              package_with_28_total += parseFloat(data.spares_with_28);
              packagespares_totalsum += parseFloat(data.payableamount);
              package_totalwithoutgst += data.amount;
              servicespares_totalwithoutgst += data.amount;
              servicespares_totalsum += parseFloat(data.payableamount);
              servicespares_with_28 += parseFloat(data.spares_with_28);
              servicespares_with_28_total +=
                parseFloat(data.spares_with_18);
            }
          }
        }
      })
      this.esti_servicelabours.forEach(data => {
        if (!data) {
          this.esti_servicelabours = []
        }
      })
      if (this.esti_complaintsparedata) {
        this.esti_complaintsparedata.forEach(data => {
          if (!data) {
            this.esti_complaintsparedata = []
          }
        })
      }
      this.esti_extraspares.forEach(data => {
        if (!data) {
          this.esti_extraspares = []
        }
      })
      if (this.esti_complaintlaboursdata) {
        this.esti_complaintlaboursdata.forEach(data => {
          if (!data) {
            this.esti_complaintlaboursdata = []
          }
        })
      }
      this.esti_extralabours.forEach(data => {
        if (!data) {
          this.esti_extralabours = []
        }
      })
      this.esti_servicespares.forEach(data => {
        if (!data) {
          this.esti_servicespares = []
        }
      })
      this.esti_servicelabours.forEach(data => {
        if (!data) {
          this.esti_servicelabours = []
        }
      })
      if (this.esti_complaintsparedata == undefined) {
        this.esti_complaintsparedata = []
      }
      if (this.esti_complaintlaboursdata == undefined) {
        this.esti_complaintlaboursdata = []
      }
    } else {
    //   if(this.specific_invoicedata){
    //     if(this.specific_invoicedata.genralservice){
    //   if (this.specific_invoicedata.genralservice == "1") {
    //     if (this.specific_invoicedata.gs_selected_option_index == "0") {
    //       var keyvalue = Object.keys(this.specific_invoicedata.gs_selectedservice)
    //       var offerselectedvalue = this.specific_invoicedata.gs_selectedservice[keyvalue[1]].offerselectedvalue

    //       if(this.gstvariable == ""){
    //         var obj = {
    //           "spare": keyvalue[1],
    //           "qty": "1",
    //           "gst": "18%",
    //           "gst18": false,
    //           "gst28": false,
    //           "rate": offerselectedvalue,
    //           "total": offerselectedvalue,
    //           "amount": offerselectedvalue
    //         }
    //       }else{
    //         var obj = {
    //           "spare": keyvalue[1],
    //           "qty": "1",
    //           "gst": "18%",
    //           "gst18": true,
    //           "gst28": false,
    //           "rate": offerselectedvalue,
    //           "total": offerselectedvalue,
    //           "amount": offerselectedvalue
    //         }
    //       }
    //       this.servicespares = []
    //       this.servicespares.push(obj)
    //     } else if (this.specific_invoicedata.gs_selected_option_index == "1") {
    //       var keyvalue = Object.keys(this.specific_invoicedata.gs_selectedservice[2])
    //       var offerselectedvalue = this.specific_invoicedata.gs_selectedservice[keyvalue[2]].offerselectedvalue

    //       if(this.gstvariable ==""){
    //         var obj = {
    //           "spare": keyvalue[2],
    //           "qty": "1",
    //           "gst": "18%",
    //           "gst18": false,
    //           "gst28": false,
    //           "rate": offerselectedvalue,
    //           "total": offerselectedvalue,
    //           "amount": offerselectedvalue
    //         }
    //       }else{
    //         var obj = {
    //           "spare": keyvalue[2],
    //           "qty": "1",
    //           "gst": "18%",
    //           "gst18": true,
    //           "gst28": false,
    //           "rate": offerselectedvalue,
    //           "total": offerselectedvalue,
    //           "amount": offerselectedvalue
    //         }
    //       }
    //       this.servicespares = []
    //       this.servicespares.push(obj)
    //     }
    //   }
    // }
    // }
      if (this.complaintsparedata) {
        this.complaintsparedata.forEach(data => {
          if (!data) {
            this.complaintsparedata = []
          }
        })
      }
      this.extraspares.forEach(data => {
        if (!data) {
          this.extraspares = []
        } else {

          if(this.gstvariable == ""){
            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;
            data.gst = "18%";
            data.gst18 = false,
            data.gst28 =false,
            data.percent = "0",
            data.taxablevalue = "0",
            data.rate_tax_value = "0",
            data.rate_without_gst="0";


            if(data.discount){
            let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = (amount * discount) / 100;
            let amountfinal = amount - final
            data.amount = amountfinal

            }
            // if(data.discount == '0' || !data.discount){
            //   data.discount_percentage = "0%"
            //   data.discount = '0'
            // }

            // if(this.nogst_withpartcodepdf){
              // if(data.discount != '0'){
              //   let discount = parseFloat(data.discount) || 0.0
              // let amount = parseFloat(data.amount) || 0.0
              // let final = amount * discount
              // let amountfinal = amount - final
              // data.amount = amountfinal

              // if(data.discount == "0.1"){
              //   data.discount_percentage = "10%"
              // }
              // if(data.discount == "0.05"){
              //   data.discount_percentage = "5%"
              // }
              // if(data.discount == "0.15"){
              //   data.discount_percentage = "5%"
              // }
              // }
              // if(data.discount == '0' || !data.discount){
              //   data.discount_percentage = "0%"
              //   data.discount = '0'
              // }
            // }
            data.payableamount = data.amount.toString(),
            data.spares_with_18 = "0",
            data.spares_with_28 = "0"
            fullspares_totalsum += parseFloat(data.payableamount);
            fullspares_totalwithoutgst += data.amount;
            fullspares_total_amount += fullspares_totalwithoutgst;


          }else{
            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;

            if(data.discount !='0'){
            let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = (amount * discount) / 100;
            let amountfinal = amount - final
            data.amount = amountfinal
            }

            if(data.discount =='0' || !data.discount){
              data.discount = '0'
            }

            if (data.gst18 == true) {
              data.percent = "0.18";
              data.gst = "18%"
              data.gst18 = true;
              data.gst28 = false;
              if (gstcalculationspare == "true") {
                data.spares_with_18 = (data.amount * 0.18).toFixed(2);
                data.spares_with_28 = "0"
                data.taxablevalue = (data.amount * 0.18).toFixed(2);
                data.rate_tax_value = (data.amount * 0.18).toFixed(2);
                data.rate_without_gst = data.amount.toString();
                data.payableamount = data.amount.toString();
              } else {
                data.rate_tax_value =
                  (data.amount * 100 / (100 + 18)).toFixed(2);
                data.spares_with_18 =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                  data.spares_with_28 = "0"  
                data.rate_without_gst =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.taxablevalue =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.payableamount = (data.amount * 100 / (100 + 18)).toFixed(2);
              }
  
              full_spares_with_18 += parseFloat(data.spares_with_18);
              fullspares_totalsum += parseFloat(data.payableamount);
              fullspares_totalwithoutgst += data.amount;
              fullspares_with_18_total += full_spares_with_18;
              fullspares_total_amount += fullspares_totalwithoutgst;
            } else if (data.gst28 = true) {
              data.percent = "0.28";
              data.gst = "28%";
              data.gst18 = false;
              data.gst28 = true;
              if (gstcalculationspare == "true") {
                data.spares_with_28 = (data.amount * 0.28).toFixed(2);
                data.spares_with_18 = "0"
                data.taxablevalue = (data.amount * 0.28).toFixed(2);
                data.rate_tax_value = (data.amount * 0.28).toFixed(2);
                data.rate_without_gst = data.amount.toString();
                data.payableamount = data.amount.toString();
              } else {
                data.rate_tax_value =
                  (data.amount * 100 / (100 + 28)).toFixed(2);
                data.spares_with_28 =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                  data.spares_with_18 = "0"  
                data.rate_without_gst =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.taxablevalue =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.payableamount = (data.amount * 100 / (100 + 28)).toFixed(2);
              }
              full_spares_with_28 += parseFloat(data.spares_with_28);
              fullspares_totalsum += parseFloat(data.payableamount);
              fullspares_totalwithoutgst += data.amount;
              fullspares_with_28_total += full_spares_with_28;
              fullspares_total_amount += fullspares_totalwithoutgst;
            }
          }
        }
      })

      this.extralabours.forEach(data => {
        if (!data) {
          this.extralabours = []
        } else {

          if(this.gstvariable == ""){

            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;
              if(data.discount != '0'){
              let discount = parseFloat(data.discount) || 0.0
              let amount = parseFloat(data.amount) || 0.0
              let final = (amount * discount) / 100
              let amountfinal = amount - final
              data.amount = amountfinal
              }

              if(data.discount =='0' || !data.discount){
                data.discount = '0'
              }
            data.gst = "18%";
            data.gst18 = false,
            data.gst28 =false,
            data.percent = "0",
            data.taxablevalue = "0",
            data.rate_tax_value = "0",
            data.rate_without_gst="0",
            data.payableamount = data.amount.toString(),
            data.labour_with_18 = "0",
            data.labour_with_28 = "0",
            fulllabour_totalsum += parseFloat(data.payableamount);
           fulllabour_totalwithoutgst += data.amount;
          fulllabours_total_amount += fulllabour_totalwithoutgst;

          if (data.laborwork != 'discount') {
            fulllabour_totalwithoutgst2 += data.amount;
            fulllabour_totalsum2 += parseFloat(data.payableamount);
          }

          }else{
            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.percent = "0.18";
            data.amount = qty * rate;
           
            if(data.discount != '0'){
              let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = (amount * discount) / 100
            let amountfinal = amount - final
            data.amount = amountfinal
           
            }
            if(data.discount =='0' || !data.discount){
              data.discount = '0'
            }
            

            var amount2 = parseFloat(data.amount);
            data.gst18 = true;
            data.gst28 = false;
            if (gstcalculationlab == "true") {
              data.labour_with_18 = (amount2 * 0.18).toFixed(2);
              data.labour_with_28 = "0";
              data.taxablevalue = (amount2 * 0.18).toFixed(2);
              data.rate_tax_value = (amount2 * 0.18).toFixed(2);
              data.rate_without_gst = amount2.toString();
              data.payableamount = amount2.toString();
            } else {
              data.rate_tax_value = (amount2 * 100 / (100 + 18)).toFixed(2);
              data.labour_with_18 =
                (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
                data.labour_with_28 = "0";  
              data.rate_without_gst =
                (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
              data.taxablevalue =
                (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
              data.payableamount = (amount2 * 100 / (100 + 18)).toFixed(2);
            }
            if (data.laborwork != 'discount') {
              fulllabour_totalwithoutgst2 += data.amount;
              fulllabour_totalsum2 += parseFloat(data.payableamount);
            }
            full_labours_with_18 += parseFloat(data.labour_with_18);
            fulllabour_totalsum += parseFloat(data.payableamount);
            fulllabour_totalwithoutgst += data.amount;
            fulllabours_with_18_total += parseFloat(data.labour_with_18);
            fulllabours_total_amount += fulllabour_totalwithoutgst;
          }
        }
      })

      this.servicespares.forEach(data => {
        if (!data) {
          this.servicespares = []
        } else {
          if(this.gstvariable == ""){
            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;
            if(data.discount != '0'){
              let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = (amount * discount) / 100
            let amountfinal = amount - final
            data.amount = amountfinal
            }
            if(data.discount == '0' || !data.discount){
              data.discount = '0'
            }
            data.gst = "18%";
            data.gst18 = false,
            data.gst28 =false,
            data.percent = "0",
            data.taxablevalue = "0",
            data.rate_tax_value = "0",
            data.rate_without_gst="0",
            data.payableamount = data.amount.toString(),
            data.spares_with_18 = "0",
            data.spares_with_28 = "0"
            packagespares_totalsum += parseFloat(data.payableamount);
            package_totalwithoutgst += data.amount;
            servicespares_totalwithoutgst += data.amount;
            servicespares_totalsum += parseFloat(data.payableamount)
          }else{
            var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;
            if(data.discount != '0'){
              let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = (amount * discount) / 100
            let amountfinal = amount - final
            data.amount = amountfinal
            }
            if(data.discount == '0' || !data.discount){
              data.discount = '0'
            }


            if (data.gst18 = true) {
              data.percent = "0.18";
              data.gst = "18%";
              data.gst18 = true;
              data.gst28 = false;
              if (gstcalculationpack == "true") {
                data.spares_with_18 = (data.amount * 0.18).toFixed(2);
                data.taxablevalue = (data.amount * 0.18).toFixed(2);
                data.rate_tax_value = (data.amount * 0.18).toFixed(2);
                data.rate_without_gst = data.amount.toString();
                data.payableamount = data.amount.toString();
              } else {
                data.rate_tax_value =
                  (data.amount * 100 / (100 + 18)).toFixed(2);
                data.spares_with_18 =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.rate_without_gst =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.taxablevalue =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.payableamount = (data.amount * 100 / (100 + 18)).toFixed(2);
              }
              package_with_18 += parseFloat(data.spares_with_18);
              package_with_18_total += parseFloat(data.spares_with_18);
              packagespares_totalsum += parseFloat(data.payableamount);
              package_totalwithoutgst += data.amount;
              servicespares_totalwithoutgst += data.amount;
              servicespares_totalsum += parseFloat(data.payableamount);
              servicespares_with_18 += parseFloat(data.spares_with_18);
              servicespares_with_18_total +=
                parseFloat(data.spares_with_18);
            } else if (data.gst28 = true) {
              data.percent = "0.28";
              data.gst = "28%";
              data.gst18 = false;
              data.gst28 = true;
              if (gstcalculationpack == "true") {
                data.spares_with_28 = (data.amount * 0.28).toFixed(2);
                data.taxablevalue = (data.amount * 0.28).toFixed(2);
                data.rate_tax_value = (data.amount * 0.28).toFixed(2);
                data.rate_without_gst = data.amount.toString();
                data.payableamount = data.amount.toString();
              } else {
                data.rate_tax_value =
                  (data.amount * 100 / (100 + 28)).toFixed(2);
                data.spares_with_28 =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.rate_without_gst =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.taxablevalue =
                  (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.payableamount = (data.amount * 100 / (100 + 28)).toFixed(2);
              }
              package_with_28 += parseFloat(data.spares_with_28);
              package_with_28_total += parseFloat(data.spares_with_28);
              packagespares_totalsum += parseFloat(data.payableamount);
              package_totalwithoutgst += data.amount;
              servicespares_totalwithoutgst += data.amount;
              servicespares_totalsum += parseFloat(data.payableamount);
              servicespares_with_28 += parseFloat(data.spares_with_28);
              servicespares_with_28_total +=
                parseFloat(data.spares_with_28); 
            }
          }
        }
      })
      this.servicelabours.forEach(data => {
        if (!data) {
          this.servicelabours = []
        }
      })
      if (this.complaintsparedata) {
        this.complaintsparedata.forEach(data => {
          if (!data) {
            this.complaintsparedata = []
          }
        })
      }
      this.extraspares.forEach(data => {
        if (!data) {
          this.extraspares = []
        }
      })
      if (this.complaintlaboursdata) {
        this.complaintlaboursdata.forEach(data => {
          if (!data) {
            this.complaintlaboursdata = []
          }
        })
      }
      this.extralabours.forEach(data => {
        if (!data) {
          this.extralabours = []
        }
      })
      this.servicespares.forEach(data => {
        if (!data) {
          this.esti_servicespares = []
        }
      })
      this.servicelabours.forEach(data => {
        if (!data) {
          this.servicelabours = []
        }
      })
      if (this.esti_complaintsparedata == undefined) {
        this.complaintsparedata = []
      }
      if (this.esti_complaintlaboursdata == undefined) {
        this.complaintlaboursdata = []
      }
    }
    
    if(this.selectedtemplatespares.length > 0){
      this.inputinvoiceDataArray = this.inputinvoiceDataArray.concat(this.selectedtemplatespares);
    }

    this.inputinvoiceDataArray.forEach(data => {

      console.log("the data inside the inputinvoicedataarray",data)

      // return
      if (!data) {
        this.inputinvoiceDataArray = []
      } else {

        if(this.gstvariable == ""){

          console.log("entered without the gstvariableinputinvoice")
          var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;
            data.amount = qty * rate;
            data.gst = "18%";
            data.gst18 = false,
            data.gst28 =false,
            data.percent = "0",
            data.taxablevalue = "0",
            data.rate_tax_value = "0",
            data.rate_without_gst="0";
              if(data.discount != '0'){
                let discount = parseFloat(data.discount) || 0.0
                let amount = parseFloat(data.amount) || 0.0
                let final = amount * discount
                let amountfinal = amount - final / 100
                data.amount = amountfinal
              }
              if(data.discount =='0' || !data.discount){
                data.discount = '0'
              }
            data.payableamount = data.amount.toString(),
            data.spares_with_18 = "0",
            data.spares_with_28 = "0",
            fullspares_totalsum += parseFloat(data.payableamount);
            fullspares_totalwithoutgst += data.amount;
            fullspares_total_amount += fullspares_totalwithoutgst;
          
        }else{

          console.log("entered without the gstvariableinputinvoice nooo")
          var qty = parseFloat(data.qty) || 0.0;
          var rate = parseFloat(data.rate) || 0.0;
          data.amount = qty * rate;

          if(data.discount != '0'){
            let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = amount * discount / 100
            let amountfinal = amount - final
            data.amount = amountfinal
          }

          if(data.discount =='0' || !data.discount){
            data.discount = '0'
          }
          if (data.gst18 == true) {
            data.percent = "0.18";
            data.gst = "18%"
            data.gst18 = true;
            data.gst28 = false;
            if (gstcalculationspare == "true") {
              data.spares_with_18 = (data.amount * 0.18).toFixed(2);
              data.spares_with_28 = "0",
              data.taxablevalue = (data.amount * 0.18).toFixed(2);
              data.rate_tax_value = (data.amount * 0.18).toFixed(2);
              data.rate_without_gst = data.amount.toString();
              data.payableamount = data.amount.toString();
            } else {
              data.rate_tax_value =
                (data.amount * 100 / (100 + 18)).toFixed(2);
              data.spares_with_18 =
                (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
                data.spares_with_28 = "0",  
              data.rate_without_gst =
                (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
              data.taxablevalue =
                (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
              data.payableamount = (data.amount * 100 / (100 + 18)).toFixed(2);
            }
            full_spares_with_18 += parseFloat(data.spares_with_18);
            fullspares_totalsum += parseFloat(data.payableamount);
            fullspares_totalwithoutgst += data.amount;
            fullspares_with_18_total += full_spares_with_18;
            fullspares_total_amount += fullspares_totalwithoutgst;
          } else if (data.gst28 == true) {
            data.percent = "0.28";
            data.gst = "28%"
            data.gst18 = false;
            data.gst28 = true;
            if (gstcalculationspare == "true") {
              data.spares_with_28 = (data.amount * 0.28).toFixed(2);
              data.spares_with_18 = "0",
              data.taxablevalue = (data.amount * 0.28).toFixed(2);
              data.rate_tax_value = (data.amount * 0.28).toFixed(2);
              data.rate_without_gst = data.amount.toString();
              data.payableamount = data.amount.toString();
            } else {
              data.rate_tax_value =
                (data.amount * 100 / (100 + 28)).toFixed(2);
              data.spares_with_28 =
                (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);

                data.spares_with_18 = "0",  
  
              data.rate_without_gst =
                (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
              data.taxablevalue =
                (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
              data.payableamount = (data.amount * 100 / (100 + 28)).toFixed(2);
            }
            full_spares_with_28 += parseFloat(data.spares_with_28);
            fullspares_totalsum += parseFloat(data.payableamount);
            fullspares_totalwithoutgst += data.amount;
            fullspares_with_28_total += parseFloat(data.spares_with_28);
            fullspares_total_amount += fullspares_totalwithoutgst;
          }
          // else{

          //   data.percent = "0.18";
          //   data.gst = "18%"
          //   data.gst18 = true;
          //   data.gst28 = false;
          //   if (gstcalculationspare == "true") {
          //     data.spares_with_18 = (data.amount * 0.18).toFixed(2);
          //     data.spares_with_28 = "0";
          //     data.taxablevalue = (data.amount * 0.18).toFixed(2);
          //     data.rate_tax_value = (data.amount * 0.18).toFixed(2);
          //     data.rate_without_gst = data.amount.toString();
          //     data.payableamount = data.amount.toString();
          //   } else {
          //     data.rate_tax_value =
          //       (data.amount * 100 / (100 + 18)).toFixed(2);
          //     data.spares_with_18 =
          //       (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
          //       data.spares_with_28 = "0",  
          //     data.rate_without_gst =
          //       (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
          //     data.taxablevalue =
          //       (data.amount - parseFloat(data.rate_tax_value)).toFixed(2);
          //     data.payableamount = (data.amount * 100 / (100 + 18)).toFixed(2);
          //   }
          //   full_spares_with_18 += parseFloat(data.spares_with_18);
          //   fullspares_totalsum += parseFloat(data.payableamount);
          //   fullspares_totalwithoutgst += data.amount;
          //   fullspares_with_18_total += full_spares_with_18;
          //   fullspares_total_amount += fullspares_totalwithoutgst;

          // } 
        }
      }
    })
    this.inputinvoiceLabourDataArray.forEach(data => {
      if (!data) {
        this.inputinvoiceLabourDataArray = []

      } else {

        if(this.gstvariable == ""){

          var qty = parseFloat(data.qty) || 0.0;
            var rate = parseFloat(data.rate) || 0.0;

           
            data.amount = qty * rate;
              if(data.discount != '0' ){
                let discount = parseFloat(data.discount) || 0.0
                let amount = parseFloat(data.amount) || 0.0
                let final = amount * discount / 100
                let amountfinal = amount - final
                data.amount = amountfinal
              }
              if(data.discount =='0' || !data.discount){
                data.discount = '0'
              }
            data.gst = "18%";
            data.gst18 = false,
            data.gst28 =false,
            data.percent = "0",
            data.taxablevalue = "0",
            data.rate_tax_value = "0",
            data.rate_without_gst="0",
            data.payableamount = data.amount.toString(),
            data.labour_with_18 = "0",
            data.labour_with_28 = "0",
            fulllabour_totalsum += parseFloat(data.payableamount);
            fulllabour_totalwithoutgst += data.amount;
            fulllabours_total_amount += fulllabour_totalwithoutgst;

            if (data.laborwork != 'discount') {
              fulllabour_totalwithoutgst2 += data.amount;
              fulllabour_totalsum2 += parseFloat(data.payableamount);
            }
        }else{
          var qty = parseFloat(data.qty) || 0.0;
          var rate = parseFloat(data.rate) || 0.0;
          data.percent = "0.18";
          data.amount = qty * rate;
          var amount2 = parseFloat(data.amount);

          if(data.discount){
            let discount = parseFloat(data.discount) || 0.0
            let amount = parseFloat(data.amount) || 0.0
            let final = amount * discount / 100
            let amountfinal = amount - final
            data.amount = amountfinal
          }
          if(data.discount =='0' || !data.discount){
            data.discount = '0'
          }
          data.gst18 = true;
          data.gst28 = false;
          if (gstcalculationlab == "true") {
            data.labour_with_18 = (amount2 * 0.18).toFixed(2);
            data.labour_with_28 = "0";
            data.taxablevalue = (amount2 * 0.18).toFixed(2);
            data.rate_tax_value = (amount2 * 0.18).toFixed(2);
            data.rate_without_gst = amount2.toString();
            data.payableamount = amount2.toString();
          } else {
            data.rate_tax_value = (amount2 * 100 / (100 + 18)).toFixed(2);
            data.labour_with_18 =
              (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
              data.labour_with_28 = "0";  
            data.rate_without_gst =
              (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
            data.taxablevalue =
              (amount2 - parseFloat(data.rate_tax_value)).toFixed(2);
            data.payableamount = (amount2 * 100 / (100 + 18)).toFixed(2);
          }
          if (data.laborwork != 'discount') {
            fulllabour_totalwithoutgst2 += data.amount;
            fulllabour_totalsum2 += parseFloat(data.payableamount);
          }
          full_labours_with_18 += parseFloat(data.labour_with_18);
          fulllabour_totalsum += parseFloat(data.payableamount);
          fulllabour_totalwithoutgst += data.amount;
          fulllabours_with_18_total += parseFloat(data.labour_with_18);
          fulllabours_total_amount += fulllabour_totalwithoutgst;
        }
      }
    })
    invoice_amount = fullspares_totalwithoutgst +
      fulllabour_totalwithoutgst +
      package_totalwithoutgst;
    invoice_amount_without_discount = fullspares_totalwithoutgst +
      fulllabour_totalwithoutgst2 +
      package_totalwithoutgst;

      if(this.gstvariable !== ""){
        if (gstcalculationspare == "true") {
          invoice_amount += fullspares_with_18_total + fullspares_with_28_total;
          invoice_amount_without_discount +=
            fullspares_with_18_total + fullspares_with_28_total;
        }
        if (gstcalculationlab == "true") {
          invoice_amount += fulllabours_with_18_total;
          invoice_amount_without_discount += fulllabours_with_18_total;
        }
        if (gstcalculationpack == "true") {
          invoice_amount += package_with_18_total;
          invoice_amount_without_discount += package_with_18_total;
        }
      }

    var inv_reference
    var inv_adv_remarks
    var inv_gsText
    var inv_cusgst
    var shopusername
    var ShopuserId
    var proforma_reference
    shopusername = localStorage.getItem("shopusername");
    ShopuserId = localStorage.getItem("ShopuserId");
    let techdata
    if (this.specific_invoicedata) {
      inv_reference = this.specific_invoicedata.invoice.invoice_reference_number
      proforma_reference = this.specific_invoicedata.invoice.proforma_invoice_reference_number
      inv_adv_remarks = this.specific_invoicedata.invoice.advisor_remarks
      inv_gsText = this.specific_invoicedata.invoice.general_service
      inv_cusgst = this.specific_invoicedata.invoice.customer_GST
      if(this.specific_invoicedata.invoice.technician){
        techdata = this.specific_invoicedata.invoice.technician
      }else{
        techdata = this.invoicetech
      }

      if(this.specific_invoicedata.invoice.advisor_remarks){
        inv_adv_remarks = this.specific_invoicedata.invoice.advisor_remarks

      }else{
        inv_adv_remarks = this.advisor_remarks
      }
    } else {

      console.log("entered into the else invoicetech ",this.invoicetech)
      inv_reference = ""
      inv_adv_remarks = this.advisor_remarks
      inv_gsText = ""
      inv_cusgst = "NA"
      techdata = this.invoicetech
    }
    finaldatainvoice["complaints"] = this.complaint_spares.concat(this.esti_complaint_spares);
    finaldatainvoice["extra_labours"] = this.extralabours.concat(this.inputinvoiceLabourDataArray, this.esti_extralabours);
    finaldatainvoice["extra_spares"] = this.extraspares.concat(this.inputinvoiceDataArray, this.esti_extraspares);
    finaldatainvoice["all_spares"] = this.extraspares.concat(this.inputinvoiceDataArray, this.esti_extraspares);
    finaldatainvoice["all_labours"] = this.extralabours.concat(this.inputinvoiceLabourDataArray, this.esti_extralabours);
    finaldatainvoice["service_spares"] = this.servicespares.concat(this.esti_servicespares);
    finaldatainvoice["package"] = this.servicespares.concat(this.esti_servicespares);
    finaldatainvoice["service_labours"] = this.servicelabours.concat(this.esti_servicelabours);
    finaldatainvoice["advisor_remarks"] = inv_adv_remarks;

    // console.log("the data inside the invoice amount overalldiscount",this.overalldiscount)
    finaldatainvoice["invoice_amount"] = invoice_amount.toFixed(2);
    
    if(this.nogst_withpartcodepdf){
       if(this.overalldiscount){
        console.log("the data inside the invoice amount overalldiscount",this.overalldiscount)
        finaldatainvoice["overalldiscount"] = this.overalldiscount
        let invamount = invoice_amount - parseFloat(this.overalldiscount);
        finaldatainvoice["invoice_amount"] = invamount.toFixed(2);
        console.log("the data inside the invoice amount overalldiscount",invamount)
       }
    }
    console.log("the invoice amount after",invoice_amount)
    // return
    finaldatainvoice['invoice_amount_without_discount'] = invoice_amount_without_discount.toFixed(2);
    finaldatainvoice["general_service"] = inv_gsText;
    finaldatainvoice["invoice_reference_number"] = inv_reference;
    finaldatainvoice["proforma_invoice_reference_number"] = proforma_reference;
    finaldatainvoice["customer_GST"] = inv_cusgst;
    finaldatainvoice["service_spare_totalamount"] =
      servicespares_totalwithoutgst.toFixed(2);
    finaldatainvoice["service_spare_totalwithoutgst"] =
      packagespares_totalsum.toFixed(2);
    finaldatainvoice["fullspares_total_amount"] =
      fullspares_totalwithoutgst.toFixed(2);
    finaldatainvoice["fullspares_totalwithoutgst"] =
      fullspares_totalsum.toFixed(2);
    finaldatainvoice["fulllabours_total_amount"] =
      fulllabour_totalwithoutgst.toFixed(2);
    finaldatainvoice["fulllabours_totalwithoutgst"] =
      fulllabour_totalsum.toFixed(2);
    
    finaldatainvoice["package_totalwithoutgst"] =
      packagespares_totalsum.toFixed(2);
    finaldatainvoice["package_total_amount"] =
      package_totalwithoutgst.toFixed(2);
    
    finaldatainvoice["shopusername"] = shopusername;
    finaldatainvoice["ShopuserId"] = ShopuserId;
    if(this.gstvariable !==""){
      finaldatainvoice["fullspares_with_18_total"] =
      full_spares_with_18.toFixed(2);
    finaldatainvoice["fullspares_with_28_total"] =
      full_spares_with_28.toFixed(2);
    finaldatainvoice["fulllabours_with_18_total"] =
      fulllabours_with_18_total.toFixed(2);
    finaldatainvoice["package_with_18_total"] =
      package_with_18.toFixed(2);   
    }

    if(this.selectedtech != ""){

      finaldatainvoice["technician"] = techdata
      finaldatainvoice["technician_name"] = techdata.shortname
    }
    console.log("entered into the else invoicetech final ",finaldatainvoice["technician"])

    const allIssued = finaldatainvoice['extra_spares'].every(data => data.issued === true || this.gstvariable == "");
    const allsparegst = finaldatainvoice['all_spares'].every(data => data.gst18 == true || data.gst28 == true || this.gstvariable == "")
    const alllabourgst = finaldatainvoice['all_labours'].every(data => data.gst18 == true || this.gstvariable == "")
    const purrate = finaldatainvoice['extra_spares'].every(data => data.buyingprice != "")
    // return
    if (allsparegst && alllabourgst ) {
      this.LocalStoreService.updateinvoicespares(this.jobIdToUpdate, finaldatainvoice).subscribe(data => {
        this.servicespares = []
        this.extraspares = []
        this.complaint_spares = []
        this.servicelabours = []
        this.extralabours = []
        this.complaint_labours = []
        this.inputinvoiceDataArray = []
        this.inputinvoiceLabourDataArray = []
        this.complaintsparedata = []
        this.complaintlaboursdata = []
        this.esti_servicespares = [];
        this.esti_extraspares = [];
        this.esti_complaint_spares = [];
        this.esti_servicelabours = [];
        this.esti_extralabours = [];
        this.esti_complaint_labours = []
        this.esti_complaintsparedata = []
        this.esti_complaintlaboursdata = []
        this.overalldiscount = ''
        this.selectedtemplatespares = []
        this.toastr.info('Success!', 'invoice saved successfully');
        this.getmasterdata_estimate();
        this.closedialog()
      })


    } else {
      this.toastr.error('Err!', 'gst or issued checkbox is empty');
    }
  }

  editinvoicedata() {
    this.complaint_spares.forEach(data => {
      this.complaintsparedata = this.complaintsparedata.concat(data.spares);
    });

    this.complaint_labours.forEach(data => {
      this.complaintlaboursdata = this.complaintlaboursdata.concat(data.labour);
    })

    this.complaintsparedata.forEach(data => {
      if (!data) {
        this.complaintsparedata = []
      }
    })
    this.extraspares.forEach(data => {
      if (!data) {
        this.extraspares = []
      }
    })
    this.inputDataArray.forEach(data => {
      if (!data) {
        this.inputDataArray = []
      }
    })
    this.complaintlaboursdata.forEach(data => {
      if (!data) {
        this.complaintlaboursdata = []
      }

    })
    this.extralabours.forEach(data => {
      if (!data) {
        this.extralabours = []
      }
    })
    this.inputLabourDataArray.forEach(data => {
      if (!data) {
        this.inputLabourDataArray = []
      }
    })
    this.servicespares.forEach(data => {
      if (!data) {
        this.servicespares = []
      }
    })
    this.servicelabours.forEach(data => {
      if (!data) {
        this.servicelabours = []
      }
    })

    const combainedforextraspare = this.extraspares.concat(this.inputDataArray)
    const combainedforextralab = this.extralabours.concat(this.inputLabourDataArray)
    const combinedArray = this.servicespares.concat(this.complaintsparedata, combainedforextraspare);
    const CombinedLabourArray = this.servicelabours.concat(this.complaintlaboursdata, combainedforextralab);


    this.LocalStoreService.edit_for_invoicerunning_running_number(this.jobIdToUpdate, this.servicespares, this.complaint_spares, combainedforextraspare, combinedArray, this.inputDataArray, this.servicelabours, this.complaint_labours, combainedforextralab, CombinedLabourArray, this.inputLabourDataArray).subscribe(data => {

      this.servicespares = [];
      this.extraspares = [];
      this.complaint_spares = [];
      this.servicelabours = [];
      this.extralabours = [];
      this.complaint_labours = []
      this.inputDataArray = []
      this.inputLabourDataArray = []
      this.inputinvoiceDataArray = []
      this.inputinvoiceLabourDataArray = []
      this.complaintlaboursdata = [],
        this.complaintsparedata = []

      this.closedialog()
    })

  }


  downloadinvoicepdf() {

    var gstcalculationspare = localStorage.getItem("gstcalculationspare");
    var gstcalculationpack = localStorage.getItem("gstcalculationpack");
    var gstcalculationlab = localStorage.getItem("gstcalculationlabour");

    var gstcalculation = {
      "spareplusgst": gstcalculationspare === "true",
      "labourplusgst": gstcalculationlab === "true",
      "packageplusgst": gstcalculationpack === "true",
    }


    let gstcalculationString = encodeURIComponent(JSON.stringify(gstcalculation));

    var type = 7;
    let popupWindow = window.open(`${environment.apiUrl}/pdf/generatePdf_newreq?jobcardid=${this.jobIdToUpdate}&type=${type}&gstcalculation=${gstcalculationString}`);

    this.servicespares = []
    this.extraspares = []
    this.complaint_spares = []
    this.servicelabours = []
    this.extralabours = []
    this.complaint_labours = []
    this.inputinvoiceDataArray = []
    this.inputinvoiceLabourDataArray = []
    this.complaintsparedata = []
    this.complaintlaboursdata = []

    this.getmasterdata_estimate();

    this.closedialog()
  }

  addinvoiceInputField() {



    // if(this.gstvariable !=""){
    //   this.inputinvoiceDataArray.push({ spare: '', qty: '', rate: '.00', gst: '', gst18: '', gst28: '' });

    // }else{
    //   this.inputinvoiceDataArray.push({ spare: '', qty: '', rate: '.00' });

    // }



    this.inputinvoiceDataArray.push({ partcode: '', spare: '', qty: '', rate: '.00', gst: '', gst18: '', gst28: '' });



    this.scrollToBottom();

  }

  addinvoicelabourInputField() {

    this.inputinvoiceLabourDataArray.push({ name: '', qty: '', rate: '.00', gst: '18%', gst18: '', gst28: '' });
    this.scrollToBottom();

  }

  // handleCheckboxChange(gst, checkboxType) {
  //   if(checkboxType == 'gst18'){
  //     gst.gst28 = false
  //   }else if(checkboxType == 'gst28') {
  //     gst.gst18 = false

  //   }





  //   // if (gsp[checkboxType]) {
  //   //   // If the current checkbox is checked, uncheck the other checkboxes
  //   //   for (const key in gsp) {
  //   //     if (key !== checkboxType && typeof gsp[key] === 'boolean') {
  //   //       gsp[key] = false;
  //   //     }
  //   //   }
  //   // }
  // }



  handleCheckboxChange(gst, checkboxType) {
    if (checkboxType === 'gst18') {
      gst.gst28 = false;
    } else if (checkboxType === 'gst28') {
      gst.gst18 = false;
    }
    // this.extraspares = [...this.extraspares];
  }


  closedialog() {
    this.dialogref.close();
    this.selectedtech = ""
  }

  saveData() {
    var fullspares_totalsum = 0;
    var fulllabour_totalsum = 0;
    var fulllabour_totalsum2 = 0;
    var servicespares_totalsum = 0;
    var package_totalsum = 0;

    this.complaint_spares.forEach(data => {
      this.complaintsparedata = this.complaintsparedata.concat(data.spares);
    });

    this.complaint_labours.forEach(data => {

      this.complaintlaboursdata = this.complaintlaboursdata.concat(data.labour);

    })

    this.complaintsparedata.forEach(data => {
      if (!data) {
        this.complaintsparedata = []
      }
    })
    this.extraspares.forEach(data => {
      if (!data) {
        this.extraspares = []
      } else {
        var qty = parseFloat(data.qty) || 0.0;
        var rate = parseFloat(data.rate) || 0.0;
        data.amount = qty * rate;
        data.total = (qty * rate).toFixed(2);
        fullspares_totalsum += data.amount;
      }
    })


    this.inputDataArray.forEach(data => {
      if (!data) {
        this.inputDataArray = []
      } else {
        var qty = parseFloat(data.qty) || 0.0;
        var rate = parseFloat(data.rate) || 0.0;
        data.amount = qty * rate;
        data.total = (qty * rate).toFixed(2);
        fullspares_totalsum += data.amount;

      }
    })
    this.complaintlaboursdata.forEach(data => {
      if (!data) {
        this.complaintlaboursdata = []
      }

    })
    this.extralabours.forEach(data => {
      if (!data) {
        this.extralabours = []
      } else {
        var qty = parseFloat(data.qty) || 0.0;
        var rate = parseFloat(data.rate) || 0.0;
        data.amount = qty * rate;
        data.total = (qty * rate).toFixed(2);
        fulllabour_totalsum += data.amount;

        if (data.name != "discount") {
          var qty = parseFloat(data.qty) || 0.0;
          var rate = parseFloat(data.rate) || 0.0;
          data.amount = qty * rate;
          data.total = (qty * rate).toFixed(2);
          fulllabour_totalsum2 += data.amount;
        }
      }
    })
    this.inputLabourDataArray.forEach(data => {
      if (!data) {
        this.inputLabourDataArray = []
      } else {
        var qty = parseFloat(data.qty) || 0.0;
        var rate = parseFloat(data.rate) || 0.0;
        data.amount = qty * rate;
        data.total = (qty * rate).toFixed(2);
        fulllabour_totalsum += data.amount;
        fulllabour_totalsum2 += data.amount;
      }
    })
    this.servicespares.forEach(data => {
      if (!data) {
        this.servicespares = []
      } else {
        var qty = parseFloat(data.qty) || 0.0;
        var rate = parseFloat(data.rate) || 0.0;
        data.amount = qty * rate;
        data.total = (qty * rate).toFixed(2);
        package_totalsum += data.amount;
        servicespares_totalsum += data.amount;

      }
    })
    this.servicelabours.forEach(data => {
      if (!data) {
        this.servicelabours = []
      }

    })
    var finaldataestimate = {}
    this.specific_estimatedata
    var est_reference
    var adv_remarks
    var shopusername
    var ShopuserId

    shopusername = localStorage.getItem("shopusername");
    ShopuserId = localStorage.getItem("ShopuserId");

    if (this.specific_estimatedata) {
      est_reference = this.specific_estimatedata.estimate.estimate_reference_number
      adv_remarks = this.specific_estimatedata.estimate.advisor_remarks
    } else {
      est_reference = ""
      adv_remarks = ""
    }

    finaldataestimate["complaints"] = this.complaint_spares;
    finaldataestimate["extra_labours"] = this.extralabours.concat(this.inputLabourDataArray);
    finaldataestimate["extra_spares"] = this.extraspares.concat(this.inputDataArray);
    finaldataestimate["all_spares"] = this.extraspares.concat(this.inputDataArray);
    finaldataestimate["all_labours"] = this.extralabours.concat(this.inputLabourDataArray);
    finaldataestimate["service_spares"] = this.servicespares;
    finaldataestimate["service_labours"] = this.servicelabours
    finaldataestimate["package"] = this.servicespares
    finaldataestimate["advisor_remarks"] = adv_remarks;
    finaldataestimate["service_spare_totalamount"] = servicespares_totalsum;
    finaldataestimate["package_spare_totalamount"] = package_totalsum;
    finaldataestimate["fullspares_total_amount"] = fullspares_totalsum;
    finaldataestimate["fulllabours_total_amount"] = fulllabour_totalsum;
    finaldataestimate["estimate_amount"] =
      fullspares_totalsum + fulllabour_totalsum + package_totalsum;
    finaldataestimate["estimate_amount_without_discount"] =
      fullspares_totalsum + fulllabour_totalsum2 + package_totalsum;
    finaldataestimate["estimate_reference_number"] = est_reference;


    finaldataestimate["shopusername"] = shopusername;
    finaldataestimate["ShopuserId"] = ShopuserId;


    this.LocalStoreService.updateallspares(this.jobIdToUpdate, finaldataestimate).subscribe(data => {

      // this.inputDataArray.forEach(data => {



      // })



      this.servicespares = []
      this.extraspares = []
      this.complaint_spares = []
      this.servicelabours = []
      this.extralabours = []
      this.complaint_labours = []
      this.inputinvoiceDataArray = []
      this.inputinvoiceLabourDataArray = []
      this.complaintsparedata = []
      this.complaintlaboursdata = []
      this.getmasterdata_estimate();
      this.closedialog()
    })
  }

  downloadestimate() {

    var gstcalculationspare = localStorage.getItem("gstcalculationspare");
    var gstcalculationpack = localStorage.getItem("gstcalculationpack");
    var gstcalculationlab = localStorage.getItem("gstcalculationlabour");

    var gstcalculation = {
      "spareplusgst": gstcalculationspare,
      "labourplusgst": gstcalculationlab,
      "packageplusgst": gstcalculationpack,
    }


    let gstcalculationString = encodeURIComponent(JSON.stringify(gstcalculation));


    var type = 2;
    let popupWindow = window.open(`${environment.apiUrl}/pdf/generatePdf_newreq?jobcardid=${this.jobIdToUpdate}&type=${type}&gstcalculation=${gstcalculationString}`);



    this.servicespares = []
    this.extraspares = []
    this.complaint_spares = []
    this.servicelabours = []
    this.extralabours = []
    this.complaint_labours = []
    this.inputinvoiceDataArray = []
    this.inputinvoiceLabourDataArray = []
    this.complaintsparedata = []
    this.complaintlaboursdata = []

    this.getmasterdata_estimate();
    this.closedialog()


  }

  jobcardpopup(jobcardpage, jobcarid, masterdata) {

    var flag = "jobcard"
    this.LocalStoreService.getjobcarddata(jobcarid, flag).subscribe((jobcarddata) => {
      this.jobcarddata_byid = jobcarddata.response;
    });
    this.dialogref = this.dialog.open(jobcardpage, {
      width: '600px',
    });
  }


  vehiclehistorypopup(vehiclehistorypage, vehcileid, vhnumber, brand, model) {

    this.vehiclehistory_no = vhnumber
    this.vehiclehistory_brand = brand
    this.vehiclehistory_model = model

    var flag = "history"
    this.LocalStoreService.getjobcarddata(vehcileid, flag).subscribe((jobcarddata) => {
      this.jobcarddata_byid = jobcarddata.response.reverse();

      this.jobCardCount = this.jobcarddata_byid.length
    });
    this.dialogref = this.dialog.open(vehiclehistorypage, {
      width: '700px',
    });
    this.expandedIndex = null;
  }


  customerhistorypopup(customerhistorypage, mobile) {
    const flag = "customerhistory";
    this.LocalStoreService.customerhistory(mobile, flag).subscribe((jobcarddata) => {
      const jobcarddataById = jobcarddata.response.reverse();
      this.jobCardCount = jobcarddataById.length;

      const groupedData = jobcarddataById.reduce((acc, data) => {
        const key = `${data.vh_number}-${data.model}-${data.brand}`;
        if (!acc[key]) {
          acc[key] = {
            vehicleNumber: data.vh_number,
            vehicleBrand: data.brand,
            vehicleModel: data.model,
            jobcards: []
          };
        }
        acc[key].jobcards.push(data);
        return acc;
      }, {});

      this.groupedJobcardData = Object.values(groupedData);
    });

    this.dialogref = this.dialog.open(customerhistorypage, {
      width: '700px',
    });

    this.expandedIndex = null;
  }



  toggleSpareDetails(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  close_jobcard_dialog() {
    this.dialogref.close();
  }

  onPageChange(page: number, event: Event) {
    event.preventDefault();
    this.currentPage = page;
    this.startIndex = (this.currentPage - 1) * this.rowsPerPage;

    // this.getmasterdata_estimate();


  }

  getDisplayedData() {
    if (this.allmasterdata) {
      const startIndex = (this.currentPage - 1) * this.rowsPerPage;
      return this.allmasterdata.slice(startIndex, startIndex + this.rowsPerPage);
    }
  }

  getTotalPages() {
    if (this.allmasterdata) {
      return Math.ceil(this.allmasterdata.length / this.rowsPerPage);
    }
  }




  getPages(displayedPages: number) {
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage;

    let startPage = currentPage - Math.floor(displayedPages / 2);
    startPage = Math.max(1, startPage);
    let endPage = startPage + displayedPages - 1;
    endPage = Math.min(totalPages, endPage);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }




  statuseditpopup(editstatuspage, jobcarid, masterdata) {


    this.dialogref = this.dialog.open(editstatuspage, {
      width: '70%',
      height: '90%',
    })
    this.selectedStatusKey = masterdata.status.number
    this.jobIdToUpdate = jobcarid;
  }

  loadStatusList() {
    this.LocalStoreService.getStatusList().subscribe((statusListData) => {
      const statusList = statusListData.response[0].StatusList;
      this.dropdownOptions = Object.entries(statusList).map(([key, text]: [string, string]) => ({ key, text }));
    });
  }

  submitStatusUpdate() {
    const selectedStatus = this.dropdownOptions.find(option => option.key === this.selectedStatusKey)?.text;
    this.LocalStoreService.statusupdate_adminpage(selectedStatus, this.selectedStatusKey, this.jobIdToUpdate).subscribe((updatedstatus) => {

      this.getmasterdata_estimate()
      this.dialogref.close()


    })
  }

  editcustomers(data, customereditpage) {
    this.customeredit_jobcardid = data._id

    data.customers.forEach(data => {
      this.customeredit_userid = data._id
      this.customereditname = data.name
      this.customereditmobile = data.mobile
    })

    data.vehicledetails.forEach(data => {
      this.customeredit_vehicleid = data._id
    })

    this.dialogref = this.dialog.open(customereditpage, {
      // width: '600px',
    });

  }

  updatecustomerdata() {

    this.LocalStoreService.edit_customer(this.customeredit_userid, this.customeredit_vehicleid, this.customeredit_jobcardid,
      this.customereditname, this.customereditmobile).subscribe(data => {
        this.getmasterdata_estimate();
        this.closedialog()
      })



  }

  checkboxClicked(event: any, jobcardid) {
    const isChecked = event.target.checked;
    // return
    if (isChecked) {
      const deletestatus = "1"
      // return
      this.LocalStoreService.markasdelete(isChecked, deletestatus, jobcardid).subscribe(data => {

      })
    } else {
      const deletestatus = "0"

      this.LocalStoreService.markasdelete(isChecked, deletestatus, jobcardid).subscribe(data => {

      })

    }
  }


  //testing for suggestion in spares

  onSpareInputChange(index: number,inputype,type,clickfrom,flag) {
    let searchingName

    if(flag == 'invoicepage'){

      if(type=='partcode'){
        if(clickfrom == 'labourarray'){
          searchingName = this.inputinvoiceLabourDataArray[index].partcode;
        }
        if(clickfrom == 'sparearray'){
          searchingName = this.inputinvoiceDataArray[index].partcode;
        }
      }
      if(type=='spare'){
        if(clickfrom == 'labourarray'){
          searchingName = this.inputinvoiceLabourDataArray[index].name;
        }
        if(clickfrom == 'sparearray'){
          searchingName = this.inputinvoiceDataArray[index].spare;
        }
      }
    }else{

      if(type=='partcode'){
        if(clickfrom == 'labourarray'){
          searchingName = this.inputLabourDataArray[index].partcode;
        }
        if(clickfrom == 'sparearray'){
          searchingName = this.inputDataArray[index].partcode;
        }
      }
      if(type=='spare'){
        if(clickfrom == 'labourarray'){
          searchingName = this.inputLabourDataArray[index].name;
        }
        if(clickfrom == 'sparearray'){
          searchingName = this.inputDataArray[index].spare;
        }
      }

    }
    if(this.inventory_customers == false){
      if (searchingName.length >= 3) {
        this.LocalStoreService.getSpareSuggestions(this.brandforsuggestion, this.modelforsuggestion, searchingName)
          .subscribe(response => {
            this.spareSuggestions[index] = { index, suggestions: response.response, type: inputype };
          });
      } else {
        this.spareSuggestions[index] = { index, suggestions: [], type: inputype };
      }
    }else{
      if (searchingName.length >= 3) {
        this.LocalStoreService.inventory_spareparts(this.brandforsuggestion, this.modelforsuggestion, searchingName,type)
          .subscribe(response => {
            this.spareSuggestions[index] = { index, suggestions: response.response, type: inputype };
          });
      } else {
        this.spareSuggestions[index] = { index, suggestions: [], type: inputype };
      }
    }
  }

 






  onSpareInputestiChange(index: number) {

    const searchingName = this.inputDataArray[index].spare;

    if (searchingName.length >= 3) {


      this.LocalStoreService.getSpareSuggestions(this.brandforsuggestion, this.modelforsuggestion, searchingName)
        .subscribe(response => {
          // this.spareSuggestions = response.response; 

          this.spareSuggestions[index] = { index, suggestions: response.response, type: "inputesti" };

        });
    } else {
      // this.spareSuggestions = [];

      this.spareSuggestions[index] = { index, suggestions: [], type: "inputesti" };
    }

  }


  onSpareSelect1(index: number, selectedSpare: any) {

    if (selectedSpare.sellingprize == "0" || selectedSpare.sellingprize == ".00") {

      // this.inputDataArray.forEach(data => {

      //   data.status = "zerorate"
      //   data.spareid = selectedSpare._id

      // })

    }
    
    // this.inputDataArray[index].partcode = selectedSpare.partcode;
    // this.inputDataArray[index].id = selectedSpare._id;
    this.inputDataArray[index].spare = selectedSpare.name;
    this.inputDataArray[index].rate = selectedSpare.mrp;
    this.inputDataArray[index].gst = selectedSpare.gst
    this.inputDataArray[index].gst18 = selectedSpare.gst === '18%';
    this.inputDataArray[index].gst28 = selectedSpare.gst === '28%';


    // this.spareSuggestions = []; // Clear suggestions

    this.spareSuggestions[index] = { index, suggestions: [], type: "" };


  }


  onSpareSelect(index: number, selectedSpare: any,clickfrom:any,flag) {
   

    if(flag=="invoicepage"){
      if(clickfrom == "labourarray"){
        console.log("the data inside the selectedSpare ",selectedSpare)
        this.inputinvoiceLabourDataArray[index].partcode = selectedSpare.partcode;
      this.inputinvoiceLabourDataArray[index].id = selectedSpare._id;
      this.inputinvoiceLabourDataArray[index].name = selectedSpare.name;
      this.inputinvoiceLabourDataArray[index].rate = selectedSpare.mrp;
      // this.inputinvoiceDataArray[index].rate = selectedSpare.sellingprize;
      this.inputinvoiceLabourDataArray[index].gst = selectedSpare.gst
      // if(selectedSpare.gst == '18%'|| selectedSpare.gst == '18 %'){
      //   this.inputinvoiceLabourDataArray[index].gst18 = true;
      //   this.inputinvoiceLabourDataArray[index].gst28 = false;
      // }else if(selectedSpare.gst == '28%'|| selectedSpare.gst == '28 %'){
      //   this.inputinvoiceDataArray[index].gst28 = true;
      //   this.inputinvoiceDataArray[index].gst18 = false;
      // }
  
      this.spareSuggestions[index] = { index, suggestions: [], type: "" };
  
      }
  
      if(clickfrom == "sparearray"){
        console.log("the data inside the selectedSpare ",selectedSpare)
      this.inputinvoiceDataArray[index].partcode = selectedSpare.partcode;
      this.inputinvoiceDataArray[index].id = selectedSpare._id;
      this.inputinvoiceDataArray[index].spare = selectedSpare.name;
      this.inputinvoiceDataArray[index].rate = selectedSpare.mrp;
      // this.inputinvoiceDataArray[index].rate = selectedSpare.sellingprize;
      this.inputinvoiceDataArray[index].gst = selectedSpare.gst
      if(selectedSpare.gst == '18%'|| selectedSpare.gst == '18 %'){
        this.inputinvoiceDataArray[index].gst18 = true;
        this.inputinvoiceDataArray[index].gst28 = false;
      }else if(selectedSpare.gst == '28%'|| selectedSpare.gst == '28 %'){
        this.inputinvoiceDataArray[index].gst28 = true;
        this.inputinvoiceDataArray[index].gst18 = false;
      }
  
      this.spareSuggestions[index] = { index, suggestions: [], type: "" };
  
      }
    }else{
      if(clickfrom == "labourarray"){
        console.log("the data inside the selectedSpare ",selectedSpare)
        this.inputLabourDataArray[index].partcode = selectedSpare.partcode;
      this.inputLabourDataArray[index].id = selectedSpare._id;
      this.inputLabourDataArray[index].name = selectedSpare.name;
      this.inputLabourDataArray[index].rate = selectedSpare.mrp;
      this.inputLabourDataArray[index].gst = selectedSpare.gst
      this.spareSuggestions[index] = { index, suggestions: [], type: "" };
      }
  
      if(clickfrom == "sparearray"){
        console.log("the data inside the selectedSpare ",selectedSpare)
      this.inputDataArray[index].partcode = selectedSpare.partcode;
      this.inputDataArray[index].id = selectedSpare._id;
      this.inputDataArray[index].spare = selectedSpare.name;
      this.inputDataArray[index].rate = selectedSpare.mrp;
      this.inputDataArray[index].gst = selectedSpare.gst
      if(selectedSpare.gst == '18%'|| selectedSpare.gst == '18 %'){
        this.inputDataArray[index].gst18 = true;
        this.inputDataArray[index].gst28 = false;
      }else if(selectedSpare.gst == '28%'|| selectedSpare.gst == '28 %'){
        this.inputDataArray[index].gst28 = true;
        this.inputDataArray[index].gst18 = false;
      }
  
      this.spareSuggestions[index] = { index, suggestions: [], type: "" };
  
      }

    }
    
  }


  onSpareInputesti_extraChange(index: number, extra) {

    const searchingName = this.extraspares[index].spare;

    if (searchingName.length >= 3) {


      this.LocalStoreService.getSpareSuggestions(this.brandforsuggestion, this.modelforsuggestion, searchingName)
        .subscribe(response => {
          // this.spareSuggestions = response.response; 

          this.spareSuggestions[index] = { index, suggestions: response.response, type: extra };
          this.spareSuggestions.map((element, indexV) => (indexV !== index ? element.type = '' : element));
        });
    } else {
      // this.spareSuggestions = [];

      this.spareSuggestions[index] = { index, suggestions: [], type: extra };
    }

  }


  onSpareSelect_estiextra(index: number, selectedSpare: any) {


    


    this.extraspares[index].spare = selectedSpare.name;
    this.extraspares[index].rate = selectedSpare.sellingprize;
    this.extraspares[index].gst = selectedSpare.gst
    this.extraspares[index].gst18 = selectedSpare.gst === '18%';
    this.extraspares[index].gst28 = selectedSpare.gst === '28%';

    this.spareSuggestions[index] = { index, suggestions: [], type: "" };

  }




  onSpareInputesti_serviceChange(index: number, service) {

    const searchingName = this.servicespares[index].spare;

    if (searchingName.length >= 3) {
      this.LocalStoreService.getSpareSuggestions(this.brandforsuggestion, this.modelforsuggestion, searchingName)
        .subscribe(response => {
          // this.spareSuggestions = response.response; 

          this.spareSuggestions[index] = { index, suggestions: response.response, type: service };
          this.spareSuggestions.map((element, indexV) => (indexV !== index ? element.type = '' : element));
        });
    } else {
      // this.spareSuggestions = [];

      this.spareSuggestions[index] = { index, suggestions: [], type: service };
    }

  }

  onSpareSelect_estiservice(index: number, selectedSpare: any) {

    if (selectedSpare.sellingprize == "0" || selectedSpare.sellingprize == ".00") {



    }
    this.servicespares[index].spare = selectedSpare.name;
    this.servicespares[index].rate = selectedSpare.sellingprize;
    this.servicespares[index].gst = selectedSpare.gst
    this.servicespares[index].gst18 = selectedSpare.gst === '18%';
    this.servicespares[index].gst28 = selectedSpare.gst === '28%';

    this.spareSuggestions[index] = { index, suggestions: [], type: "" };

  }


  //testing
  //testing
  onSpareInputinv_serviceChange(index: number, service) {

    const searchingName = this.servicespares[index].spare;

    if (searchingName.length >= 3) {


      this.LocalStoreService.getSpareSuggestions(this.brandforsuggestion, this.modelforsuggestion, searchingName)
        .subscribe(response => {
          // this.spareSuggestions = response.response; 

          this.spareSuggestions[index] = { index, suggestions: response.response, type: service };
          this.spareSuggestions.map((element, indexV) => (indexV !== index ? element.type = '' : element));


        });
    } else {
      // this.spareSuggestions = [];

      this.spareSuggestions[index] = { index, suggestions: [], type: "" };
    }

  }


  onSpareSelect_invservice(index: number, selectedSpare: any) {

    if (selectedSpare.sellingprize == "0" || selectedSpare.sellingprize == ".00") {
      // this.servicespares.forEach(data => {
      //   data.status = "zerorate"
      //   data.spareid = selectedSpare._id
      // })
    }

    this.servicespares[index].spare = selectedSpare.name;
    this.servicespares[index].rate = selectedSpare.sellingprize;
    this.servicespares[index].gst = selectedSpare.gst
    this.servicespares[index].gst18 = selectedSpare.gst === '18%';
    this.servicespares[index].gst28 = selectedSpare.gst === '28%';

    this.spareSuggestions[index] = { index, suggestions: [], type: "" };

  }


  onSpareInputinv_extraChange(index: number, extra,type,clickfrom,datafor) {
    console.log("the data inside the onSpareInputinv_extraChange type ",type)
    let searchingName

    if(datafor == "invoicespares"){
      if(type=='partcode'){
        if(clickfrom == 'labourarray'){
          searchingName = this.extralabours[index].partcode;
        }
        if(clickfrom == 'sparearray'){
          searchingName = this.extraspares[index].partcode;
        }
      }
      if(type=='spare'){
        if(clickfrom == 'labourarray'){
          searchingName = this.extralabours[index].name;
        }
        if(clickfrom == 'sparearray'){
          searchingName = this.extraspares[index].spare;
        }
      }
    }else{

      if(type=='partcode'){
        if(clickfrom == 'labourarray'){
          searchingName = this.esti_extralabours[index].partcode;
        }
        if(clickfrom == 'sparearray'){
          searchingName = this.esti_extraspares[index].partcode;
        }
      }
      if(type=='spare'){
        if(clickfrom == 'labourarray'){
          searchingName = this.esti_extralabours[index].name;
        }
        if(clickfrom == 'sparearray'){
          searchingName = this.esti_extraspares[index].spare;
        }
      }

    }

    if(this.inventory_customers == false){
      console.log("the data entered into not a inventory customers")
      if (searchingName.length >= 3) {
        this.LocalStoreService.getSpareSuggestions(this.brandforsuggestion, this.modelforsuggestion, searchingName)
          .subscribe(response => {
            this.spareSuggestions[index] = { index, suggestions: response.response, type: extra };
          this.spareSuggestions.map((element, indexV) => (indexV !== index ? element.type = '' : element));
          });
      } else {
        this.spareSuggestions[index] = { index, suggestions: [], type: "" };
      }
    }else{

      console.log("the data entered into inventory customers")
      if (searchingName.length >= 3) {
        this.LocalStoreService.inventory_spareparts(this.brandforsuggestion, this.modelforsuggestion, searchingName,type)
          .subscribe(response => {
            this.spareSuggestions[index] = { index, suggestions: response.response, type: extra };
            this.spareSuggestions.map((element, indexV) => (indexV !== index ? element.type = '' : element));
            console.log("the data inside the spare suggestion",this.spareSuggestions[index])
          });
      } else {
        this.spareSuggestions[index] = { index, suggestions: [], type: "" };
      }
    }
  }


  onSpareSelect_invextra(index: number, selectedSpare: any,clickfrom:any,datafor) {

   if(datafor == "invoicespares"){

     if(clickfrom == 'labourarray'){
      this.extralabours[index].partcode = selectedSpare.partcode;
      this.extralabours[index].name = selectedSpare.name;
      this.extralabours[index].id = selectedSpare._id;
      this.extralabours[index].rate = selectedSpare.mrp;
      this.extralabours[index].gst = selectedSpare.gst
      this.extralabours[index].gst18 = selectedSpare.gst === '18%';
      this.extralabours[index].gst28 = selectedSpare.gst === '28%';
      this.spareSuggestions[index] = { index, suggestions: [], type: '' };
  
     }
  
     if(clickfrom == 'sparearray'){
      this.extraspares[index].partcode = selectedSpare.partcode;
      this.extraspares[index].spare = selectedSpare.name;
      this.extraspares[index].id = selectedSpare._id;
      this.extraspares[index].rate = selectedSpare.mrp;
      this.extraspares[index].gst = selectedSpare.gst
      this.extraspares[index].gst18 = selectedSpare.gst === '18%';
      this.extraspares[index].gst28 = selectedSpare.gst === '28%';
      this.spareSuggestions[index] = { index, suggestions: [], type: '' };
     }
   }else{

    if(clickfrom == 'labourarray'){
      this.esti_extralabours[index].partcode = selectedSpare.partcode;
      this.esti_extralabours[index].name = selectedSpare.name;
      this.esti_extralabours[index].id = selectedSpare._id;
      this.esti_extralabours[index].rate = selectedSpare.mrp;
      this.esti_extralabours[index].gst = selectedSpare.gst
      this.esti_extralabours[index].gst18 = selectedSpare.gst === '18%';
      this.esti_extralabours[index].gst28 = selectedSpare.gst === '28%';
      this.spareSuggestions[index] = { index, suggestions: [], type: '' };
     }
  
     if(clickfrom == 'sparearray'){
      this.esti_extraspares[index].partcode = selectedSpare.partcode;
      this.esti_extraspares[index].spare = selectedSpare.name;
      this.esti_extraspares[index].id = selectedSpare._id;
      this.esti_extraspares[index].rate = selectedSpare.mrp;
      this.esti_extraspares[index].gst = selectedSpare.gst
      this.esti_extraspares[index].gst18 = selectedSpare.gst === '18%';
      this.esti_extraspares[index].gst28 = selectedSpare.gst === '28%';
      this.spareSuggestions[index] = { index, suggestions: [], type: '' };
     }

   }
    

  }


  getpagenumbers() {
    var allobjdatas
    var cursor = ''
    cursor = this.allmasterdata[this.allmasterdata.length - 1]['_id'];

    if (this.checkfiltered == true) {

      this.LocalStoreService.getfiltereddata(cursor, this.dropdownvalue).subscribe(data => {

        // this.allmasterdata = data.response

        data.response.forEach(objdata => {
          allobjdatas = objdata
          this.allmasterdata.push(objdata);
        })

        this.allmasterdata.forEach(item => {
          item.complaintsString = item.complaints
            .map(c => c[Object.keys(c)[1]])
            .join(', ');
        });


      })
    } else {
      this.LocalStoreService.getmasterdata(cursor).subscribe(data => {
        data.response.forEach(objdata => {
          allobjdatas = objdata
          this.allmasterdata.push(objdata);
        })

        this.allmasterdata.forEach(item => {
          item.complaintsString = item.complaints
            .map(c => c[Object.keys(c)[1]])
            .join(', ');
        });
      });

    }

  }

  onStatusChange(event) {
    var cursor = ''

    this.checkfiltered = true

    this.dropdownvalue = event.value

    this.LocalStoreService.getfiltereddata(cursor, this.dropdownvalue).subscribe(data => {
      this.allmasterdata = data.response


      this.allmasterdata.forEach(item => {
        item.complaintsString = item.complaints
          .map(c => c[Object.keys(c)[1]])
          .join(', ');
      });
    })
  }



  calculate_inputinvoice_total(qty: any, rate: any, discount: any): number {
    const quantity = parseFloat(qty) || 0; 
    const unitRate = parseFloat(rate) || 0; 
    const discountFactor = parseFloat(discount) || 1;
    const forfinaltotal = quantity * unitRate
    let discountfinal
    let finaltotal
    if(discount != undefined || discount != "0" ){
       discountfinal =  (quantity * unitRate * discountFactor) / 100
       finaltotal = forfinaltotal - discountfinal
    }
    if(discount == undefined || discount == "0"){
      discountfinal =  quantity * unitRate 
       finaltotal = discountfinal
    }
    return finaltotal;
  }
  calculate_extraspareinvoice_total(qty: any, rate: any, discount: any): number {

    const quantity = parseFloat(qty) || 0; 
    const unitRate = parseFloat(rate) || 0; 
    const discountFactor = parseFloat(discount) || 0;
    const forfinaltotal = quantity * unitRate
    let discountfinal 
    let finaltotal
    if(discount != undefined || discount != "0"){
       discountfinal =  (quantity * unitRate * discountFactor) / 100
       finaltotal = forfinaltotal - discountfinal
    }
    if(discount == undefined || discount == "0"){
      discountfinal =  quantity * unitRate 
       finaltotal = discountfinal
    }
    return finaltotal
  }


  calculate_allspareqty_total(qty: any): number {
    const quantity = parseFloat(qty) || 0; 
    return quantity 
  }



  calculateGrandTotal_final(flag){

    let inputspareTotal = 0;
    let inputlabourTotal = 0;
    let esti_servicespare =0;
    let estisparetotal = 0;
    let estilabourTotal = 0

    if(this.esti_servicespares){

      esti_servicespare = this.esti_servicespares.reduce((sum,spare)=>{
       const total = this.calculate_extraspareinvoice_total(spare.qty, spare.rate, spare.discount);
       return sum + (total || 0);
 
     },0)
    }

    const servicetotal = this.servicespares.reduce((sum,spare)=>{
      const total = this.calculate_extraspareinvoice_total(spare.qty, spare.rate, spare.discount);
      return sum + (total || 0);

    },0)
    
    if(this.esti_extraspares){

       estisparetotal = this.esti_extraspares.reduce((sum,spare)=>{
        const total = this.calculate_extraspareinvoice_total(spare.qty, spare.rate, spare.discount);
        return sum + (total || 0);
  
      },0)
    }

    if(this.esti_extralabours){

       estilabourTotal = this.esti_extralabours.reduce((sum,spare)=>{
        const total = this.calculate_extraspareinvoice_total(spare.qty, spare.rate, spare.discount);
        return sum + (total || 0);
  
      },0)
    }

    const spareTotal = this.extraspares.reduce((sum, spare) => {
      const total = this.calculate_extraspareinvoice_total(spare.qty, spare.rate, spare.discount);
      return sum + (total || 0);
    }, 0);

    
    let templatetotal = 0;
    if (this.selectedtemplatespares.length > 0) {
      templatetotal = this.selectedtemplatespares.reduce((sum, spare) => {
        const total = this.calculate_extraspareinvoice_total(spare.qty, spare.rate, spare.discount);
        return sum + (total || 0);
      }, 0);
    }
  
    const labourTotal = this.extralabours.reduce((sum, labour) => {
      const total = this.calculate_extraspareinvoice_total(labour.qty, labour.rate, labour.discount);
      return sum + (total || 0);
    }, 0);

    if(flag == "estimatepage"){
      inputspareTotal = this.inputDataArray.reduce((sum, labour) => {
        const total = this.calculate_inputinvoice_total(labour.qty, labour.rate, labour.discount);
        return sum + (total || 0);
      }, 0);
       inputlabourTotal = this.inputLabourDataArray.reduce((sum, labour) => {
        const total = this.calculate_inputinvoice_total(labour.qty, labour.rate, labour.discount);
        return sum + (total || 0);
      }, 0);

    }else{

       inputspareTotal = this.inputinvoiceDataArray.reduce((sum, labour) => {
        const total = this.calculate_inputinvoice_total(labour.qty, labour.rate, labour.discount);
        return sum + (total || 0);
      }, 0);
       inputlabourTotal = this.inputinvoiceLabourDataArray.reduce((sum, labour) => {
        const total = this.calculate_inputinvoice_total(labour.qty, labour.rate, labour.discount);
        return sum + (total || 0);
      }, 0); 
    }
    

    let overalldiscount  = 0
    if(this.overalldiscount){

      overalldiscount  = parseFloat(this.overalldiscount)


    }
  
    return spareTotal + labourTotal +inputspareTotal + inputlabourTotal +templatetotal +estilabourTotal+estisparetotal+servicetotal+esti_servicespare  - overalldiscount ;

  }

  calculate_allspareqty_final(){

    const spareTotal = this.extraspares.reduce((sum, spare) => {
      const total = this.calculate_allspareqty_total(spare.qty);
      return sum + (total || 0);
    }, 0);

    const inputspareTotal = this.inputinvoiceDataArray.reduce((sum, labour) => {
      const total = this.calculate_allspareqty_total(labour.qty,);
      return sum + (total || 0);
    }, 0);
 
  
    return spareTotal +inputspareTotal  ;


  }

  removespares(item,spare:any[]){

    // const confirmation = window.confirm("Are you sure you want to delete this row?");
  // if (confirmation) {
    const index = spare.indexOf(item);
    if (index > -1) {
      spare.splice(index, 1);
    }
  // }
  }

  loadtemplatedata() {
    this.LocalStoreService.get_templatebranchdata().subscribe({
      next: (data) => {
        this.templatespares = data;
        this.templateKeys = this.templatespares?.response?.templates
          ? Object.keys(this.templatespares.response.templates[0])
          : [];
        console.log("The template data:", this.templatespares);
      },
      error: (err) => {
        console.error("Error loading template data:", err);
      }
    });
  }
  
  onTemplateSelect(event: Event) {
    console.log("Selected Template:", this.selectedtemplate);
  
    // Ensure that templatespares and response.templates exist
    if (this.templatespares?.response?.templates) {
      this.selectedtemplatespares =
        this.templatespares.response.templates[0][this.selectedtemplate];
  
      console.log(
        "The data inside this.selectedtemplatespares:",
        this.selectedtemplatespares
      );
    } else {
      console.error(
        "Error: templatespares or response.templates is not available."
      );
    }
  }

  loadtechniciandata(){

    let flag = "technician"
    this.LocalStoreService.GetAllTech(flag).subscribe(data=>{

      this.technician = data.response

      console.log("the data iniside the technician",this.technician)

    })
  }

  ontechSelect(data){

    
    const selectedValue = (event.target as HTMLSelectElement).value;

  const selectedTech = this.technician.find(
    tech => tech.superadmin_username === selectedValue,

  );


 this. invoicetech = {
  "_id" :selectedTech._id,
  "shortname" :selectedTech.superadmin_username,
  "status" :"invoice",
  "mobile" : selectedTech.mobile,
  "date": Date
 };
   console.log("the techdata inside the invoicetech",this.invoicetech)     
  }


  closepaymentpage(){

    this.paymentpage_popup.close()

  }

  paymentpopup(paymentpage,data){

    console.log("the data inisde the full jobcard payment popup",data)
    this.isfinalpayment = false;
    this.isAdvance = false;
    this.total_payment_received = 0
    this.paymentbalance_amount = 0
    this.invamount_paymentpage = "",
    this.estamount_paymentpage = "",
   this.userid_paymentpage =  data['customers'][0]['_id']
   this.mobile_paymentpage =  data['customers'][0]['mobile']
   this.name_paymentpage =  data['customers'][0]['name']
   this.vehicleid_paymentpage =  data['vehicledetails'][0]['_id']
   this.vno_paymentpage =  data['vehicledetails'][0]['vh_number']
    if(data.invoice){
      this.invamount_paymentpage = parseFloat(data.invoice.invoice_amount)
    }
    if(data.estimate && !data.invoice){
      this.invamount_paymentpage = parseFloat(data.estimate.estimate_amount) 
    }

    if(data.payment.length >0){
      console.log("payment inside ",data)
      this.total_payment_received = data['payment'][0]['total_payment_received']
      this.paymentbalance_amount  = data['payment'][0]['balance_amount']
      if(data.estimate || data.invoice){
        this.paymentbalance_amount = this.invamount_paymentpage - this.total_payment_received
        this.paymentbalance_amount = parseFloat(this.paymentbalance_amount.toFixed(2))
      }
    }else{
      this.paymentbalance_amount = this.invamount_paymentpage
    }

    if(data.status.number == "7" ){
      this.isinvoice = true
    }else{
      this.isinvoice = false
    }

    if(data.status.number == "2"){
      this.isestimate = true
    }else{
      this.isestimate = false
    }

    if(data.status.number == "1"){
      this.isvehiclein = true
    }else{
      this.isvehiclein = false
    }
    
    this.vehiclestatus_forpaymentpage = data.status.value 
    this.jobcardid_payment = data._id
    let jobcardid = data._id
    this.paymentpage_popup = this.dialog.open(paymentpage, {
      hasBackdrop:false,
      width: '60%',
      height: "95%"
    });
      this.LocalStoreService.getjobcardpayment(jobcardid).subscribe(data=>{
        console.log("the data in the payment popup",data)
        if(data.response){
          this.paymentdata_forpaypage  = data.response.payment
        }else{
          this.paymentdata_forpaypage  = []
        }
      })
  }

  paymentmodeclick(mode){
    this.paymentmode = mode
    console.log("the payment mode",this.paymentmode)
  }

  


  AddPayment() {
    
    const now = new Date();
    let formattedDate = this.datePipe.transform(now, 'dd/MM/yyyy hh:mm a') || '';
    let paymenttype = '';

    if (!this.isfinalpayment && !this.isAdvance) {
      alert("Please select either Final Payment or Advance.");
      return;
    }

    if(this.isfinalpayment && this.isAdvance){
      alert("Please select only one payment type");
      return;
    }
    if (!this.paymentamount || this.paymentamount.trim() === "") {
      alert("Please check the payment details. Amount cannot be empty.");
      return;
    }
    if(!this.paymentmode || this.paymentmode.trim() === ""){
      alert("Please choose the payment option");
      return;
    }
    if (this.isfinalpayment) {
      paymenttype = "FINAL";
    }
    if (this.isAdvance) {
      paymenttype = "ADVANCE";
    }
    let paymentobj;
    if (this.paymentamount !== "") {
      paymentobj = {
        "date": formattedDate,
        "mode": this.paymentmode,
        "vehiclestatus": this.vehiclestatus_forpaymentpage,
        "paymentType": paymenttype,
        "totalvalue": this.paymentamount
      };
  
      let paymentbalance_dup = this.invamount_paymentpage - (this.total_payment_received + parseFloat(this.paymentamount));
  
      // Adjust for small floating-point errors
      if (Math.abs(paymentbalance_dup) < 1e-10) {
        paymentbalance_dup = 0;
      }
  
      // Round balance to two decimal places
      paymentbalance_dup = parseFloat(paymentbalance_dup.toFixed(2));


    
      if (this.isinvoice || this.isestimate) {
        if (paymentbalance_dup >= 0) {
          this.total_payment_received += parseFloat(this.paymentamount);
          this.paymentbalance_amount = paymentbalance_dup;
          this.paymentdata_forpaypage.push(paymentobj);
        } else {
          alert("Cannot add payment as it exceeds the remaining balance.");
        }
      } else {
        this.total_payment_received += parseFloat(this.paymentamount);
        this.paymentbalance_amount = "";
        this.paymentdata_forpaypage.push(paymentobj);
      }
    }
  
    this.paymentamount = "";
    
    this.paymentmode = "";
  }
  
  
  

  proceedpayment(){
     let paymentobj= JSON.stringify(this.paymentdata_forpaypage)
     if(this.isfinalpayment){
      if(this.paymentbalance_amount !="0" || this.paymentbalance_amount != 0){
        alert("kidly finish the full payment")
        return
      }
     }

    this.LocalStoreService.postpayments_new(this.jobcardid_payment,this.vehiclestatus_forpaymentpage,this.userid_paymentpage,this.vehicleid_paymentpage,paymentobj,
      this.total_payment_received,this.mobile_paymentpage,this.paymentbalance_amount,this.isfinalpayment


    ).subscribe(data=>{

      this.isfinalpayment = false;
    this.isAdvance = false;

      this.getmasterdata_estimate();
      
      this.closepaymentpage()
      
    })
  
  }


 
  


  


} 
