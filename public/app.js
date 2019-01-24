'use strict';

// Listening to 'Select This Book' Buttons
$('.select-book').on('click', function() {
  $(this).next().toggleClass('hidden-form');
});
