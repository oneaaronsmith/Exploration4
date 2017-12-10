var AppView = Backbone.View.extend({
    el: '#container',
    initialize: function(){
        this.render();
    },
    render: function(){
        this.$el.html("Hello World");
    }
});

var appView = new AppView();

var QuestionSet = Backbone.Model.extend({
    defaults: {
        ID: "",
        Question: ""
    },
    idAttribute: "ID",
    initialize: function() {
        console.log('QuestionSet has been initialized');
        this.on("invalid", function(model,error) {
            console.log("Oh, this is awkward. Didn't work" + error);
        });
    },
    constructor: function(attributes, options) {
        console.log('Constructor called');
        Backbone.Model.apply(this,arguments);
    },
    validate: function(attr) {
        if(!attr.Name) {
            return "Invalid"
        }
    },
    urlRoot: 'https://opentdb.com/api.php?amount=50'
});

var questions = new QuestionSet();

questions.fetch({
    success: function(response) {
        console.log(response);
    }
});