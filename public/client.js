function match() {
  const apiURL = 'https://doctornelson.herokuapp.com';
  return ({
    me: {
      username: undefined,
      firstName: 'john',
      lastName: 'jill',
      height: 53,
      dob: new Date('1995-12-17'),
      token: undefined,
      about: 'This is test description. Not a lot going on.',
      images: [],
      location: {}
    },
    state: {
      isLoggedOn: false,
      activeTab: 'home',
      selectedProfile: {...this.me},
      loading: false,
      isProfileActive: false,
      currentPerson: undefined,
      isMatchModuleActive: false,
      isEditing: false,
      isEditable: false,
      currentImage: undefined,
      uploadText: ''
    },
    nearMe: [],
    matches: [],
    init() {
      console.log("init!");
      console.log('get token from session');
      const token = window.sessionStorage.getItem('accessToken');
      if (!token) {
        this.state.isLoggedOn = false;
        console.log('No token found. Not logged in.');
        return;
      }
      this.token = token;
      console.log(`token is now set: ${this.token}`);
      console.log(`[init] isLoggedOn: ${this.state.isLoggedOn}`);
      this.state.isLoggedOn = true;
      this.getPeopleNearMe().then(data => {
        this.nearMe = [...data];
        this.setCurrentPerson();
        this.getProfile().then(me => {
          this.me = {...me};
          console.log(this.state);
        }).catch(e => console.log(e));
        this.getMatches().then(d => {
          this.matches = [...d];
        }).catch(e=> console.log(`Couldn't get matches: ${e}`));
      }).catch(e => console.log(e));
    },
    setCurrentPerson() {
      if (this.nearMe.length < 1) {
        this.getPeopleNearMe().then(p => {
          if (p.length > 0) {
            this.nearMe = [...p];
          } else {
            console.log("No Near You");
            this.state.currentPerson = undefined;
            return;
          }
        })
      }
      this.state.currentPerson = this.nearMe[0];
      console.log(this.state.currentPerson);
    },
    pass() {
      console.log('passed');
      this.swipe(this.state.currentPerson.userId, 'pass').then(() => {
        [,...this.nearMe] = this.nearMe;
        this.setCurrentPerson();
        //if(this.nearMe.length < 1) this.getPeopleNearMe();
      }).catch(e => {
        console.log('like fetch failed');
      });
    },
    like() {
      console.log(`token is after: ${this.token}`);
      console.log('liked!');
      this.swipe(this.state.currentPerson.userId, 'like').then(data => {
        if (data.wasMatched === false)
        {
          console.log('No matches returned.');
        } else if (data.wasMatched) {
          console.log("you got a match!");
          this.matches = [...this.matches, match];
          this.state.selectedProfile = {...user};
          this.state.isMatchModuleActive = true;
        } else {
          console.log(`[like()] wrong response data`);
        }
        [,...this.nearMe] = this.nearMe;
        this.setCurrentPerson();
      }).catch(e => {
        console.log(`like fetch failed: ${e}`);
      });
    },
    setMatchesListHTML() {
      return this.matches !== undefined && this.matches.length > 0? this.matches.map(match => /*html*/`
        <div class="button section" width=100%> 
            <div class="row">
              <div class="col-sm-4">  
                <img
                    src=${match.img && match.img.length > 0?match.images.imageUrl[0]:'https://via.placeholder.com/300.png'}
                    width="92px"
                />
              </div>
              <div class="col-sm-8">
                <h4>${match.firstName?match.firstName:'No Name Found'}</h4>
              </div>
            </div>
        </div>
        `)
          .join('\n'):
        '';
    },
    showProfile(user) {
      this.state.selectedProfile = {...user};
      console.log(this.state.selectedProfile);
      this.state.isProfileActive = true;
      console.log(this.state);
    },
    initMatchesSection() {
      this.state.loading = true;
      this.getMatches().then(d => {
        this.state.loading = false;
        this.matches = [...d];
      }).catch(e=> this.state.loading = false || console.log(`Couldn't get matches: ${e}`));
    },
    cancelEditProfile() {
      this.state.selectedProfile = {...this.me};
      this.state.isEditing = false;
    },
    login() {
      this.state.loading = true;
      const signupBox = document.querySelector('#login');
      const usernameField = signupBox.querySelector('input[type="text"');
      const passwordField = signupBox.querySelector('input[type="password"');
      const infoField = signupBox.querySelector('#info');
      infoField.innerHTML = '';
      console.log(`username input: ${usernameField.value}`);
      console.log(`password input: ${passwordField.value}`);
      console.log("submitted");
      fetch(`${apiURL}/public/login`, {
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
          this.state.loading = false;
          if (data.message) {
            if (data.message === `Invalid Credentials`) {
              infoField.innerHTML = "Invalid Credentials";
            }
            return;
          }
          if (data.token === undefined) {
            console.log(`issue logging in.`);
            console.error(data);
            return;
          }
          console.log(`token recieved: ${data.token}`);
          window.sessionStorage.accessToken = data.token;
          this.init();
        }).catch((e) => {
          this.state.loading = false;
          console.log(e);
        })
      });
    },
    signUp() {
      const signupBox = document.querySelector('#signup');
      const usernameField = signupBox.querySelector('#username');
      const emailField = signupBox.querySelector('#email');
      const passwordField = signupBox.querySelector('#password');
      const firstField = signupBox.querySelector('#first');
      const lastField = signupBox.querySelector('#last');
      const dobField = signupBox.querySelector('#dob');
      this.state.loading = true;
      console.log(`username input: ${usernameField.value}`);
      console.log(`email input: ${emailField.value}`);
      console.log(`password input: ${passwordField.value}`);
      console.log("submitted");
      fetch(`${apiURL}/public/signup`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: usernameField.value, 
          password: passwordField.value,
          dob: dobField.value.toString(),
          firstName: firstField.value,
          lastName: lastField.value,
          email: emailField.value,
        })
      })
      .then(response => {
        return response.json().then(data => {
          this.state.loading = false;
          if (data.token === undefined) {
            console.log(`issue logging in.`);
            console.error(data);
            return;
          }
          console.log(`token recieved: ${data.token}`);
          window.sessionStorage.accessToken = data.token;
          this.init();
        }).catch((e) => {
          this.state.loading = false;
          console.log(e);
        })
      });
    },
    logout() {
      window.sessionStorage.removeItem('accessToken');
      this.init();
    },
    getPeopleNearMe() {
      return new Promise((resolve, reject) => fetch(`${apiURL}/secure/profiles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then(r => r.json()
        .then(data => {
          console.log(data);
          if (Array.isArray(data) && data) {
            resolve(data);
          } else {
            console.log(`getPeopleNearMe returned wrong data`);
            reject(`getPeopleNearMe returned wrong data`);
          }
        })
        .catch(e=> {
          console.log(e);
          reject(e);
        })
      ).catch(e => {
        console.log("near me request failed.");
        reject("near me request failed.")
      }));
    },
    getMatches() {
      return new Promise((resolve, reject) => 
      fetch(`${apiURL}/secure/matches`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then(r => console.log(r) || r.json()
        .then(data => {
          if (data.matches) {
            resolve(data.matches);
          }
          reject(`Wrong data for getMatches`);
        })
        .catch(e => {
          console.log("matches request failed.");
          reject(`e`);
      }))
      .catch(e => reject(e)))
    },
    getProfile() {
      return new Promise((resolve, reject) => fetch(`${apiURL}/secure/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then(r => r.json()
        .then(data => {
          console.log(data)
          resolve(data)
        })
        .catch(e => reject(e))
      ).catch(e => {
        console.log("profile request failed.");
        reject(e);
      }));
    },
    swipe(userId, answer) {
      return new Promise((resolve, reject) => {
        console.log(`[swipe] userid in: ${userId}/secure/swipe`);
        if (!(answer === 'like' || answer === 'pass'))
        {
          console.error(`answer [${answer}] is set to an invalid response`);
        }
        fetch(`${apiURL}/secure/swipe`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            liked: answer === 'like'? true: false
          })
        })
        .then(r => {
          if (r.status === 404) {
            reject('404');
          }
          return console.log(r) || r.json()
            .then(data => {
              console.log(data);
              if (data.wasMatched != undefined) {
                resolve(data);
              }
              resolve(`was Matched not found in ${data}`);
            })
        }).catch(e => {
          console.log(`${answer} request failed.`);
          reject(e);
        });
      });
    },
    imagesSwipeHTML(user) {
      return user !== undefined && user.images !== undefined && user.images.length > 0
        ? user.images.map(img => /*html*/`
          <img src=${img.imageUrl} width="100vw">
        `).join('\n')
        : '';
    },
    addImage() {
      const profile = document.querySelector('#profile');
      const imageField = profile.querySelector('#add-image');
      if (imageField.files[0]) 
        this.postImage(imageField.files[0]).then(d => {
          console.log(d);
          this.me.images = [
            ...images, {
              imageId: d.imageId,
              imageUrl: d.imageUrl
          }];
          this.state.selectedProfile = {...me};
          this.state.uploadText = `Image Uploaded.`;
        }).catch (e => {
          console.log(`error uploading image ${e}`);
        })
      else
        console.log('error: no image.');
    },
    postImage(image) {
      return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append("image", image);
        fetch(`${apiURL}/secure/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json',
          },
          body: formData
        })
        .then(response => {
          if (response)
            response.json().then(d => {
              console.log(`[addImage] data:`);
              console.log(d);
              resolve(d);
            })
          reject('no response');
        }).catch(e => {
          reject(`Failed to add image: ${e}`);
        });
      });
    },
    updateProfile() {
      const profile = document.querySelector('#profile');
      const heightField = profile.querySelector('#height');
      const aboutField = profile.querySelector('#about');
      const heightValue = heightField.value !== ''? heightField.value: this.me.height;
      const aboutValue = aboutField.value!== ''? aboutField.value: this.me.about;
      console.log(`about ${aboutValue} - height: ${heightValue}`);
      if (heightValue === this.me.height && aboutValue === this.me.about) {
        console.log('no changes');
        this.state.loading = false;
        this.state.selectedProfile = {...this.me};
        this.state.isEditing = false;
        return;
      }
      
      this.state.loading = true;

      fetch(`${apiURL}/secure/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          height: heightValue, 
          about: aboutValue,
        })
      })
      .then(response => {
        return response.json().then(data => {
          this.state.loading = false;
          if (data.about) {
            this.me.about = data.about;
          }
          if (data.height) {
            this.me.height = data.height;
          }
          console.log(this.me);
          this.state.selectedProfile = {...this.me};
          this.state.isEditing = false;
        }).catch((e) => {
          this.selectedProfile = {...this.me};
          this.state.loading = false;
          console.log(e);
        });
      });
    },
    getAge(DOB) {
      var today = new Date();
      var birthDate = new Date(DOB);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age = age - 1;
      }
      return age;
    },
    setLocation(callback) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.me.location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }

          console.log(this.me.location);
          callback(pos);
        })
      }
    }
  });
}