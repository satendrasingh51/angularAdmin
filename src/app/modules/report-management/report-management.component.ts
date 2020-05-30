import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { UserService } from 'src/app/services/user.service';
import * as _moment from 'moment'

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.scss']
})
export class ReportManagementComponent implements OnInit {
  @ViewChild('loader') loader:ElementRef;
  loadingImg= 'assets/icons/before_loading.gif';
  currentDate = new Date();
  // User Graph Start
  userGraph = 'User Graph';
  filterValue: any= 1;
  startYear: any= '';
  startMonth: any= '';
  isVerified: any= 2;
  chartOptions = {responsive: true};
  public chartColors: any[] = [
    { backgroundColor: 'rgba(0,0,0,0)'},
    { pointHoverBackgroundColor: '#fff'},
  ];
  chartData = [ { data: [0], label: 'Register' },];
  chartXvalue:any = [];
  chartLabels:any = [];
  // User Graph End

  constructor(
    private userService:UserService, 
    private loader_service:LoaderService
  ) { }

  ngOnInit() {
    this.loader_service.show();
    setTimeout(() => {
      this.loader_service.hide()  
    }, 1500);
    this.startYear = this.currentDate.getFullYear();
    this.startMonth = '01';//currentDate.getMonth();
    this.isVerified = 2;
    this.getUserGraphData();
    this.getPlantTypeData();
    this.plantLogStartYear = this.currentDate.getFullYear();
    this.plantLogStartMonth = '01';
    this.getPlantLogGraphData();
    this.getPlantLogCountryList();
    this.getPlantLogCityList();
    this.getProductUsedCountData();
  }

  // User Graph Start
  getUserGraphData(){
    let data = {
      filterValue: this.filterValue,
      startYear: this.startYear,
      startMonth: this.startMonth,
      isVerified: this.isVerified
    }
    this.userService.getUserGraphData(data).pipe().subscribe(resp => {
      if(resp.result.data.length>0){
        this.loader.nativeElement.innerHTML = this.userGraph+" "+resp.result.dateRange
        resp.result.data.map((item) => {
          if(item.forGraphDate==null || item.forGraphDate == undefined){
            item.forGraphDate = '';
          }
          if(item.count==null || item.count == undefined){
            item.count = '';
          }
          this.chartLabels= this.chartLabels.concat(item.forGraphDate);
          this.chartXvalue= this.chartXvalue.concat(item.count);
        });
        this.chartData  = [{data:this.chartXvalue,label:'Register'},];
      }else{
        this.loader.nativeElement.innerHTML = this.userGraph;
      }
    })
  }
  selectYear(event){
    this.chartXvalue= [];
    this.chartLabels= [];
    this.startYear = event.target.value;
    this.getUserGraphData();
  }
  selectMonth(event){
    this.chartXvalue= [];
    this.chartLabels= [];
    this.startMonth = event.target.value;
    this.getUserGraphData();
  }
  selectFilter(event){
    this.chartXvalue= [];
    this.chartLabels= [];
    this.filterValue = event.target.value;
    this.getUserGraphData();
  }
  userType(event){
    this.chartXvalue= [];
    this.chartLabels= [];
    this.isVerified = event.target.value;
    this.getUserGraphData();
  }
  // User Graph End

  // Plant Log Graph Start
  plantLogFilterValue: any= 1;
  plantLogStartYear: any= '';
  plantLogStartMonth: any= '';
  plantLogCity: any= '';
  plantLogChartXvalue: any= [];
  plantLogChartLabels: any= [];
  plantLogChartData = [ { data: [0], label: 'Register' },];
  plantLogCountry: any= '';
  plantLogCountryList: any= []; 
  plantLogCityList: any= [];
  getPlantLogGraphData(){
    let data = {
      filterValue: this.plantLogFilterValue,
      startYear: this.plantLogStartYear,
      startMonth: this.plantLogStartMonth,
      country: this.plantLogCountry,
      city: this.plantLogCity
    }
    this.userService.getPlantLogGraph(data).pipe().subscribe(resp => {
      if(resp.result.data.length>0){
        this.loader.nativeElement.innerHTML = this.userGraph+" "+resp.result.dateRange
        resp.result.data.map((item) => {
          if(item.value==null || item.value == undefined){
            item.value = '';
          }
          if(item.count==null || item.count == undefined){
            item.count = '';
          }
          this.plantLogChartLabels= this.chartLabels.concat(item.value);
          this.plantLogChartXvalue= this.chartXvalue.concat(item.count);
        });
        this.plantLogChartData  = [{data:this.plantLogChartXvalue,label:'Plants'},];
      }else{
        this.loader.nativeElement.innerHTML = this.userGraph;
      }
    })
  }
  getPlantLogCountryList(){
    let data = {
      accessToken: '',
    }
    this.userService.getPlantlistAllCountries(data).pipe().subscribe(resp => {
      if(resp.result.length>0){
        this.plantLogCountryList = resp.result;
      }else{
        this.plantLogCountryList = [];
      }
    });
  }
  getPlantLogCityList(){
    let data = {
      country: this.plantLogCountry,
    }
    this.userService.getPlantlistAllCitiesByCountries(data).pipe().subscribe(resp => {
      if(resp.result.length>0){
        this.plantLogCityList = resp.result;
      }else{
        this.plantLogCityList = [];
      }
    });
  }
  plantLogSelectCountry(event){
    this.plantLogChartXvalue= [];
    this.plantLogChartLabels= [];
    this.plantLogCountry = event.target.value;
    this.getPlantLogCityList();
    this.getPlantLogGraphData();
  }
  plantLogSelectCity(event){
    this.plantLogChartXvalue= [];
    this.plantLogChartLabels= [];
    this.plantLogCity = event.target.value;
    this.getPlantLogGraphData();
  }
  // Plant Log Graph End

  // Plant Type List Start
  plantLimit: number= 10;
  plantPage: number= 1;
  plantTypeData: any= [];
  plantSeemore = 'see more';
  plantLoading = 'Loading...';
  plantGlobalCount: number= 0;
  plantCount: number= 0;
  searchString: string= '';
  timeOutSource:any = null;
  getPlantTypeData(){
    let data = {
      searchString: this.searchString,
      limit: this.plantLimit,
      page: this.plantPage,
    }
    this.userService.getListPlantType(data).pipe().subscribe(resp => {
      this.plantSeemore = 'See More';
      this.plantGlobalCount = resp.result.count;
      this.plantCount = (this.plantLimit*this.plantPage);
      if(resp.result.data.length>0){
        if (this.plantPage === 1) {
          this.plantTypeData = resp.result.data;
        } else {
          this.plantTypeData = this.plantTypeData ? [...this.plantTypeData, ...resp.result.data] : resp.result.data;
        }
      }else{
        this.plantTypeData = []
      }
    })
  }
  onScroll(){
    this.plantSeemore = this.plantLoading;
    this.plantPage++;
    this.getPlantTypeData();
  }
  searchByKeyword(value){
    this.searchString = value;
    if(this.timeOutSource) {
      clearTimeout(this.timeOutSource);
    }
    this.timeOutSource = setTimeout(() => {
      if (this.searchString.length >= 3 || this.searchString.length==0) {
        this.plantPage = 1;
        this.getPlantTypeData();
      }
    }, 250);
  }
  // Plant Type List End

  // Product Used List Start
  productUsedLimit: number= 10;
  productUsedPage: number= 1;
  productUsedSortOrder: any= '';
  productUsedSortKey: any= '';
  productUsedFromDate: any = _moment.utc("01/01/" + this.currentDate.getFullYear()).valueOf();
  productUsedToDate: any = _moment.utc(this.currentDate).valueOf();
  productUsedData: any= [];
  productUsedSeemore = 'see more';
  productUsedLoading = 'Loading...';
  productUsedGlobalCount: number= 0;
  productUsedCount: number= 0;
  productUsedSearchString: string= '';
  getProductUsedCountData(){
    let data = {
      searchString: this.productUsedSearchString,
      limit: this.productUsedLimit,
      page: this.productUsedPage,
      sortOrder: this.productUsedSortOrder,
      sortKey: this.productUsedSortKey,
      fromDate: this.productUsedFromDate,
      toDate: this.productUsedToDate,
    }
    this.userService.getProductUsedCountList(data).pipe().subscribe(resp => {
      this.productUsedSeemore = 'See More';
      this.productUsedGlobalCount = resp.result.globalCount;
      this.productUsedCount = (this.productUsedLimit*this.productUsedPage);
      if(resp.result.data.length>0){
        if (this.productUsedPage === 1) {
          this.productUsedData = resp.result.data;
        } else {
          this.productUsedData = this.productUsedData ? [...this.productUsedData, ...resp.result.data] : resp.result.data;
        }
      }else{
        this.productUsedData = []
      }
    });
  }
  productUsedOnScroll(){
    this.productUsedSeemore = this.plantLoading;
    this.productUsedPage++;
    this.getProductUsedCountData();
  }
  productUsedSearchByKeyword(value){
    this.productUsedSearchString = value;
    if(this.timeOutSource) {
      clearTimeout(this.timeOutSource);
    }
    this.timeOutSource = setTimeout(() => {
      if (this.productUsedSearchString.length >= 3 || this.productUsedSearchString.length==0) {
        this.productUsedPage = 1;
        this.getProductUsedCountData();
      }
    }, 250);
  }
  productUsedSearchByStartDate(event){
    this.productUsedFromDate = _moment.utc(event.target.value).valueOf();
    if(this.timeOutSource) {
      clearTimeout(this.timeOutSource);
    }
    this.timeOutSource = setTimeout(() => {
      this.productUsedPage = 1;
      this.getProductUsedCountData();
    }, 250);
  }
  productUsedSearchByEndDate(event){
    this.productUsedToDate = _moment.utc(event.target.value).valueOf();
    if(this.timeOutSource) {
      clearTimeout(this.timeOutSource);
    }
    this.timeOutSource = setTimeout(() => {
      this.productUsedPage = 1;
      this.getProductUsedCountData();
    }, 250);
  }
  // Product Used List End
}
