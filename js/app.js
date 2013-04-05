(function($) {

  $(document).on('ready', function() {
    app.init();
  });

  /**
   * Main application object.
   */
  var app = {

    /**
     * Var for storing whether we should save right now or not.
     */
    needToSave: false,

    /**
     * Initial function to be hit.
     */
    init: function() {
      app.startSaveTimer();
      // Keyup events on input items.
      app.captureKeyupEvents();
      // Attach clear event to the clear button.
      $('#app__clear').on('click', function(e) {
        e.preventDefault();
        app.clear();
      });
      // Changes border on focus of inputs.
      $('.app__input').on('focus', function() {
        $(this).parents('.app__section').addClass('focused');
      });
      $('.app__input').on('blur', function() {
        $(this).parents('.app__section').removeClass('focused');
      });

      // Load app details from localStorage.
      app.load();
    },

    /**
     * Clears input data and localStorage.
     */
    clear: function() {
      // Clear all the inputs.
      $('.app__input').each(function(i) {
        $(this).val("");
        $.localStorage($(this).attr('id'), null);
      });
      // Remove last saved data.
      $.localStorage('lastSaved', null);
      // Reset the date display.
      app.setDateDisplay(false);
    },

    /**
     * Saves the data if we need to.
     */
    startSaveTimer: function() {
      setInterval(function() {
        if (app.needToSave) {
          app.save();
        }
      }, 2000);
    },

    /**
     * Loads the pre-existing fields from the localStorage.
     */
    load: function() {
      $('.app__section').each(function(i) {
        $(this).delay(i * 150).animate({opacity: 1, marginTop: 15}, 800);
      });
      $('.app__input').each(function(i) {
        $(this).val($.localStorage($(this).attr('id')));
        $(this).delay(i * 250).animate({opacity: 1}, 1000);
      });
      // Set display from data we got from localStorage.
      app.setDateDisplay($.localStorage('lastSaved'));
    },

    /**
     * Saves the data in the mysterious localStorage.
     */
    save: function() {

      // For each input, save to localStorage.
      $('.app__input').each(function(i) {
        $.localStorage($(this).attr('id'), $(this).val());
      });

      var d = new Date();
      app.setDateDisplay(d.toISOString());
      $.localStorage('lastSaved', d.toISOString());

      // Make sure the system won't just keep saving.
      app.needToSave = false;
    },

    /**
     * Sets the date display.
     */
    setDateDisplay: function(date) {
      if (!date) {
        $('.app__date .date').html("").attr('title', '');
        return;
      }
      // Remove existing date.
      $('.app__date .date').remove();
      // Create the date element.
      var $date = $('<span class="date" />').attr('title', date).timeago();
      // Append that shit.
      $('.app__date').append($date);
    },

    /**
     * Let's the system know we should save.
     */
    captureKeyupEvents: function() {
      $('.app__input').on('keyup', function(e) {
        app.needToSave = true;
      });
    }

  }

}(jQuery));