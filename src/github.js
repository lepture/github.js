// GitHub API v3
// ==============
define(function(require, exports, module) {
    var API_BASE = 'https://api.github.com';
    var CALLBACK = 'callback=define';

    function github(name) {
        if (!(this instanceof github)) {
            return new github(name);
        }

        var bits = name.split('/');
        this.user = bits[0];
        if (bits.length == 2) {
            this.repo = bits[1];
        } else {
            this.repo = null;
        }
    }

    github.prototype.repos = function(options) {
        options = options || {};

        var url = API_BASE + '/users/' + this.user;
        url += '/repos?' + CALLBACK;
        url = appendQuery(url, options, 'type', 'all');
        url = appendQuery(url, options, 'sort', 'updated');
        url = appendPagination(url, options);

        require.async(url, function(response) {
            options.callback(response);
        });
        return this;
    }

    github.prototype.commits = function(options) {
        options = options || {};
        var repo = options.repo || this.repo;

        var url = API_BASE + '/repos/' + this.user + '/' + repo;
        url += '/commits?' + CALLBACK;
        url = appendPagination(url, options);

        require.async(url, function(response) {
            options.callback(response);
        });
        return this;
    }

    github.prototype.issues = function(options) {
        options = options || {};
        var repo = options.repo || this.repo;

        var url = API_BASE + '/repos/' + this.user + '/' + repo;
        url += '/issues?' + CALLBACK;
        url = appendQuery(url, options, 'sort', 'updated');
        url = appendQuery(url, options, 'state');
        url = appendQuery(url, options, 'milestone');
        url = appendQuery(url, options, 'labels');
        url = appendPagination(url, options);

        require.async(url, function(response) {
            options.callback(response);
        });
        return this;
    }

    // Helpers
    // ----------------
    function appendQuery(url, options, key, defaults) {
        var value = options[key] || defaults;
        if (value) url += '&' + key + '=' + value;
        return url;
    }
    function appendPagination(url, options) {
        url = appendQuery(url, options, 'page');
        var perpage = options.perpage || options.per_page;
        if (perpage) url += '&per_page=' + perpage;
        return url;
    }

    module.exports = github;
});
