define(function(require, exports, module) {
    function GitHub(user) {
        this.user = user;
        this.base = 'https://api.github.com';
    }
    GitHub.prototype.repos = function(options) {
        var self = this;
        options = options || {};
        var limit = options.limit || 10;

        var target = options.target || document.getElementById('repos');
        if (target && target.length) target = target[0];

        var url = self.base + '/users/' + self.user;
        url += '/repos?sort=updated&callback=define';
        require.async(url, function(repos) {
            repos = repos.data.slice(0, limit);
            if (options.callback) {
                options.callback(repos);
            } else {
                showRepos(target, repos);
            }
        });
    }
    GitHub.prototype.commits = function(options) {
        var self = this;
        options = options || {};
        var repo = options.repo;
        var limit = options.limit || 10;

        var target = options.target || document.getElementById('commits');
        if (target && target.length) target = target[0];
        var url = self.base + '/repos/' + self.user + '/' + repo;
        url += '/commits?callback=define';
        require.async(url, function(commits) {
            commits = commits.data.slice(0, limit);
            if (options.callback) {
                options.callback(commits);
            } else {
                showCommits(target, commits);
            }
        });
    }

    var github = function(user) {
        return new GitHub(user);
    }

    // Helpers
    // ------------
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

    function showRepos(target, repos) {
        var html = '';
        for(var i = 0; i < repos.length; i++) {
            var repo = repos[i];
            html += '<li><a href="' + repo.html_url + '">' + repo.name + '</a>';
            html += '<span>' + prettyDate(repo.updated_at) + '</span>';
            html += '<p>' + repo.description + '</p></li>';
        }
        target.innerHTML = html;
    }

    function showCommits(target, commits) {
        var html = '';
        for(var i = 0; i < commits.length; i++) {
            var commit = commits[i].commit;
            var url = commit.url.replace(/api\./g, '').
                replace(/repos\//g, '').
                replace(/git\/commits/g, 'commit');
            html += '<li><a href="' + url + '">';
            html += prettyDate(commit.committer.date) + '</a>';
            html += '<p>' + commit.message + '</p></li>';
        }
        target.innerHTML = html;
    }

    module.exports = github;
});
