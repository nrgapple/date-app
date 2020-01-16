function match() {
  return ({
    username: '',
    userid: -1,
    token: '',
    activeTab: 'home',
    isLoginedIn: false,
    nearMe: [{
      name: 'pam',
      description: '',
      location: {
        lat: 0,
        long: 0
      },
      imgs: [
        "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      ],
      age: 21,
      height: {
        ft: 5,
        in: 1
      },
    },{
      name: 'jan',
      description: '',
      location: {
        lat: 0,
        long: 0
      },
      imgs: [
        "https://media.istockphoto.com/photos/hands-forming-a-heart-shape-with-sunset-silhouette-picture-id636379014?k=6&m=636379014&s=612x612&w=0&h=tnYrf_O_nvT15N4mmjorIRvZ7lK4w1q1c7RSfrVmqKA="
      ],
      age: 35,
      height: {
        ft: 5,
        in: 0
      },
    }],
    matches: [{
      name: 'sue',
      description: '',
      location: {
        lat: 0,
        long: 0
      },
      imgs: [
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      ],
      age: 35,
      height: {
        ft: 5,
        in: 3
      },
    }],
    init() {
      console.log("init!");
      console.log('get token from session');
      const token = window.sessionStorage.getItem('accessToken')
      if (!token) {
        console.log('No token found. Not logged in.');
        return;
      }
      this.token = token;
      this.isLoginedIn = true;
      this.getPeopleNearMe();
    },
    currentMatch() {
      if (this.nearMe.length < 1) {
        return undefined;
      }
      
      match = this.nearMe[0];
      return match;
    },
    pass() {
      console.log('passed');
      [,...this.nearMe] = this.nearMe;
      console.log(this.nearMe);
    },
    like() {
      console.log('liked!');
      this.matches = [...this.matches, this.currentMatch()];
      [,...this.nearMe] = this.nearMe;
      console.log(this.matches);
    },
    setMatchesListHTML() {
      return this.matches.map(match => `
              <div class="section" width=100%> 
                <button style="background-color: Transparent">
                  <div class="row">
                    <div class="col-sm-4">  
                      <img
                          src=${match.imgs[0]}
                          width="100%"
                      />
                    </div>
                    <div class="col-sm-8">
                      <h4>${match.name}</h4>
                    </div>
                  </div>
                </button>
              </div>
              `)
                .join('\n');
    },
    login() {
      
    },
    signUp() {
      const signupBox = document.querySelector('#signup');
      const usernameField = signupBox.querySelector('input[type="text"');
      const emailField = signupBox.querySelector('input[type="email"');
      const passwordField = signupBox.querySelector('input[type="password"');
      
      console.log(`username input: ${usernameField.value}`);
      console.log(`email input: ${emailField.value}`);
      console.log(`password input: ${passwordField.value}`);
      console.log("submitted");
      fetch('https://doctornelson.herokuapp.com/public/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: usernameField.value, 
          password: passwordField.value
        })
      })
      .then(response => {
        return response.json().then(data => {
          if (data.token === undefined) {
            console.log(`issue logging in.`);
            console.error(data);
            return;
          }
          console.log(`token recieved: ${data.token}`);
          window.sessionStorage.accessToken = data.token;
          this.token = data.token;
          this.isLoginedIn = true;
          this.getPeopleNearMe();
        }).catch((e) => {
          console.log(e);
        })
      });
    },
    logout() {
      window.sessionStorage.removeItem('accessToken');
      this.isLoginedIn = false;
    },
    getPeopleNearMe() {
      fetch(`https://doctornelson.herokuapp.com/public/nearMe`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.token,
          location: this.location
        })
      })
      .then(r => r.json()
        .then(data => {
          if (data.nearMe) {
            this.nearMe = data.nearMe;
          }
        })
      ).catch(e => {
        console.log("near me request failed.");
      });;
    },
    getMatches() {
      fetch(`https://doctornelson.herokuapp.com/public/matches`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.token,
        })
      })
      .then(r => r.json()
        .then(data => {
          if (data.matches) {
            this.matches = data.matches;
          }
        })
      ).catch(e => {
        console.log("matches request failed.");
      });;
    },
    sendAnswer(userid, answer) {
      if (answer !== 'like' || answer !== 'pass')
      {
        log.error('answer is set to an invalid response');
      }
      fetch(`https://doctornelson.herokuapp.com/public/answer`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.token,
          userid: userid,
          answer: answer
        })
      })
      .then(r => r.json()
        .then(data => {
          if (data.nearMe) {
            this.nearMe = data.nearMe;
          }
        })
      ).catch(e => {
        console.log(`${answer} request failed.`);
      });
    }
  });
}