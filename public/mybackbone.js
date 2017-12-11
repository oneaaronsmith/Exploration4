//Some important variables;
var questionCounter = 1;
var questionArray;
var questionsSkipped = 0;
var questionsCorrect = 0;
var questionsIncorrect = 0;
var isChoiceCorrect = false;
var cardTitleView = {};
var cardQuestionView = {};
var cardFormView = {};
var correctAnswerView = {};
var wrongAnswerView = {};
var skippedAnswerView = {};
var messageView = {};
var triviaMessage;

//First, go ahead and send the request for some questions
var QuestionList = Backbone.Collection.extend({
    url: 'https://opentdb.com/api.php?amount=50&type=multiple',
    parse: function(data) {
        return data.results;
    }
});

//Initialize the question list.
var questions = new QuestionList();

//Fetch the first set of questions form the API with a Timout to avoid overdoing requests.
questions.fetch({
    success: function(response) {

        setTimeout(function() {
        questionArray = response.models;

        cardTitleView = new CardTitleView(questionCounter);
        cardQuestionView = new CardQuestionView();
        cardFormView = new CardFormView();
        correctAnswerView = new CorrectAnswerView();
        wrongAnswerView = new WrongAnswerView();
        skippedAnswerView = new SkippedAnswerView();
        messageView = new MessageView();

        $('.progress').hide();
        }, 3000);
    }
});

//A function to get a new set of questions should the user go over 50
function renewQuestions() {
    $('.progress').show();
    questions.fetch({
        success: function(response) {
            setTimeout(function() {
                questionArray = response.models;
                cardFormView.enableMethod();
                $('.progress').hide();
                updateViews();
            }, 3000);
        }
    }); 
}

//A function used to update the view so the questions and answers will change.
function updateViews() {
        cardTitleView.render();
        cardQuestionView.render();
        cardFormView.render();
        correctAnswerView.render();
        wrongAnswerView.render();
        skippedAnswerView.render();
        messageView.render();
        isChoiceCorrect = false;
}

//---Start to define views and their behavior ---

//The page title view handles what is at the top of the page.
var PageTitleView = Backbone.View.extend({
    el: '#page-title',
    initialize: function(){
        this.render();
    },
    render: function(){
        this.$el.html("<b>Trivia - Backbone.js Exploration</b>");
    }
});

//Initialize the page title.
var pageTitleView = new PageTitleView();

//The card title view marks the question number for which question is being asked.
var CardTitleView = Backbone.View.extend({
    el: '#card-title',
    initialize: function(counter) {
        this.render();
    },
    template: _.template("<b>Question <%= cardTitle %><b>"),
    render: function() {
        this.$el.html(this.template({cardTitle: questionCounter}));
    }
});

//The question view shows the question
var CardQuestionView = Backbone.View.extend({
    el: '#question',
    initialize: function() {
        this.render();
    },
    template: _.template("<p class='category'><b><%= category %></b></p><p><%= cardQuestion %></p>"),
    render: function() {
        this.$el.html(this.template({category: questionArray[(questionCounter - 1) % 50].attributes.category, cardQuestion: questionArray[(questionCounter - 1) % 50].attributes.question}));
    }
});

//The card form handles the events surrounding answer choice and submission
var CardFormView = Backbone.View.extend({
    el: '#form',
    events: {
        'click input[name="answers"]': 'isCorrectEvent',
        'click .submitBtn': 'submitEvent',
        'click .skipBtn': 'skipEvent'
    },
    isCorrectEvent: function(event) {
        //This function checks whether the current radio button is correct or not.
        var truth = $('input[name="answers"]:checked').val();

        if(truth === 'true') {
            isChoiceCorrect = true;
        } else {
            isChoiceCorrect = false;
        }

        console.log(isChoiceCorrect);
    },
    submitEvent: function(event) {
        //This function handles the logic behind choice submission
        event.preventDefault();
        triviaMessage = '';
        if(isChoiceCorrect == true) {
            triviaMessage = "Correct!"
            questionsCorrect++;
        } else {
            triviaMessage = "Sorry, the correct answer was: " + questionArray[(questionCounter-1) % 50].attributes.correct_answer;
            questionsIncorrect++;
        }

        console.log("submit");
        questionCounter = questionCounter + 1;

        if((questionCounter - 1) % 50 == 0) {
            this.disableMethod();
            renewQuestions();
        } else {
            updateViews();
        }   
    },
    skipEvent: function(event) {
        //This function handles the logic of skipping events.
        event.preventDefault();
        triviaMessage = '';
        questionCounter++;
        questionsSkipped++;
        if((questionCounter - 1)% 50 == 0) {
            this.disableMethod();
            renewQuestions();
        } else {
            updateViews();
        } 
    },
    disableMethod: function() {
        //This function allows the view to be disabled while new questions load.
        this.events['click input[name="answers"]'] = undefined;
        this.events['click .submitBtn'] = undefined;
        this.events['click .skipBtn'] = undefined;
        this.delegateEvents(this.events);
    },
    enableMethod: function() {
        //This function allows for the view to be re-enabled.
        this.events['click input[name="answers"]'] = 'isCorrectEvent';
        this.events['click .submitBtn'] = 'submitEvent';
        this.events['click .skipBtn'] = 'skipEvent';
        this.delegateEvents(this.events);
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
            <div class='my-light-blue col s4 offset-s1 waves-effect waves-light btn submitBtn'>Submit</div>
            <div class='my-light-blue col s4 offset-s2 waves-effect waves-light btn skipBtn'>Skip</div>
        </div>
        </form>`),
    render: function() {
        //The following lines combine the right and wrong answers and then distributes them randomly. (it would not be fun if a certain was always right)
        var answers = [];
        var wrongAnswers = questionArray[(questionCounter-1) % 50].attributes.incorrect_answers;
        var correctAnswer = questionArray[(questionCounter-1) % 50].attributes.correct_answer;

        wrongAnswers.forEach(function(answer) {
            answers.push(answer);
        });

        answers.push(correctAnswer);
        var choice1 = answers.splice(Math.floor(Math.random() * answers.length),1);
        var choice2 = answers.splice(Math.floor(Math.random() * answers.length),1);
        var choice3 = answers.splice(Math.floor(Math.random() * answers.length),1);
        var choice4 = answers.splice(Math.floor(Math.random() * answers.length),1);

        this.$el.html(this.template({answer1: choice1, answer2: choice2, answer3: choice3, answer4: choice4, isTrue1: choice1 == correctAnswer ? true : false, isTrue2: choice2 == correctAnswer ? true : false, isTrue3: choice3 == correctAnswer ? true : false, isTrue4: choice4 == correctAnswer ? true : false}));
    }
});

//The correct answer view shows how many correct answers have been made.
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

//The wrong ansewr view shows how many wrong answers have been made.
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

//The skipped answer view shows how many answers have been skipped.
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

//The message view shows whether the user was correct or not.
var MessageView = Backbone.View.extend({
    el: '#message',
    initialize: function() {
        this.render();
    },
    template: _.template("<span class='<%= style %>'><%= message %></span>"),
    render: function() {
        this.$el.html(this.template({message: triviaMessage, style: triviaMessage == "Correct!" ? 'message-text' : 'message-text'}))
    }
});

