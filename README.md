# App

[![Join the chat at https://gitter.im/date-app/community](https://badges.gitter.im/date-app/community.svg)](https://gitter.im/date-app/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Useful Links

### Cards


- [Tinder-link card swipe](https://codepen.io/suez/pen/MaeVBy)
- [Simple chat ui](https://codepen.io/sajadhsm/pen/odaBdd)
- [handle access token](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage)
- [PWA](https://codelabs.developers.google.com/codelabs/your-first-pwapp/#6)

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

## Road Map

- [ ] request: get all users but yourself
- [ ] request: get all matches
- [ ] request: post answer (userid, like || pass) => {return user || nothing}
- [ ] request: post profile

```js
user: {
  swipes : {
    3452: 'like',
    4938: 'pass',
    9382: 'rejected',
    9283: 'match',
  }  
}

//1. receive otherUserid and answer (LIKE, PASS) from requester (requesterid)
//2. get otherUserid's user object.
//3. check if requesterid is in their swipes.
//3.1 if yes && liked {change otherUserid.swipes.requesterid = 'match'; add requester.swipes.otherUser = 'match';}
//3.2 if yes && pass {add requester.swipes.otherUser = 'rejected';}
//3.3 if no {add requester.swipes.otherUser = 'like' || 'pass';}
```

## httpie requests

```bash
http GET https://doctornelson.herokuapp.com/secure/profiles "Authorization: Bearer <token>"
```