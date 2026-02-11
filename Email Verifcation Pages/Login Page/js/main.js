$(document).ready(function () {
  $(".language-selector").click(function (e) {
    $(".language-selector, .language-list").toggleClass("active");
    $(".language-list").toggle("medium");
    if ($(".hamburger").hasClass("opened")) {
      $(".hamburger, .mobile-nav-list").removeClass("opened");
      $(".mobile-nav-list").hide("medium");
      $(".overlay").addClass("opened");
    } else {
      $(".overlay").toggleClass("opened");
    }
  });
  $(document).click(function () {
    $(".language-list").hide("medium");
    $(".overlay").removeClass("opened");
    $(".mobile-nav-list").hide("medium").removeClass("opened");
    $(".hamburger").removeClass("opened");
  });
  $(".language-list, .language-selector, .hamburger, .overview-toggle").click(function (e) {
    e.stopPropagation();
  });
  $(".language-list .langauge-item").click(function (e) {
    $(".language-list").toggle("medium");
  });
  $(".langauge-item").click(function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
    $(".language-selector span").text($(this).text());
    setTimeout(function () {
      $(".language-selector, .language-list").removeClass("active");
      $(".language-list").hide("medium");
      $(".overlay").removeClass("opened");
    }, 100);
  });

});



function checkForInput(element) {
  // element is passed to the function ^

  const $label = $(element).siblings('.form__btn');
  const $info = $(element).siblings('.info');

  if ($(element).val().length <= 0) {
    $label.addClass('disabled');
    $info.removeClass('show');
  } else {
    $label.removeClass('disabled');
    $info.addClass('show');
  }
}
// The lines below (inside) are executed on change & keyup
$('input#alternateEmail').on('change keyup', function () {
  checkForInput(this);
});

$('input#mobileNumber').on('change keyup', function () {
  checkForInput(this);
});

// The lines below are executed on page load
$('input#alternateEmail').each(function () {
  checkForInput(this);
});


$("#otpBtn").click(function () {
  $(this).addClass('disabled')
  $(this).html("Resend OTP <span id='count'></span>")

  $('.otp-wrapper input').removeAttr('disabled')

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60) % 60,
      s = seconds % 60;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    return m + ":" + s;
  }
  var count = 30;
  var counter = setInterval(timer, 1000);

  function timer() {
    count--;
    if (count <= 0) {
      clearInterval(counter)
      $("#otpBtn").html("Resend")
      $("#otpBtn").removeClass('disabled')
    }
    document.getElementById('count').innerHTML = formatTime(count);
  }
  $("#emailOTP").removeAttr("disabled");
});

$('.loadingModal').hide();
$('.thankModal').hide();
$('.thankModal .close').click(function () {
  $('.thankModal').hide();
});

$('.verifyLink').click(function () {
  $(this).hide();
  $(this).siblings('.verifiedStatus').addClass('show');
  $('.loadingModal').show();
  setTimeout(() => {
    $('.loadingModal').hide();
    $('.thankModal').show();
  }, 2000);
})

//otp input js
const $inp = $(".otp-input");
$inp.on({
  paste(ev) { // Handle Pasting
    const clip = ev.originalEvent.clipboardData.getData('text').trim();
    // Allow numbers only
    if (!/\d{6}/.test(clip)) return ev.preventDefault(); // Invalid. Exit here
    // Split string to Array or characters
    const s = [...clip];
    // Populate inputs. Focus last input.
    $inp.val(i => s[i]).eq(5).focus();
  },
  input(ev) { // Handle typing
    const i = $inp.index(this);
    if (this.value) $inp.eq(i + 1).focus();
  },
  keydown(ev) { // Handle Deleting
    const i = $inp.index(this);
    if (!this.value && ev.key === "Backspace" && i) $inp.eq(i - 1).focus();
  }
});


$(document).ready(function () {
  function formatTime(seconds) {
    var m = Math.floor(seconds / 60) % 60,
      s = seconds % 60;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    return m + ":" + s;
  }
  var count = 30;
  var counter = setInterval(timer, 1000);
  if ($('body').find('#otpBtn')) {
    function timer() {
      count--;
      if (count <= 0) {
        clearInterval(counter);
        $('.resend').removeClass('disabled')
      }
      document.getElementById('countOtp').innerHTML = formatTime(count);
    }
  }
})