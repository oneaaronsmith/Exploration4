var QuestionList = Backbone.Collection.extend({
    url: 'https://opentdb.com/api.php?amount=50',
    parse: function(data) {
        return data.results;
    }
});

var questions = new QuestionList();

questions.fetch({
    success: function(response) {
        console.log(response.models);

        questionArray = response.models;

        questionArray.forEach(function(model) {
            console.log(model.attributes);
        });

        console.log(questionArray[questionCounter-1].attributes.incorrect_answers)

        var cardTitleView = new CardTitleView();
        var cardQuestionView = new CardQuestionView(/*{model: questionArray[questionCounter -1]}*/);
        var cardFormView = new CardFormView();
    }
});

var questionCounter = 1;
var questionArray;

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
    },
    template: _.template("<%= cardQuestion %>"),
    render: function() {
        this.$el.html(this.template({cardQuestion: questionArray[questionCounter].attributes.question}));
    }
});

var CardFormView = Backbone.View.extend({
    el: '#form',
    initalize: function() {
        this.render();
    },
    template: _.template(`<p>
                            <input name='answers' type='radio' id='1' />
                                <label for='1'><%= answer1 %></label>
                            </p>
                            <p>
                                <input name='answers' type='radio' id='2' />
                                <label for='2'><%= answer2 %></label>
                            </p>
                            <p>
                                <input name='answers' type='radio' id='3'  />
                                <label for='3'><%= answer 3 %></label>
                            </p>
                            <p>
                                <input name='answers' type='radio' id='4'/>
                                <label for='4'><%= answer4 %></label>
                            </p>
                            <br>
                            <div class='row'>
                                <button class='my-light-blue col s4 offset-s1 waves-effect waves-light btn'>Submit</button>
                                <button class='my-light-blue col s4 offset-s2 waves-effect waves-light btn'>Skip</button>
                            </div>
                        `),
    render: function() {
        var answers = [];
        wrongAnswers = questionArray[questionCounter-1].attributes.incorrect_answers;
        correctAnswer = questionArray[questionCounter-1].attributes.correct_answer;
        wrongAnswers.forEach(function(answer) {
            answers.push(answer);
        });
        answers.push(correctAnswer);
        choice1 = answers.splice(Math.floor(Math.random() * answers.length),1);
        choice2 = answers.splice(Math.floor(Math.random() * answers.length),1);
        choice3 = answers.splice(Math.floor(Math.random() * answers.length),1);
        choice4 = answers.splice(Math.floor(Math.random() * answers.length),1);

        this.$el.html(this.template({answer1: choice1, answer2: choice2, answer3: choice3, answer4: choice4}));
    }
});