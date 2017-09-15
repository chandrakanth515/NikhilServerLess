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
var ng2_simple_timer_1 = require("ng2-simple-timer");
var SummaryComponent = (function () {
    function SummaryComponent(http, appService, router, st) {
        this.http = http;
        this.appService = appService;
        this.router = router;
        this.st = st;
        this.selected_option = [];
        this.option_A = false;
        this.option_B = false;
        this.option_C = false;
        this.option_D = false;
        this.questions = [];
        this.test = {
            body: {}
        };
        this.result = {
            final_score: ''
        };
        this.review = false;
        this.sec = 60;
    }
    SummaryComponent.prototype.subscribeTimer = function () {
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
    SummaryComponent.prototype.timercallback = function () {
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
    SummaryComponent.prototype.checkReviewStatus = function (review_flag) {
        if (this.question.review_flag == "true") {
            this.review = true;
        }
        else if (this.question.review_flag == null || this.question.review_flag == "false") {
            this.review = false;
        }
    };
    SummaryComponent.prototype.selectReview = function (element) {
        if (element.checked) {
            this.appService.reviewBody.body.review_flag = "true";
        }
        else {
            this.appService.reviewBody.body.review_flag = "false";
        }
    };
    SummaryComponent.prototype.reviewQuestion = function (question) {
        var _this = this;
        this.question = question;
        console.log(this.question);
        this.subscribeTimer();
        this.option_A = false;
        this.option_B = false;
        this.option_C = false;
        this.option_D = false;
        this.appService.reviewBody.body.test_session_id = question.test_session_id;
        this.appService.reviewBody.body.elapsed_time = this.elapsed_time;
        this.appService.reviewBody.body.question_bank_id = question.question_bank_id;
        this.appService.reviewBody.body.question_seq = question.question_sequence;
        console.log("fills in on selection" + question);
        console.log("this is what i send" + this.appService.reviewBody);
        this.checkReviewStatus(question.review_flag);
        this.appService.postReviewQuestion().subscribe(function (res) {
            _this.question = res.response_question[0];
            _this.elapsed_time = res.elapsed_time;
            _this.subscribeTimer();
            console.log(_this.question);
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
            else {
                _this.selected_option = [];
            }
        });
    };
    SummaryComponent.prototype.selectedOption = function (element) {
        if (element.checked) {
            this.selected_option.push(element.value);
            this.selected_option.sort();
        }
        else {
            this.selected_option.splice(this.selected_option.indexOf(element.value), 1);
            this.selected_option.sort();
        }
        console.log(this.selected_option);
    };
    SummaryComponent.prototype.onSaveChange = function (question) {
        var _this = this;
        this.subscribeTimer();
        this.appService.reviewBody.body = {};
        this.appService.reviewBody.body.elapsed_time = this.elapsed_time;
        this.appService.reviewBody.body.test_session_id = question.test_session_id;
        this.appService.reviewBody.body.question_id = question.question_id;
        this.appService.reviewBody.body.selected_option = this.selected_option.toString();
        if (!this.review) {
            this.appService.reviewBody.body.review_flag = "false";
        }
        else {
            this.appService.reviewBody.body.review_flag = "true";
        }
        console.log(this.appService.reviewBody);
        this.question = {};
        this.questions = [];
        this.appService.postSaveChanges().subscribe(function (res) {
            _this.questions = res.response_question;
            _this.elapsed_time = res.elapsed_time;
            _this.subscribeTimer();
            for (var i = 0; i < _this.questions.length; i++) {
                if (_this.questions[i].selected_option != null) {
                    _this.questions[i].selected_option = _this.questions[i].selected_option.split(",option_").join().substring(7, 12);
                }
                else {
                    _this.questions[i].selected_option = '';
                }
            }
            console.log(_this.questions);
        });
    };
    SummaryComponent.prototype.onClose = function () {
        this.question = {};
    };
    SummaryComponent.prototype.onSubmitTest = function () {
        var _this = this;
        this.test.body.question_bank_id = this.appService.summary[0].question_bank_id;
        this.test.body.test_session_id = this.appService.summary[0].test_session_id;
        this.appService.postSubmitTest(this.test).subscribe(function (res) {
            console.log(res);
            _this.result = res;
        });
        $(".ept").empty();
        $("#resultModal").modal("show");
    };
    SummaryComponent.prototype.ngOnInit = function () {
        $('body').css('background-color', 'black');
        this.appService.routeAccess = false;
        this.duration = this.appService.postBody.body.test_duration;
        this.elapsed_time = this.appService.elapsed_time;
        this.st.newTimer('Timer', 1);
        this.subscribeTimer();
        this.questions = this.appService.summary;
        console.log(this.questions);
        for (var i = 0; i < this.questions.length; i++) {
            if (this.questions[i].selected_option != null) {
                this.questions[i].selected_option = this.questions[i].selected_option.split(",option_").join().substring(7, 12);
            }
            else {
                this.questions[i].selected_option = '';
            }
        }
    };
    return SummaryComponent;
}());
SummaryComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'Summary',
        templateUrl: 'summary.component.html',
        styleUrls: ['summary.component.css']
    }),
    __metadata("design:paramtypes", [http_1.Http, app_service_1.AppService, router_1.Router, ng2_simple_timer_1.SimpleTimer])
], SummaryComponent);
exports.SummaryComponent = SummaryComponent;
//# sourceMappingURL=summary.component.js.map