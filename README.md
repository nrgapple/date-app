# App

## Useful Links

### Cards


- [Tinder-link card swipe](https://codepen.io/suez/pen/MaeVBy)
- [Simple chat ui](https://codepen.io/sajadhsm/pen/odaBdd)
- [handle access token](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage)

## Requests

### Get

#### Get all users near me

```js
var url = "https://doctornelson.herokuapp.com/public/nearMe"

var body = {
    token: 'your token',
    location: {
        lat: 93298,
        lng: 9207
    }
}
```

#### Get all my matches

```js
var url = "https://doctornelson.herokuapp.com/public/matches"

var body = {
    token: 'your token',
}
```

### Post

#### Post answer (like, dislike)

```js
var url = "https://doctornelson.herokuapp.com/public/answer"

var body = {
    token: 'your token',
    userid: 'the other person's id,
    answer: 'like || pass'
}
```

#### Post sign up

```js
var url = "https://doctornelson.herokuapp.com/public/signup"

var body = {
    username: 'desired username', 
    password: 'desired password'
}
```
