function text_to_anchor(str) {
  // See https://stackoverflow.com/questions/8979619
  return str.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
}

function simulate_hamburger_click() {
  $('.slicknav_btn').click();
}

$(function() {
  $('.single-post h2').each(function() {
    var anchor = text_to_anchor($(this).text());
    $(this).before('<div class="anchor-wrapper"><a id="' + anchor + '"></a></div>');
    $('.mobile_menu .mobile-toc-template-li').first().removeClass('template').removeClass('mobile-toc-template-li').html('<a onclick="simulate_hamburger_click()" href="#' + anchor + '">' + $(this).text() + '</a>');
  });
});