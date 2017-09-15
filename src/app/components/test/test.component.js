"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var app_service_1 = require("../../services/app.service");
var router_1 = require("@angular/router");
// import { Question } from './question';
var ng2_simple_timer_1 = require("ng2-simple-timer");
var TestComponent = (function () {
    function TestComponent(http, appService, router, st) {
        this.http = http;
        this.appService = appService;
        this.router = router;
        this.st = st;
        this.isFirst = true;
        this.valid = true;
        this.selected_option = [];
        this.progress = 0;
        this.review = false;
        this.option_A = false;
        this.option_B = false;
        this.option_C = false;
        this.option_D = false;
        this.sec = 60;
    }
    TestComponent.prototype.subscribeTimer = function () {
        var _this = this;
        if (this.timerId) {
            // Unsubscribe if timer Id is defined
            this.st.unsubscribe(this.timerId);
            this.timerId = undefined;
            console.log('timer 0 Unsubscribed.');
        }
        else {
            // Subscribe if timer Id is undefined
            this.timerId = this.st.subscribe('Timer', function () { return _this.timercallback(); });
            console.log('timer 0 Subscribed.');
        }
    };
    TestComponent.prototype.timercallback = function () {
        this.elapsed_time++;
        this.min = Math.floor((this.duration - this.elapsed_time) / 60);
        if (this.min.toString().length == 1) {
            this.min = '0' + this.min.toString();
        }
        this.sec = (this.duration - this.elapsed_time) % 60;
        if (this.sec.toString().length == 1) {
            this.sec = '0' + this.sec.toString();
        }
    };
    TestComponent.prototype.selectedOption = function (element) {
        if (element.checked) {
            this.selected_option.push(element.value);
            this.selected_option.sort();
        }
        else {
            this.selected_option.splice(this.selected_option.indexOf(element.value), 1);
            this.selected_option.sort();
        }
    };
    TestComponent.prototype.selectReview = function (element) {
        if (element.checked) {
            this.appService.nextQuestion.body.review_flag = "true";
        }
        else {
            this.appService.nextQuestion.body.review_flag = "false";
        }
    };
    TestComponent.prototype.checkReviewStatus = function (review_flag) {
        if (this.question.review_flag == "true") {
            this.review = true;
        }
        else if (this.question.review_flag == null || this.question.review_flag == "false") {
            this.review = false;
        }
    };
    TestComponent.prototype.checkSelected = function () {
        if (this.option_A || this.option_B || this.option_C || this.option_D) {
            this.valid = true;
            alert("enabled");
        }
        else {
            this.valid = false;
            alert("disabled");
        }
    };
    TestComponent.prototype.endTest = function () {
        var _this = this;
        this.subscribeTimer();
        this.appService.nextQuestion.body.selected_option = this.selected_option.toString();
        this.appService.nextQuestion.body.test_session_id = this.question.test_session_id;
        this.appService.nextQuestion.body.question_bank_id = this.question.question_bank_id;
        this.appService.nextQuestion.body.elapsed_time = this.elapsed_time;
        this.appService.nextQuestion.body.question_seq = this.question.question_sequence;
        this.appService.nextQuestion.body.question_id = this.question.question_id;
        this.appService.nextQuestion.body.navigatorValue = 1;
        this.appService.nextQuestion.body.elapsed_time = this.elapsed_time;
        this.appService.nextQuestion.body.last_question_flag = 'true';
        this.selected_option = [];
        this.question = {};
        console.log(this.appService.nextQuestion.body);
        this.appService.postFetchNextQuestion().subscribe(function (res) {
            _this.appService.summary = res.response_question;
            _this.appService.elapsed_time = res.elapsed_time;
            _this.appService.selectedTest.body.test_duration = _this.duration;
            _this.router.navigate(['/Summary']);
        });
    };
    TestComponent.prototype.onNext = function () {
        var _this = this;
        this.isFirst = false;
        this.subscribeTimer();
        this.progress = this.progress + this.percent;
        this.option_A = false;
        this.option_B = false;
        this.option_C = false;
        this.option_D = false;
        if (!this.review) {
            this.appService.nextQuestion.body.review_flag = "false";
        }
        else {
            this.appService.nextQuestion.body.review_flag = "true";
        }
        // this.review = false;
        if (this.question.question_sequence < this.total_questions) {
            this.appService.nextQuestion.body.selected_option = this.selected_option.toString();
            this.appService.nextQuestion.body.elapsed_time = this.elapsed_time;
            this.appService.nextQuestion.body.test_session_id = this.question.test_session_id;
            this.appService.nextQuestion.body.question_bank_id = this.question.question_bank_id;
            this.appService.nextQuestion.body.question_seq = this.question.question_sequence;
            this.appService.nextQuestion.body.last_question_flag = 'false';
            this.appService.nextQuestion.body.question_id = this.question.question_id;
            this.appService.nextQuestion.body.navigatorValue = 1;
            this.selected_option = [];
            this.question = {};
            console.log(this.appService.nextQuestion);
            this.appService.postFetchNextQuestion().subscribe(function (res) {
                _this.question = res.response_question[0];
                console.log(_this.question);
                _this.elapsed_time = res.elapsed_time;
                _this.subscribeTimer();
                _this.checkReviewStatus(_this.question.review_flag);
                if (_this.question.selected_option != null) {
                    _this.selected_option = _this.question.selected_option.split(',');
                    console.log(_this.selected_option);
                    for (var i = 0; i < _this.selected_option.length; i++) {
                        if (_this.selected_option[i] == "option_A") {
                            _this.option_A = true;
                        }
                        if (_this.selected_option[i] == "option_B") {
                            _this.option_B = true;
                        }
                        if (_this.selected_option[i] == "option_C") {
                            _this.option_C = true;
                        }
                        if (_this.selected_option[i] == "option_D") {
                            _this.option_D = true;
                        }
                    }
                }
            });
        }
        else if (this.question.question_sequence == this.total_questions) {
            this.appService.nextQuestion.body.selected_option = this.selected_option.toString();
            this.appService.nextQuestion.body.test_session_id = this.question.test_session_id;
            this.appService.nextQuestion.body.question_bank_id = this.question.question_bank_id;
            this.appService.nextQuestion.body.question_seq = this.question.question_sequence;
            this.appService.nextQuestion.body.question_id = this.question.question_id;
            this.appService.nextQuestion.body.navigatorValue = 1;
            this.appService.nextQuestion.body.elapsed_time = this.elapsed_time;
            this.appService.nextQuestion.body.last_question_flag = 'true';
            this.selected_option = [];
            this.question = {};
            console.log(this.appService.nextQuestion);
            this.appService.postFetchNextQuestion().subscribe(function (res) {
                _this.appService.summary = res.response_question;
                _this.appService.selectedTest.body.test_duration = _this.duration;
                _this.appService.elapsed_time = res.elapsed_time;
                console.log(_this.appService.elapsed_time);
                _this.router.navigate(['/Summary']);
            });
        }
    };
    TestComponent.prototype.onPrevious = function () {
        var _this = this;
        this.subscribeTimer();
        this.progress = this.progress - this.percent;
        this.option_A = false;
        this.option_B = false;
        this.option_C = false;
        this.option_D = false;
        if (!this.review) {
            this.appService.nextQuestion.body.review_flag = "false";
        }
        else {
            this.appService.nextQuestion.body.review_flag = "true";
        }
        if (this.question.question_sequence > 1) {
            this.appService.nextQuestion.body.selected_option = this.selected_option.toString();
            this.appService.nextQuestion.body.test_session_id = this.question.test_session_id;
            this.appService.nextQuestion.body.question_bank_id = this.question.question_bank_id;
            this.appService.nextQuestion.body.question_seq = this.question.question_sequence;
            this.appService.nextQuestion.body.question_id = this.question.question_id;
            this.appService.nextQuestion.body.navigatorValue = -1;
            this.appService.nextQuestion.body.elapsed_time = this.elapsed_time;
            if (this.question.question_sequence == this.total_questions) {
                this.appService.nextQuestion.body.last_question_flag = 'true';
                console.log(this.appService.nextQuestion);
            }
            this.selected_option = [];
            this.question = {};
            this.appService.postFetchNextQuestion().subscribe(function (res) {
                _this.question = res.response_question[0];
                _this.elapsed_time = res.elapsed_time;
                _this.subscribeTimer();
                if (_this.question.question_sequence == 1) {
                    _this.isFirst = true;
                }
                console.log(_this.question);
                _this.checkReviewStatus(_this.question.review_flag);
                _this.selected_option = _this.question.selected_option.split(',');
                for (var i = 0; i < _this.selected_option.length; i++) {
                    if (_this.selected_option[i] == "option_A") {
                        _this.option_A = true;
                    }
                    if (_this.selected_option[i] == "option_B") {
                        _this.option_B = true;
                    }
                    if (_this.selected_option[i] == "option_C") {
                        _this.option_C = true;
                    }
                    if (_this.selected_option[i] == "option_D") {
                        _this.option_D = true;
                    }
                }
            });
        }
        if (this.question.question_sequence == 1) {
            this.isFirst = true;
            console.log(this.isFirst);
        }
    };
    TestComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('body').css('background-color', 'black');
        this.appService.routeAccess = false;
        this.total_questions = this.appService.ResumeTest.body.total_questions;
        console.log(this.total_questions);
        this.duration = this.appService.selectedTest.body.test_duration;
        this.min = Math.round(this.duration / 60);
        this.percent = (1 / this.total_questions) * 100;
        if (!this.appService.resumeFlag) {
            this.appService.getFirstQuestion().subscribe(function (res) {
                _this.question = res.response_question[0];
                _this.elapsed_time = res.elapsed_time;
                console.log(res);
                _this.st.newTimer('Timer', 1);
                _this.subscribeTimer();
                _this.appService.elapsed_time = res.elapsed_time;
            });
        }
        else {
            this.appService.postResumeTest().subscribe(function (res) {
                if (res.response_question[0] != null) {
                    _this.isFirst = false;
                    _this.question = res.response_question[0];
                    _this.elapsed_time = res.elapsed_time;
                    _this.st.newTimer('Timer', 1);
                    _this.subscribeTimer();
                    console.log(res);
                    _this.checkReviewStatus(_this.question.review_flag);
                    if (_this.question.question_sequence == 1) {
                        _this.isFirst = true;
                    }
                    _this.progress = ((_this.question.question_sequence - 1) / _this.total_questions) * 100;
                }
                else {
                    alert("Server Error");
                    _this.router.navigate(['/']);
                }
            });
        }
    };
    return TestComponent;
}());
__decorate([
    core_1.ViewChild('testForm'),
    __metadata("design:type", Object)
], TestComponent.prototype, "testForm", void 0);
TestComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'test',
        templateUrl: './test.component.html',
        styleUrls: ['./test.component.css']
    }),
    __metadata("design:paramtypes", [http_1.Http, app_service_1.AppService, router_1.Router, ng2_simple_timer_1.SimpleTimer])
], TestComponent);
exports.TestComponent = TestComponent;
//# sourceMappingURL=test.component.js.map