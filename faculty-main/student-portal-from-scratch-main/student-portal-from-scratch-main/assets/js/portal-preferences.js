(function(window, document) {
    var THEME_KEY = 'portal-theme';
    var COLLAPSED_KEY = 'portal-sidebar-collapsed';

    function readTheme() {
        return 'light';
    }

    function writeTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, 'light');
        } catch (e) {}
        return 'light';
    }

    function toRelativeHref(url) {
        var path = url.pathname.split('/').pop() || '';
        return path + url.search + url.hash;
    }

    function isInternalPortalLink(href) {
        if (!href || href === '#' || href.charAt(0) === '#') return false;
        if (/^javascript:/i.test(href)) return false;
        if (/^https?:\/\//i.test(href)) {
            try {
                return new URL(href, window.location.href).origin === window.location.origin;
            } catch (e) {
                return false;
            }
        }
        return /\.html?$/i.test(href) || href.indexOf('.') === -1;
    }

    function withThemeInHref(href) {
        if (!isInternalPortalLink(href)) return href;
        try {
            var url = new URL(href, window.location.href);
            url.searchParams.delete('theme');
            return toRelativeHref(url);
        } catch (e) {
            return href;
        }
    }

    function applyTheme(theme) {
        var root = document.documentElement;
        root.removeAttribute('data-theme');
        root.style.backgroundColor = '#F4F7FC';
        root.style.colorScheme = 'light';
        return 'light';
    }

    function getActiveTheme() {
        return 'light';
    }

    function setTheme(theme) {
        theme = writeTheme('light');
        applyTheme(theme);
        window.dispatchEvent(new CustomEvent('portal-theme-changed', { detail: theme }));
        return theme;
    }

    function persistActiveTheme() {
        return setTheme(getActiveTheme());
    }

    function decoratePortalLinks() {
        document.querySelectorAll('a[href]').forEach(function(link) {
            var href = link.getAttribute('href');
            if (!isInternalPortalLink(href)) return;
            link.setAttribute('href', withThemeInHref(href));
        });
    }

    function readSidebarCollapsed() {
        try {
            return localStorage.getItem(COLLAPSED_KEY) === 'true';
        } catch (e) {}
        return false;
    }

    function setSidebarCollapsed(collapsed) {
        try {
            localStorage.setItem(COLLAPSED_KEY, collapsed ? 'true' : 'false');
        } catch (e) {}
        applySidebarCollapsedPref();
    }

    function shouldUseCollapsedSidebar() {
        return window.innerWidth > 768 && readSidebarCollapsed();
    }

    function applySidebarCollapsedPref() {
        if (shouldUseCollapsedSidebar()) {
            document.documentElement.setAttribute('data-sidebar-collapsed', 'true');
        } else {
            document.documentElement.removeAttribute('data-sidebar-collapsed');
        }
    }

    function clearSidebarCollapsedPref() {
        document.documentElement.removeAttribute('data-sidebar-collapsed');
    }

    applyTheme(readTheme());
    writeTheme(readTheme());

    window.addEventListener('pageshow', function(e) {
        if (e.persisted) return;
        applyTheme(readTheme());
        var sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            if (shouldUseCollapsedSidebar()) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
            clearSidebarCollapsedPref();
        } else {
            applySidebarCollapsedPref();
        }
    });

    window.addEventListener('storage', function(e) {
        if (e.key === THEME_KEY) {
            applyTheme('light');
            writeTheme('light');
            window.dispatchEvent(new CustomEvent('portal-theme-changed', { detail: 'light' }));
        }
        if (e.key === COLLAPSED_KEY) {
            applySidebarCollapsedPref();
            window.dispatchEvent(new CustomEvent('portal-sidebar-changed'));
        }
    });

    window.PortalPreferences = {
        getTheme: readTheme,
        getActiveTheme: getActiveTheme,
        setTheme: setTheme,
        applyTheme: applyTheme,
        persistActiveTheme: persistActiveTheme,
        withThemeInHref: withThemeInHref,
        decoratePortalLinks: decoratePortalLinks,
        getSidebarCollapsed: readSidebarCollapsed,
        setSidebarCollapsed: setSidebarCollapsed,
        applySidebarCollapsedPref: applySidebarCollapsedPref,
        clearSidebarCollapsedPref: clearSidebarCollapsedPref
    };
})(window, document);
