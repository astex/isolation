(function () {
  var noop = function() {};

  var View = function(opts) {
    // A base view class.
    var s = this;

    // A template url.
    s.templateUrl = opts.templateUrl;
    // An element to attach to.
    s.el = opts.el || $('.main');

    // The actual text of the template.  This is null until the template is loaded.
    s.template = null;
    // A function to load the template.
    s.load = function() {
      $.get(s.templateUrl, function(data) {
        s.template = data;
        (opts.load || noop)(s);
      });
      return s;
    };

    // A render function for the view.
    s.render = function() {
      s.el.html(s.template);
      (opts.render || noop)(s);
      (opts.bindEvents || noop)(s);
      return s;
    };

    // Clean up.
    s.remove = function() {
      (opts.remove || noop)(s);
      return s;
    };
  };

  // A set of options describing how to play the game.
  var default_rules = {
    pieces: null,
    x: 5,
    y: 5
  };
  var rules = {};
  var reset_rules = function() { rules = $.extend({}, default_rules); }

  // The game board.
  var board = [];

  var victoryView = new View({ templateUrl: '/templates/victory.html' });
  victoryView.load();

  var gameView = new View({ templateUrl: '/templates/game.html' });
  gameView.load();

  var ruleView = new View({
    templateUrl: '/templates/rules.html',
    load: function(s) {
      reset_rules();
      ruleView.render();
    },
    bindEvents: function(s) {
      // Bind rule changes to the data model.
      $('form.rules').on('change', 'input, select', function(e) {
        var el = $(this);
        rules[el.attr('name')] = el.val();
      });
      // Move on to the next view when submitted.
      $('form.rules').on('submit', function(e) {
        e.preventDefault();
        // TODO: Validation.

        // Trigger the next view.
        s.remove();
        gameView.render();
      });
    },
    remove: function(s) { $('form.rules').off(); }
  });
  ruleView.load();
})()
