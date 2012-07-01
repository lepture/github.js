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
        var qs = toQuery(
            options,
            ['type:all', 'sort:updated', 'page', 'per_page:10']
        )
        url += '&' + qs;

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
        url += '&' + toQuery(options, ['page', 'per_page:10']);

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
        var qs = toQuery(
            options,
            [
                'sort:updated', 'state', 'milestone', 'labels',
                'page', 'per_page:10'
            ]
        );
        url += '&' + qs;

        require.async(url, function(response) {
            options.callback(response);
        });
        return this;
    }

    // Helpers
    // ----------------
    function toQuery(options, keys) {
        // toQuery(options, ['state', 'milestone']);
        var query = [];
        for (var i = 0; i < keys.length; i++) {
            var bits = keys[i].split(':');
            var key = bits[0];
            (function() {
                var value;
                if (bits.length > 1) value = bits[1];
                value = options[key] || value;
                if (value) query.push(key + '=' + value);
            })();
        }
        return query.join('&');
    }

    module.exports = github;
});
