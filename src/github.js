define(function(require, exports, module) {
    function GitHub(name) {
        var bits = name.split('/');
        this.user = bits[0];
        if (bits.length == 2) {
            this.repo = bits[1];
        } else {
            this.repo = null;
        }
        this.base = 'https://api.github.com';
    }

    GitHub.prototype.repos = function(options) {
        options = options || {};

        var url = this.base + '/users/' + this.user;
        url += '/repos?sort=updated&callback=define';

        require.async(url, function(response) {
            reply(response, options, 'repos', showRepo);
        });
        return this;
    }

    GitHub.prototype.commits = function(options) {
        options = options || {};
        var repo = options.repo || this.repo;

        var url = this.base + '/repos/' + this.user + '/' + repo;
        url += '/commits?callback=define';
        require.async(url, function(response) {
            reply(response, options, 'commits', showCommit);
        });
        return this;
    }

    GitHub.prototype.issues = function(options) {
        options = options || {};
        var repo = options.repo || this.repo;

        var url = this.base + '/repos/' + this.user + '/' + repo;
        url += '/issues?callback=define';
        url += '&sort=' + (options.sort || 'updated');
        url += '&state=' + (options.state || 'open');
        require.async(url, function(response) {
            reply(response, options, 'issues', showIssue);
        });
        return this;
    }

    var github = function(user) {
        return new GitHub(user);
    }

    // Helpers
    // ------------
    function reply(response, options, target_id, func) {
        if (options.callback) {
            options.callback(response.data);
            return;
        }
        var target = options.target || document.getElementById(target_id);
        var limit = options.limit || 10;
        var items = response.data.slice(0, limit);
        var html = '';
        for(var i = 0; i < items.length; i++) {
            html += func(items[i]);
        }
        target.innerHTML = html;
    }

    function prettyDate(time) {
        if (navigator.appName === 'Microsoft Internet Explorer') {
            // because IE date parsing isn't fun.
            return "<span>&infin;</span>";
        }
        var say = {
            just_now:    " now",
            minute_ago:  "1m",
            minutes_ago: "m",
            hour_ago:    "1h",
            hours_ago:   "h",
            yesterday:   "1d",
            days_ago:    "d",
            last_week:   "1w",
            weeks_ago:   "w"
        };

        var current_date = new Date(),
        current_date_time = current_date.getTime(),
        current_date_full = current_date_time + (1 * 60000),
        date = new Date(time),
        diff = ((current_date_full - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff) || day_diff < 0) { return "<span>&infin;</span>"; }

        return day_diff === 0 && (
            diff < 60 && say.just_now ||
            diff < 120 && say.minute_ago ||
            diff < 3600 && Math.floor(diff / 60) + say.minutes_ago ||
            diff < 7200 && say.hour_ago ||
            diff < 86400 && Math.floor(diff / 3600) + say.hours_ago) ||
            day_diff === 1 && say.yesterday ||
            day_diff < 7 && day_diff + say.days_ago ||
            day_diff === 7 && say.last_week ||
            day_diff > 7 && Math.ceil(day_diff / 7) + say.weeks_ago;
    }

    function showRepo(repo) {
        html = '<li><a href="' + repo.html_url + '">' + repo.name + '</a>';
        html += '<span>' + prettyDate(repo.updated_at) + '</span>';
        html += '<p>' + repo.description + '</p></li>';
        return html;
    }

    function showCommit(commit) {
        var commit = commit.commit;
        var url = commit.url.replace(/api\./g, '').
            replace(/repos\//g, '').
            replace(/git\/commits/g, 'commit');
        html = '<li><a href="' + url + '">';
        html += prettyDate(commit.committer.date) + '</a>';
        html += '<p>' + commit.message + '</p></li>';
        return html;
    }

    function showIssue(issue) {
        html = '<li><a href="' + issue.html_url + '" title="';
        html += issue.body + '">';
        html += prettyDate(issue.updated_at) + '</a>';
        html += '<p>' + issue.title + '</p></li>';
        return html;
    }

    module.exports = github;
});
