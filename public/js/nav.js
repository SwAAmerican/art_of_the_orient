(function () {
  var galleryBtn = document.getElementById('gallery-btn');
  var dropdown = document.getElementById('gallery-dropdown');
  if (!galleryBtn || !dropdown) return;

  function isOpen() {
    return dropdown.classList.contains('open');
  }

  function open() {
    dropdown.classList.add('open');
    galleryBtn.setAttribute('aria-expanded', 'true');
  }

  function close() {
    dropdown.classList.remove('open');
    galleryBtn.setAttribute('aria-expanded', 'false');
  }

  galleryBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen()) close();
    else open();
  });

  document.addEventListener('click', function () {
    if (isOpen()) close();
  });

  dropdown.addEventListener('click', function (e) {
    e.stopPropagation();
  });
})();
