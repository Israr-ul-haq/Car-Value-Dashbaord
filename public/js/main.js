$('.userdropdownli').on('click', function () {
  $('.userdropdownmenu').toggleClass('userdropdownmenu-active');
  $('.userdropdowncontainer').toggleClass('userdropdowncontainer-active');
  $('body').append(
    $('.userdropdownmenu').css({
      position: 'fixed',
      left: '95px',
      top:
        $('.userdropdownli')[0].getBoundingClientRect().top +
        $(window)['scrollTop'](),
    })
  );
});
document
  .querySelector('.main-menu .scroll')
  .addEventListener('scroll', function () {
    $('.userdropdownmenu').css({
      position: 'fixed',
      left: '95px',
      top:
        $('.userdropdownli')[0].getBoundingClientRect().top +
        $(window)['scrollTop'](),
    });
  });

/* Anything that gets to the document
will hide the dropdown */


/* Clicks within the dropdown won't make
it past the dropdown itself */
$('.userdropdownmenu').click(function (e) {
  e.stopPropagation();
});

$('.userdropdownli').click(function (e) {
  e.stopPropagation();
});
