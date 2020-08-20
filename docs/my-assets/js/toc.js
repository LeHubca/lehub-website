function text_to_anchor(str) {
  // See https://stackoverflow.com/questions/8979619
  return str.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
}

function simulate_hamburger_click() {
  $('.slicknav_btn').click();
}

function add_to_toc(selector) {
  var anchor = text_to_anchor(selector.text());
  selector.before('<div class="anchor-wrapper"><a id="' + anchor + '"></a></div>');
  $('.mobile_menu .mobile-toc-template-li').first().removeClass('template').removeClass('mobile-toc-template-li').html('<a onclick="simulate_hamburger_click()" href="#' + anchor + '">' + selector.text() + '</a>');
}

$(function() {
  $('.single-post h2').each(function() {
    add_to_toc($(this));
  });
  $('.footer-toc-item').each(function() {
    add_to_toc($(this));
  });
});
