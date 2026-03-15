(function () {
  var allDropdowns = [];

  function setupDropdown(btnId, listId) {
    var btn = document.getElementById(btnId);
    var list = document.getElementById(listId);
    if (!btn || !list) return null;

    function isOpen() {
      return list.classList.contains('open');
    }

    function close() {
      list.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    function open() {
      allDropdowns.forEach(function (closeOther) {
        closeOther();
      });
      list.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen()) close();
      else open();
    });

    list.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    allDropdowns.push(close);
    return { isOpen: isOpen, close: close };
  }

  setupDropdown('gallery-btn', 'gallery-dropdown');
  setupDropdown('style-btn', 'style-dropdown');

  document.addEventListener('click', function () {
    allDropdowns.forEach(function (close) {
      close();
    });
  });
})();
