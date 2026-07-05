(function (d, w) {
    var root = d.documentElement;
    root.removeAttribute('data-theme');
    root.style.colorScheme = 'light';
    root.style.backgroundColor = '#F4F7FC';

    var style = d.createElement('style');
    style.id = 'portal-theme-critical';
    style.textContent =
        ':root{--background:#F4F7FC;--card:#FFF;--text-dark:#1F2937;--text-light:#6B7280;--border:#E5E7EB;--primary:#4F46E5;--primary-light:#EEF2FF}' +
        'html,body{margin:0;min-height:100vh;background-color:var(--background);color:var(--text-dark);color-scheme:light}';
    d.head.appendChild(style);
})(document, window);
