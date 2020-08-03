---
---
function unobfuscate_email() {
  var element = $('.obfuscated-email');
  var part1 = element.attr('data-first');
  var part2 = element.attr('data-second');
  var part3 = element.attr('data-third');
  var email = part1 + '@' + part2 + '.' + part3;
  element.attr('href', 'mailto:' + email);
  element.html(email);
}

$(function() {
  setTimeout(function() {
    unobfuscate_email();
  }, {{ site.email.delay }}000);
});
