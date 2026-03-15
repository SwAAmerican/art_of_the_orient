(function () {
  function setupDropdown(btnId, listId) {
    var btn = document.getElementById(btnId);
    var list = document.getElementById(listId);
    if (!btn || !list) return;

    function isOpen() {
      return list.classList.contains('open');
    }

    function open() {
      list.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    function close() {
      list.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
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

    return { isOpen: isOpen, close: close };
  }

  var gallery = setupDropdown('gallery-btn', 'gallery-dropdown');
  var style = setupDropdown('style-btn', 'style-dropdown');

  document.addEventListener('click', function () {
    if (gallery && gallery.isOpen()) gallery.close();
    if (style && style.isOpen()) style.close();
  });
})();
