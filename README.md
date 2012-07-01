# github.js

GitHub API in [seajs](http://seajs.org).

------------------------

## API


init with seajs:

```javascript
seajs.use('./src/github', function(github) {
    /* write code here */
});
```

show repos:

```javascript
github('your_name').repos({
    limit: 5,  // default is 5
    target: el,  // default is <ul id="repos"></ul>
    callback: null // default is undefined
})
```


show commits:

```javascript
github('your_name').commits({
    repo: 'your_repo_name',  // required
    limit: 5,  // default is 5
    target: el,  // default is <ul id="commits"></ul>
    callback: null // default is undefined
});
```
