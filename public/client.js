function match() {
  return ({
    username: '',
    token: '',
    activeTab: 'home',
    potentialMatches: [{
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
    currentMatch() {
      if (this.potentialMatches.length < 1) {
        return undefined;
      }
      
      match = this.potentialMatches[0];
      return match;
    },
    pass() {
      console.log('passed');
      [,...this.potentialMatches] = this.potentialMatches;
      console.log(this.potentialMatches);
    },
    like() {
      console.log('liked!');
      this.matches = [...this.matches, this.currentMatch()];
      [,...this.potentialMatches] = this.potentialMatches;
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
  });
}