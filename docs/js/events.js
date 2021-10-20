let MyEvents = {
  addEvents: function(events) {
    this.deleteVisibleArea();
    if (events.length === 0) {
      this.addEventsNone();
    }
    else {
      this.addEventsAtLeastOne(events);
    }
  },
  addEventsAtLeastOne: function(events) {
    this.addToVisibleArea('template-your-timezone-is');
    let that = this;
    events.forEach(function(e) {
      that.addEvent(e);
    });
  },
  addEventsNone: function(events) {
    this.addToVisibleArea('template-no-events');
  },
  eventIdString: function(event) {
    return event.id.replaceAll('/', '');
  },
  addEvent: function(event) {
    let uuid = this.eventIdString(event.event);

    $('.template-event').removeClass('display-only-in-en');
    $('.template-event').removeClass('display-only-in-fr');
    $('.template-event').addClass('display-only-in-' + event.event.lang);
    $('.template-event .event-title').html(event.event.title);
    console.log(31);
    console.log(event);
    console.log(event.event);
    console.log(event.event.content);
    $('.template-event .event-desc-internal').html(event.event.content);
    $('.template-event a.event-target').attr('name', uuid);
    $('.template-event a.anchor-link').attr('href', event.event.permalink);
    $('.template-event .change-collapse-target').attr('data-target', '#collapse' + uuid);
    $('.template-event .change-collapse-id').attr('id', 'collapse' + uuid);
    $('.template-event .change-heading-id').attr('id', '#heading' + uuid);
    $('.template-event .change-heading-labelledby').attr('aria-labelledby', 'heading' + uuid);

    $('.template-event .event-date').html(this.humanDate(event.start, event.end));
    this.addToVisibleArea('template-event');
  },
  addToVisibleArea: function(css_class) {
    $('.' + css_class).clone().removeClass(css_class).appendTo('.events-to-display');
  },
  convertTimezone: function(date, tzString) {
    // See https://stackoverflow.com/a/54127122/1207752.
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));
  },
  deleteVisibleArea: function() {
    $('.events-to-display').empty();
  },
  error: function(thrownError) {
    this.deleteVisibleArea();
    this.addToVisibleArea('template-error-loading-events');
    $('.events-error').html(thrownError);;
  },
  fetchEvents: function() {
    let that = this;
    $.ajax({
      url : "/api/v1/events.json",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        that.success(data);
      },
      error: function(xhr, ajaxOptions, thrownError) {
        that.error(thrownError);
      }
    });
  },
  formatDate: function(d) {
    let date_obj = new Date(d);

    return date_obj.getFullYear() + "-" +
      this.pad((1 + date_obj.getMonth())) + "-" +
      this.pad(date_obj.getDate()) + " " +
      this.pad(date_obj.getHours()) + ":" +
      this.pad(date_obj.getMinutes());
  },
  formatIsoDate: function(d) {
    return d.replace(" +0000", "Z").replace(" ", "T");
  },
  getParamOrDefault: function(param, default_val) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (typeof params[param] != "undefined") {
      return params[param];
    }
    return default_val;
  },
  humanDate: function(start, end) {
    var ret = this.humanSingleDate(start);
    if (end) {
      ret += ' - ' + this.humanSingleDate(end);
    }
    return ret;
  },
  humanSingleDate: function(d) {
    let current_tz_date = this.convertTimezone(this.formatIsoDate(d), this.localTimezone());

    return this.formatDate(current_tz_date);
  },
  localTimezone: function() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  },
  init: function() {
    if ($('.events-to-display').length != 0) {
      this.fetchEvents();
    }
    const that = this;
    $('.i-am-a-date-display-me-for-humans').each(function() {
      $( this ).html(that.humanSingleDate($( this ).html()));
    });
    $('.your-timezone-is').html(this.localTimezone());
  },
  pad: function(n) {
    // https://stackoverflow.com/a/14324851/1207752
    return ("00" + n).slice(-2);
  },
  success: function(data) {
    var events = [];
    let that = this;
    data.forEach(function(e) {
      e.dates.forEach(function(e2) {
        if (e2.start >= that.utcTime()) {
          events.push({
            start: e2.start,
            end: e2.end,
            event: e
          });
        }
      });
    });
    console.log(events);
    const sorted = events.sort(function(a, b) {
      return a.start > b.start ? 1 : -1;
    })
    console.log(sorted);
    this.addEvents(sorted);
  },
  utcTime: function() {
    // Example: 2021-07-05T19:40:47.382Z
    return this.getParamOrDefault('simulate_current_date', new Date().toISOString());
  }
}

$(document).ready(function(){
  MyEvents.init();
});
