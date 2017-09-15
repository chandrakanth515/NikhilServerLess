import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';
import 'jquery';
declare const $: JQueryStatic;

import {SimpleTimer} from 'ng2-simple-timer';

@Component({
    moduleId: module.id,
    selector: 'test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit{

@ViewChild('testForm') testForm

public isFirst:boolean = true;
public valid:boolean = true;
public question:any;
public selected_option:string[]=[];
public total_questions:number;
public progress:number=0;
public percent:number;
public navigatorValue:number;
review:boolean = false;
option_A:boolean = false;
option_B:boolean = false;
option_C:boolean = false;
option_D:boolean = false;
duration:number;
timerId:string;
elapsed_time:number;
min:any;
sec:any = 60;

constructor(private http: Http,private appService: AppService,private router: Router,private st:SimpleTimer){}
    
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
    
    selectedOption(element: HTMLInputElement){
        if(element.checked){
            this.selected_option.push(element.value);
            this.selected_option.sort();
        }else{
            this.selected_option.splice(this.selected_option.indexOf(element.value),1)
            this.selected_option.sort();
        }
    }

    selectReview(element:HTMLInputElement){
        if(element.checked){
            this.appService.nextQuestion.body.review_flag = "true";
        }else{
            this.appService.nextQuestion.body.review_flag = "false";
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

    checkSelected(){
        if(this.option_A || this.option_B || this.option_C || this.option_D){
            this.valid = true;
            alert("enabled")
        }
        else{
            this.valid = false;
            alert("disabled")
        }
    }

    endTest(){
        this.subscribeTimer();
        this.appService.nextQuestion.body.selected_option= this.selected_option.toString();
        this.appService.nextQuestion.body.test_session_id= this.question.test_session_id;
        this.appService.nextQuestion.body.question_bank_id= this.question.question_bank_id;
        this.appService.nextQuestion.body.elapsed_time= this.elapsed_time;
        this.appService.nextQuestion.body.question_seq= this.question.question_sequence;
        this.appService.nextQuestion.body.question_id= this.question.question_id;
        this.appService.nextQuestion.body.navigatorValue = 1;
        this.appService.nextQuestion.body.elapsed_time= this.elapsed_time;
        this.appService.nextQuestion.body.last_question_flag = 'true';
        this.selected_option = [];
        this.question={};
        console.log(this.appService.nextQuestion.body)
        this.appService.postFetchNextQuestion().subscribe(res=>{
            this.appService.summary= res.response_question;
            this.appService.elapsed_time = res.elapsed_time;
            this.appService.selectedTest.body.test_duration = this.duration;
            this.router.navigate(['/Summary']);
        });

    }

    onNext(){
        this.isFirst = false;
        this.subscribeTimer();
        this.progress= this.progress + this.percent;
        this.option_A = false;
        this.option_B = false;
        this.option_C = false;
        this.option_D = false;
        if(!this.review){
            this.appService.nextQuestion.body.review_flag = "false";
        }
        else{
            this.appService.nextQuestion.body.review_flag = "true";
        }
        // this.review = false;
        if(this.question.question_sequence < this.total_questions){
            this.appService.nextQuestion.body.selected_option= this.selected_option.toString();
            this.appService.nextQuestion.body.elapsed_time= this.elapsed_time;
            this.appService.nextQuestion.body.test_session_id= this.question.test_session_id;
            this.appService.nextQuestion.body.question_bank_id= this.question.question_bank_id;
            this.appService.nextQuestion.body.question_seq= this.question.question_sequence;
            this.appService.nextQuestion.body.last_question_flag = 'false';
            this.appService.nextQuestion.body.question_id= this.question.question_id;
            this.appService.nextQuestion.body.navigatorValue = 1;
            this.selected_option = [];
            this.question={};
            console.log(this.appService.nextQuestion)
            this.appService.postFetchNextQuestion().subscribe(res=>{
                this.question= res.response_question[0];
                console.log(this.question);
                this.elapsed_time = res.elapsed_time;
                this.subscribeTimer();
                this.checkReviewStatus(this.question.review_flag);
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
            });
        }
        else if(this.question.question_sequence == this.total_questions){
            this.appService.nextQuestion.body.selected_option= this.selected_option.toString();
            this.appService.nextQuestion.body.test_session_id= this.question.test_session_id;
            this.appService.nextQuestion.body.question_bank_id= this.question.question_bank_id;
            this.appService.nextQuestion.body.question_seq= this.question.question_sequence;
            this.appService.nextQuestion.body.question_id= this.question.question_id;
            this.appService.nextQuestion.body.navigatorValue = 1;
            this.appService.nextQuestion.body.elapsed_time= this.elapsed_time;
            this.appService.nextQuestion.body.last_question_flag = 'true';
            this.selected_option = [];
            this.question={};
            console.log(this.appService.nextQuestion)
            this.appService.postFetchNextQuestion().subscribe(res=>{
                this.appService.summary= res.response_question;
                this.appService.selectedTest.body.test_duration = this.duration;
                this.appService.elapsed_time = res.elapsed_time;
                console.log(this.appService.elapsed_time)
                this.router.navigate(['/Summary']);
            });
        }
    }

    onPrevious(){
        this.subscribeTimer();
        this.progress= this.progress - this.percent;
        this.option_A = false;
        this.option_B = false;
        this.option_C = false;
        this.option_D = false;
        if(!this.review){
            this.appService.nextQuestion.body.review_flag = "false";
        }
        else{
            this.appService.nextQuestion.body.review_flag = "true";
        }
        if(this.question.question_sequence>1){
            this.appService.nextQuestion.body.selected_option= this.selected_option.toString();
            this.appService.nextQuestion.body.test_session_id= this.question.test_session_id;
            this.appService.nextQuestion.body.question_bank_id= this.question.question_bank_id;
            this.appService.nextQuestion.body.question_seq= this.question.question_sequence;
            this.appService.nextQuestion.body.question_id= this.question.question_id;
            this.appService.nextQuestion.body.navigatorValue = -1;
            this.appService.nextQuestion.body.elapsed_time= this.elapsed_time;
            if(this.question.question_sequence ==  this.total_questions){
                this.appService.nextQuestion.body.last_question_flag = 'true';
                console.log(this.appService.nextQuestion);
            }
            this.selected_option = [];
            this.question={};
            this.appService.postFetchNextQuestion().subscribe(res=>{
                    this.question= res.response_question[0];
                    this.elapsed_time = res.elapsed_time;
                    this.subscribeTimer();
                    if(this.question.question_sequence == 1){
                        this.isFirst = true;
                    }
                    console.log(this.question);
                    this.checkReviewStatus(this.question.review_flag);
                    this.selected_option = this.question.selected_option.split(',');
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
                
            });
        }
        if(this.question.question_sequence == 1){
            this.isFirst = true;
            console.log(this.isFirst);
        }
        
    }
    
    ngOnInit(){
        $('body').css('background-color','black');
        this.appService.routeAccess = false;
        this.total_questions = this.appService.ResumeTest.body.total_questions;
        console.log(this.total_questions)
        this.duration = this.appService.selectedTest.body.test_duration;
        this.min = Math.round(this.duration/60);
        this.percent = (1/this.total_questions)*100;

        if(!this.appService.resumeFlag){
            this.appService.getFirstQuestion().subscribe(res=>{
                this.question= res.response_question[0];
                this.elapsed_time = res.elapsed_time;
                console.log(res)
                this.st.newTimer('Timer',1);
		        this.subscribeTimer();
                this.appService.elapsed_time = res.elapsed_time;
            });
        }else{
            this.appService.postResumeTest().subscribe(res=>{
                if(res.response_question[0] != null){
                    this.isFirst = false;
                    this.question= res.response_question[0];
                    this.elapsed_time= res.elapsed_time;
                    this.st.newTimer('Timer',1);
		            this.subscribeTimer();
                    console.log(res)
                    this.checkReviewStatus(this.question.review_flag);
                    if(this.question.question_sequence == 1){
                        this.isFirst = true;
                    }
                    this.progress = ((this.question.question_sequence-1)/this.total_questions)*100;
                }
                else{
                    alert("Server Error")
                    this.router.navigate(['/']);
                }
                
            });
        }
    }
}

