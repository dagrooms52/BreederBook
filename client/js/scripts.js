(function($){
  $(function(){

    $('.button-collapse').sideNav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

$('label').click(function(){
    $(this).children('span').addClass('input-checked');
    $(this).parent('.toggle').siblings('.toggle').children('label').children('span').removeClass('input-checked');
});

$(document).ready(function() {
    $('select').material_select();
    $('.modal').modal();
});

