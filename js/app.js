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
      app.fadeInHeader();
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
      // Make the checkboxes.
      app.makeCheckboxes();
      // Load app details from localStorage.
      app.load();
    },

    /**
     * Fades in the header only one time.
     */
    fadeInHeader: function() {
      if (!$.localStorage('animatedHeader')) {
        $('.app__title').animate({opacity: 1}, 2000);
        $('.app__description').delay(500).animate({opacity: 1}, 2000);
        $.localStorage('animatedHeader', true);
      } else {
        $('.app__title').css({opacity: 1});
        $('.app__description').css({opacity: 1});
      }
    },

    /**
     * Makes the checkboxes...
     */
    makeCheckboxes: function() {
      $('.app__input').each(function(i) {
        var $box = $('<div id="app__checkbox-' + $(this).attr('id') + '" class="app__checkbox" />')
        $box.on('click', function(e) {
          app.toggleCheckbox($(this));
        });
        $(this).closest('table').find('.app__table-checkbox').html($box);
      });
    },

    /**
     * Toggles a checkbox to mark a goal as completed.
     */
    toggleCheckbox: function($box) {
      // Make sure the input isn't empty, ya can't finish nothing.
      if ($box.parents('table').find('.app__input').val() == "") {
        return;
      }
      if ($box.hasClass('checked')) {
        $box.removeClass('checked');
        $box.parents('table').find('.app__input').removeClass('checked').attr('readonly', false);
        $box.attr('title', 'not done');
        $.localStorage($box.attr('id'), null);
      } else {
        $box.addClass('checked');
        $box.parents('table').find('.app__input').addClass('checked').attr('readonly', true);
        $box.attr('title', 'completed');
        $.localStorage($box.attr('id'), true);
      }
    },

    /**
     * Clears input data and localStorage.
     */
    clear: function() {
      // Remove checkbox data.
      $('.app__checkbox').each(function(i) {
        if ($(this).hasClass('checked')) {
          app.toggleCheckbox($(this));
        }
      });
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
      // Animate sections.
      $('.app__section').each(function(i) {
        if (!$.localStorage('animatedSections')) {
          $(this).delay(i * 150).animate({opacity: 1, marginTop: 25}, 2000);
        } else {
          $(this).css({opacity: 1, marginTop: 25});
        }
      });
      // Load input values.
      $('.app__input').each(function(i) {
        $(this).val($.localStorage($(this).attr('id')));
        if (!$.localStorage('animatedSections')) {
          $(this).delay(i * 250).animate({opacity: 1}, 1000);
        } else {
          $(this).css({opacity: 1});
        }
      });
      // Load checkbox values.
      $('.app__checkbox').each(function(i) {
        if ($.localStorage($(this).attr('id')) == true) {
          app.toggleCheckbox($(this));
        }
      });
      $.localStorage('animatedSections', true);
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