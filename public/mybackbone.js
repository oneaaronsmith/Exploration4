//Some important variables;
var questionCounter = 1;
var questionArray;
var questionsSkipped = 0;
var questionsCorrect = 0;
var questionsIncorrect = 0;
var isChoiceCorrect = false;

//First, go ahead and send the request for some questions
var QuestionList = Backbone.Collection.extend({
    url: 'https://opentdb.com/api.php?amount=50&type=multiple',
    parse: function(data) {
        return data.results;
    }
});

var questions = new QuestionList();

questions.fetch({
    success: function(response) {
        //console.log(response.models);

        setTimeout(function() {
                    questionArray = response.models;

        questionArray.forEach(function(model) {
            //console.log(model.attributes);
        });

        console.log(questionArray[questionCounter-1].attributes.incorrect_answers)

        var cardTitleView = new CardTitleView();
        var cardQuestionView = new CardQuestionView();
        var cardFormView = new CardFormView();
        var correctAnswerView = new CorrectAnswerView();
        var wrongAnswerView = new WrongAnswerView();
        var skippedAnswerView = new SkippedAnswerView();
        console.log(cardQuestionView);
        console.log(cardFormView);
        }, 3000);
    }
});

/*function nextQuestion() {
    cardTitleView.remove();
    cardQuestionView.remove();
    cardFormView.remove() ;
    correctAnswerView.remove();
    wrongAnswerView.remove();
    skippedAnswerView.remove();

    cardTitleView.render();
    cardQuestionView.render();
    cardFormView.render();
    correctAnswerView.render();
    wrongAnswerView.render();
    skippedAnswerView.render();
} */

//Define views and their behavior
var PageTitleView = Backbone.View.extend({
    el: '#page-title',
    initialize: function(){
        this.render();
    },
    render: function(){
        this.$el.html("<b>Quiz</b>");
    }
});

var pageTitleView = new PageTitleView();

var CardTitleView = Backbone.View.extend({
    el: '#card-title',
    events: {
        'click .submitBtn' : 'submitEvent'
    },
    submitEvent: function(event) {
        this.render();
    },
    initialize: function() {
        this.render();
    },
    template: _.template("<b>Question <%= cardTitle %><b>"),
    render: function() {
        this.$el.html(this.template({cardTitle: questionCounter}));
    }
});

var CardQuestionView = Backbone.View.extend({
    el: '#question',
    initialize: function() {
        this.render();
        this.listenTo(questionCounter, 'change', this.render());
    },
    template: _.template("<%= cardQuestion %>"),
    render: function() {
        this.$el.html(this.template({cardQuestion: questionArray[questionCounter - 1].attributes.question}));
    }
});

var CardFormView = Backbone.View.extend({
    el: '#form',
    events: {
        'click input[name="answers"]': 'isCorrectEvent',
        'click .submitBtn': 'submitEvent',
        'click .skipBtn': 'skipEvent'
    },
    isCorrectEvent: function(event) {
        console.log(event);
        var radioText = $('input[name="answers"]:checked').val();
        console.log(radioText);
        console.log("is correct?");
    },
    submitEvent: function(event) {
        event.preventDefault();
        console.log("submit");
        questionCounter = questionCounter + 1;
        console.log(questionCounter);
    },
    skipEvent: function(event) {
        event.preventDefault();
        console.log("skip");
    },
    initialize: function() {
        this.render();
    },
    template: _.template(`<form>
        <p>
            <input name='answers' type='radio' value=<%=isTrue1%> id='one' />
            <label for='one'><%= answer1 %></label>
        </p>
        <p>
            <input name='answers' type='radio' value=<%=isTrue2%> id='two' />
            <label for='two'><%= answer2 %></label>
        </p>
        <p>
            <input name='answers' type='radio' value=<%=isTrue3%> id='three'  />
            <label for='three'><%= answer3 %></label>
        </p>
        <p>
            <input name='answers' type='radio' value=<%=isTrue4%> id='four'/>
            <label for='four'><%= answer4 %></label>
        </p>
        <br>
        <div class='row'>
            <button class='my-light-blue col s4 offset-s1 waves-effect waves-light btn submitBtn'>Submit</button>
            <button class='my-light-blue col s4 offset-s2 waves-effect waves-light btn skipBtn'>Skip</button>
        </div>
        </form>`),
    render: function() {
        var answers = [];
        var wrongAnswers = questionArray[questionCounter-1].attributes.incorrect_answers;
        var correctAnswer = questionArray[questionCounter-1].attributes.correct_answer;
        //console.log(questionArray[questionCounter-1].attributes.incorrect_answers);
        //console.log(wrongAnswers);
        console.log(correctAnswer);

        wrongAnswers.forEach(function(answer) {
            answers.push(answer);
        });

        answers.push(correctAnswer);
        //console.log(answers);
        var choice1 = answers.splice(Math.floor(Math.random() * answers.length),1);
        var choice2 = answers.splice(Math.floor(Math.random() * answers.length),1);
        var choice3 = answers.splice(Math.floor(Math.random() * answers.length),1);
        var choice4 = answers.splice(Math.floor(Math.random() * answers.length),1);

        this.$el.html(this.template({answer1: choice1, answer2: choice2, answer3: choice3, answer4: choice4, isTrue1: choice1 == correctAnswer ? true : false, isTrue2: choice2 == correctAnswer ? true : false, isTrue3: choice3 == correctAnswer ? true : false, isTrue4: choice4 == correctAnswer ? true : false}));
    }
});


var CorrectAnswerView = Backbone.View.extend({
    el: '#correct',
    initialize: function() {
        this.render();
    },
    template: _.template("<%= correct %>"),
    render: function() {
        this.$el.html(this.template({correct: questionsCorrect}));
    }
});

var WrongAnswerView = Backbone.View.extend({
    el: '#wrong',
    initialize: function() {
        this.render();
    },
    template: _.template("<%= incorrect %>"),
    render: function() {
        this.$el.html(this.template({incorrect: questionsIncorrect}));
    }
});

var SkippedAnswerView = Backbone.View.extend({
    el: '#skip',
    initialize: function() {
        this.render();
    },
    template: _.template("<%= skip %>"),
    render: function() {
        this.$el.html(this.template({skip: questionsSkipped}));
    }
});

