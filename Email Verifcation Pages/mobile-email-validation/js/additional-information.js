document.addEventListener('DOMContentLoaded', function () {
  var eyeBtn = document.querySelector('[data-eye]');
  var passwordInput = document.getElementById('ai-password');

  if (eyeBtn && passwordInput) {
    var iconOff = eyeBtn.querySelector('.ai-eye-icon--off');
    var iconOn = eyeBtn.querySelector('.ai-eye-icon--on');

    eyeBtn.addEventListener('click', function () {
      var isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      eyeBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      if (iconOff && iconOn) {
        iconOff.style.display = isPassword ? '' : 'none';
        iconOn.style.display = isPassword ? 'none' : '';
      }
    });
  }

  // Custom dropdown (desktop + mobile): same UI everywhere, list constrained to form width
  var selectWraps = document.querySelectorAll('.ai-select-wrap');
  var activeLists = [];

  function buildCustomDropdown(wrap) {
    if (wrap.dataset.customDropdown === 'built') return;
    var select = wrap.querySelector('select.ai-select');
    if (!select) return;

    var nativeWrap = document.createElement('div');
    nativeWrap.className = 'ai-select-native-wrap';
    select.parentNode.insertBefore(nativeWrap, select);
    nativeWrap.appendChild(select);

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'ai-select-custom-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    var triggerLabel = document.createElement('span');
    triggerLabel.className = 'ai-select-custom-trigger-text';
    var caret = document.createElement('span');
    caret.className = 'ai-select-caret';
    caret.textContent = '\u25BE';
    trigger.appendChild(triggerLabel);
    trigger.appendChild(caret);

    var list = document.createElement('div');
    list.className = 'ai-select-custom-list ai-select-custom-list--closed';
    list.setAttribute('role', 'listbox');

    var options = select.querySelectorAll('option');
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'ai-select-custom-option';
      item.textContent = opt.textContent || opt.value;
      item.dataset.value = opt.value;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
      list.appendChild(item);
    }

    wrap.appendChild(trigger);
    wrap.appendChild(list);
    wrap.classList.add('ai-custom-dropdown');
    wrap.dataset.customDropdown = 'built';

    function updateTriggerText() {
      var chosen = select.options[select.selectedIndex];
      triggerLabel.textContent = chosen ? chosen.textContent : '';
    }

    function closeList() {
      list.classList.add('ai-select-custom-list--closed');
      trigger.setAttribute('aria-expanded', 'false');
      var idx = activeLists.indexOf(list);
      if (idx > -1) activeLists.splice(idx, 1);
    }

    function openList() {
      activeLists.forEach(function (l) {
        l.classList.add('ai-select-custom-list--closed');
        l.previousElementSibling.setAttribute('aria-expanded', 'false');
      });
      activeLists = [];
      list.classList.remove('ai-select-custom-list--closed');
      trigger.setAttribute('aria-expanded', 'true');
      activeLists.push(list);
    }

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (list.classList.contains('ai-select-custom-list--closed')) {
        openList();
      } else {
        closeList();
      }
    });

    list.querySelectorAll('.ai-select-custom-option').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var val = item.dataset.value;
        select.value = val;
        list.querySelectorAll('.ai-select-custom-option').forEach(function (o) {
          o.setAttribute('aria-selected', o === item ? 'true' : 'false');
        });
        updateTriggerText();
        closeList();
      });
    });

    document.addEventListener('click', function closeOnOutside(e) {
      if (wrap.contains(e.target)) return;
      closeList();
    });

    updateTriggerText();
  }

  function teardownCustomDropdown(wrap) {
    if (wrap.dataset.customDropdown !== 'built') return;
    var nativeWrap = wrap.querySelector('.ai-select-native-wrap');
    var select = wrap.querySelector('select.ai-select');
    var trigger = wrap.querySelector('.ai-select-custom-trigger');
    var list = wrap.querySelector('.ai-select-custom-list');
    if (nativeWrap && select) {
      nativeWrap.parentNode.insertBefore(select, nativeWrap);
      nativeWrap.remove();
    }
    if (trigger) trigger.remove();
    if (list) list.remove();
    wrap.classList.remove('ai-custom-dropdown');
    delete wrap.dataset.customDropdown;
  }

  selectWraps.forEach(buildCustomDropdown);
});

