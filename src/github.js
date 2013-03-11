// GitHub API v3
// ==============

define(function(require, exports, module) {

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
    var path = '/users/' + this.user + '/repos';
    request(
      path, options, 
      ['type:all', 'sort:updated', 'page', 'per_page:10']
    );
    return this;
  }

  github.prototype.tags = function(options) {
    options = options || {};
    var repo = options.repo || this.repo;
    var path = '/repos/' + this.user + '/' + repo + '/tags';
    request(path, options);
    return this;
  }

  github.prototype.commits = function(options) {
    options = options || {};
    var repo = options.repo || this.repo;

    var path = '/repos/' + this.user + '/' + repo + '/commits';
    request(path, options, ['page', 'per_page:10']);
    return this;
  }

  github.prototype.issues = function(options) {
    options = options || {};
    var repo = options.repo || this.repo;

    var path = '/repos/' + this.user + '/' + repo + '/issues';
    if (options.issueId) {
      path = path + '/' + options.issueId;
    }

    request(
      path,
      options,
      [
        'sort:updated', 'state', 'milestone', 'labels',
        'page', 'per_page:10'
      ]
    );
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

  function request(path, options, queryFields) {
    options = options || {};

    var url = 'https://api.github.com' + path + '?callback=define';
    if (queryFields) {
      var qs = toQuery(options, queryFields);
      url += '&' + qs;
    }
    require.async(url, options.callback);
  }

  module.exports = github;
});
