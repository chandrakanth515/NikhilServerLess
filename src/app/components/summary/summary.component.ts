import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';
import 'jquery';
declare const $: JQueryStatic;

import {SimpleTimer} from 'ng2-simple-timer';

@Component({
    moduleId:module.id,
    selector:'Summary',
    templateUrl:'summary.component.html',
    styleUrls:['summary.component.css']
})

export class SummaryComponent{
   
    constructor(private http: Http,private appService: AppService,private router: Router,private st: SimpleTimer){}
    public selected_option:any[]=[];
    public question:any;
    option_A:boolean = false;
    option_B:boolean = false;
    option_C:boolean = false;
    option_D:boolean = false;
    public questions:any[]=[];
    public test:any={
        body:{}
    };
    public result:any={
        final_score:''
    };
    review:boolean=false;
    duration:number;
    timerId:string;
    elapsed_time:number;
    min:any;
    sec:any = 60;
    

    subscribeTimer(){
        if (this.timerId) {
			// Unsubscribe if timer Id is defined
			this.st.unsubscribe(this.timerId);
			this.timerId = undefined;
			console.log('timer 0 Unsubscribed.');
		} else {
			// Subscribe if timer Id is undefined
			this.timerId = this.st.subscribe('Timer', () => this.timercallback());
			console.log('timer 0 Subscribed.');
		}
    }

    timercallback(){
        this.elapsed_time++;
        this.min = Math.floor((this.duration-this.elapsed_time)/60);
        if(this.min.toString().length == 1){
            this.min = '0'+ this.min.toString();
        }
        this.sec = (this.duration-this.elapsed_time)%60;
        if(this.sec.toString().length == 1){
            this.sec = '0'+ this.sec.toString();
        }
    }

    checkReviewStatus(review_flag:string){
        if(this.question.review_flag == "true"){
            this.review = true;
        }
        else if(this.question.review_flag == null || this.question.review_flag == "false"){
            this.review = false;
        }
    }

    selectReview(element:HTMLInputElement){
        if(element.checked){
            this.appService.reviewBody.body.review_flag = "true";
        }else{
            this.appService.reviewBody.body.review_flag = "false";
        }
    }

    reviewQuestion(question:any){
        this.question = question;
        console.log(this.question)
        this.subscribeTimer();
        this.option_A = false;
        this.option_B = false;
        this.option_C = false;
        this.option_D = false;
        this.appService.reviewBody.body.test_session_id = question.test_session_id;
        this.appService.reviewBody.body.elapsed_time = this.elapsed_time;
        this.appService.reviewBody.body.question_bank_id = question.question_bank_id;
        this.appService.reviewBody.body.question_seq = question.question_sequence;
        console.log("fills in on selection"+question)
        console.log("this is what i send"+this.appService.reviewBody)
        this.checkReviewStatus(question.review_flag);
        this.appService.postReviewQuestion().subscribe(res=>{
            this.question = res.response_question[0];
            this.elapsed_time = res.elapsed_time;
            this.subscribeTimer();
            console.log(this.question)
            if(this.question.selected_option != null){
                this.selected_option = this.question.selected_option.split(',');
                    console.log(this.selected_option)
                    for(var i=0;i<this.selected_option.length;i++){
                        if(this.selected_option[i]=="option_A"){
                            this.option_A = true;
                        }
                        if(this.selected_option[i]=="option_B"){
                            this.option_B = true;
                        }
                        if(this.selected_option[i]=="option_C"){
                            this.option_C = true;
                        }
                        if(this.selected_option[i]=="option_D"){
                            this.option_D = true;
                        }
                    }
            }
            else{
                this.selected_option = [];
            }
        });
    }

    selectedOption(element: HTMLInputElement){
        if(element.checked){
            this.selected_option.push(element.value);
            this.selected_option.sort();
        }else{
            this.selected_option.splice(this.selected_option.indexOf(element.value),1)
            this.selected_option.sort();
        }
        console.log(this.selected_option)
    }

    onSaveChange(question:any){
        this.subscribeTimer();
        this.appService.reviewBody.body = {};
        this.appService.reviewBody.body.elapsed_time = this.elapsed_time;
        this.appService.reviewBody.body.test_session_id = question.test_session_id;
        this.appService.reviewBody.body.question_id = question.question_id;
        this.appService.reviewBody.body.selected_option = this.selected_option.toString();
        if(!this.review){
            this.appService.reviewBody.body.review_flag = "false";
        }
        else{
            this.appService.reviewBody.body.review_flag = "true";
        }
        console.log(this.appService.reviewBody)
        this.question={};
        this.questions = [];
        this.appService.postSaveChanges().subscribe(res=>{
            this.questions = res.response_question;
            this.elapsed_time = res.elapsed_time;
            this.subscribeTimer();
            for(var i=0;i<this.questions.length;i++){
                if(this.questions[i].selected_option != null){
                    this.questions[i].selected_option = this.questions[i].selected_option.split(",option_").join().substring(7,12);
                }
                else{
                    this.questions[i].selected_option = '';
                }
            }
            console.log(this.questions)
        });
     }

    onClose(){
        this.question={};
    }

    onSubmitTest(){
        this.test.body.question_bank_id = this.appService.summary[0].question_bank_id;
        this.test.body.test_session_id = this.appService.summary[0].test_session_id;
        this.appService.postSubmitTest(this.test).subscribe(res=>{
            console.log(res)
            this.result = res;
        });
        $(".ept").empty();
        $("#resultModal").modal("show");
    }

    ngOnInit(){
        $('body').css('background-color','black')
        this.appService.routeAccess = false;
        this.duration =  this.appService.postBody.body.test_duration;
        this.elapsed_time = this.appService.elapsed_time;
        this.st.newTimer('Timer',1);
        this.subscribeTimer();
        this.questions = this.appService.summary;
        console.log(this.questions)
        for(var i=0;i<this.questions.length;i++){
            if(this.questions[i].selected_option != null){
                this.questions[i].selected_option = this.questions[i].selected_option.split(",option_").join().substring(7,12);
            }
            else{
                this.questions[i].selected_option = '';
            }
        }
            
        
    }


}