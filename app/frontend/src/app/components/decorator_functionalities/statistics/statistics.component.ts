import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  user!: User;
  company!: Company;
  barChartAxisY: number[] = [];
  barChartAxisX: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  pieChartDecorators: string[] = [];
  pieChartValues: number[] = [];
  histogramDayValues: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  histogramValuesCount: number[] = [];

  constructor(private decoratorService: DecoratorService, private companyService: CompanyService, private sharedVariablesService: SharedVariablesService) { }

  ngOnInit(): void {
    // initialize
    for(let i = 0; i < 12; i++){
      this.barChartAxisY.push(0);
    }
    for(let i = 0; i < 7; i++){
      this.histogramValuesCount.push(0);
    }

    let u = localStorage.getItem("user");
    if (u != null) {
      this.user = JSON.parse(u);
    }
    this.decoratorService.getAllEmployedDecorators().subscribe(
      decs => {
        if (decs.message) {
          let decsParsed: Decorator[] = JSON.parse(decs.message)
          decsParsed.forEach(decorator => {
            if(decorator.userId == this.user.username){
              this.companyService.getCompanyByName(decorator.companyId).subscribe(
                company=>{
                  if(company.message){
                    this.company  = JSON.parse(company.message)
                    this.setBarChartData();
                    this.sharedVariablesService.yaxisbarchart = this.barChartAxisY;
                    this.setPieChartData();
                    this.sharedVariablesService.pieChartDecorators = this.pieChartDecorators;
                    this.sharedVariablesService.pieChartValues = this.pieChartValues;
                    this.setHistogramData();
                    for(let i = 0; i < this.histogramValuesCount.length; i++){
                      this.histogramValuesCount[i] = Math.round((this.histogramValuesCount[i] / 24) * 100) / 100;
                    }
                    this.sharedVariablesService.histogramDayValues = this.histogramDayValues;
                    this.sharedVariablesService.histogramValuesCount = this.histogramValuesCount;
                  }
                }
              )
            }
          })
        }
      });
  }

  incrementValuePieChart(decoratorName: string){
    for(let i = 0; i < this.pieChartDecorators.length; i++){
      if(this.pieChartDecorators[i] == decoratorName){
        this.pieChartValues[i]++;
        return;
      }
    }
    this.pieChartDecorators.push(decoratorName);
    this.pieChartValues.push(1);
  }

  setPieChartData(){
    this.company.appointments.forEach(appointment=>{
      if(appointment.status == "confirmed" && new Date(appointment.datetimeFinished) >= new Date() && new Date(appointment.datetimeScheduled) <= new Date()){
        this.incrementValuePieChart(appointment.decoratorID);
      }
      if(appointment.maintenanceTasks.length > 0){
        appointment.maintenanceTasks.forEach(task => {
          if(task.status == "in-progress" && new Date(task.startDate) <= new Date() && new Date(task.estimatedCompletionTime) >= new Date()){
            this.incrementValuePieChart(task.decoratorId);
          }
        });
      }

    })
  }
  
  setBarChartData(){
    const thisYear = new Date().getFullYear();
    this.company.appointments.forEach(appointment => {
      // for appointments
      const appointmentStartYear = new Date(appointment.datetimeScheduled).getFullYear();
      const appointmentEndYear = new Date(appointment.datetimeFinished).getFullYear();
      if(appointment.status == "confirmed" && appointment.decoratorID == this.user.username &&     (appointmentStartYear == thisYear || 
        (appointmentStartYear < thisYear && appointmentEndYear >= thisYear))){
        let startMonth = (appointmentStartYear < thisYear) ? 0 : new Date(appointment.datetimeScheduled).getMonth();
        let endMonth = (appointmentEndYear == thisYear) ? new  Date(appointment.datetimeFinished).getMonth() : 11;
        for(let i = startMonth; i <= endMonth; i++){
          this.barChartAxisY[i]++;
        }
      }   
      // for maintenance tasks
      if(appointment.maintenanceTasks.length > 0){
        appointment.maintenanceTasks.forEach(task => {
          const taskStartYear = new Date(task.startDate).getFullYear();
          const taskEndYear = new Date(task.estimatedCompletionTime).getFullYear();
          if(task.status == "in-progress" && task.decoratorId == this.user.username && 
            (taskStartYear == thisYear || 
              (taskStartYear < thisYear && taskEndYear >= thisYear))){
            let startMonth = (taskStartYear < thisYear) ? 0 : new Date(task.startDate).getMonth();
            let endMonth = (taskEndYear  == thisYear) ? new Date(task.estimatedCompletionTime).getMonth() : 11;
            for(let i = startMonth; i < endMonth; i++){
              this.barChartAxisY[i]++;
            }
          }
        });
      }
    });
  }

  isDateInLast24Months(dateToCheck: Date): boolean {
    const currentDate = new Date();
    const pastDate = new Date();

    // Subtract 24 months from the current date
    pastDate.setMonth(currentDate.getMonth() - 24);

    // Compare the given date with the past date
    return dateToCheck >= pastDate && dateToCheck <= currentDate;
}

  incrementValueHistogram(dayName: string){
    for(let i = 0; i < this.histogramDayValues.length; i++){
      if(this.histogramDayValues[i] == dayName){
        this.histogramValuesCount[i]++;
        return;
      }
    }
  }

  iterateTroughDates(startDate: Date, endDate: Date){
    for(let date = startDate; date < endDate; date.setDate(date.getDate() + 1)){
      let dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      this.incrementValueHistogram(dayName);
    }
  }

  setHistogramData(){
    let currentDate = new Date();
        let pastDate = new Date();
        pastDate.setMonth(currentDate.getMonth() - 24);
    this.company.appointments.forEach(appointment=>{
      if(
        appointment.status == "confirmed" && 
        this.isDateInLast24Months(new Date(appointment.datetimeScheduled)) ||
        !this.isDateInLast24Months(new Date(appointment.datetimeScheduled)) && this.isDateInLast24Months(new Date(appointment.datetimeFinished))
      ){
        let startDate = (new Date(appointment.datetimeScheduled) <= pastDate) ? pastDate : new Date(appointment.datetimeScheduled);
        let endDate = (new Date(appointment.datetimeFinished) >= currentDate) ? currentDate : new Date(appointment.datetimeFinished);
        this.iterateTroughDates(startDate, endDate);
      }  
      if(appointment.maintenanceTasks.length > 0){
        appointment.maintenanceTasks.forEach(task => {
          if(task.status == "in-progress" &&
            this.isDateInLast24Months(new Date(task.startDate)) ||
            !this.isDateInLast24Months(new Date(task.startDate)) && this.isDateInLast24Months(new Date(task.estimatedCompletionTime))
          ){
            let startDate = (new Date(task.startDate) <= pastDate) ? pastDate : new Date(task.startDate);
            let endDate = (new Date(task.estimatedCompletionTime) >= currentDate) ? currentDate : new Date(task.estimatedCompletionTime);
            this.iterateTroughDates(startDate, endDate);
          }
        });
      }  
    })
    }
  
}
