"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Question = (function () {
    function Question(question_bank_id, question_id, question_sequence, question, option_A, option_B, option_C, option_D, selected_option, test_session_id) {
        this.question_bank_id = question_bank_id;
        this.question_id = question_id;
        this.question_sequence = question_sequence;
        this.question = question;
        this.option_A = option_A;
        this.option_B = option_B;
        this.option_C = option_C;
        this.option_D = option_D;
        this.selected_option = selected_option;
        this.test_session_id = test_session_id;
    }
    return Question;
}());
exports.Question = Question;
//# sourceMappingURL=question.js.map