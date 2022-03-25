import auth0 from 'auth0-js'

export default class Auth {
  auth = new auth0.WebAuth({
    domain: 'dev-lj5y3y8f.eu.auth0.com',
    clientID: 'gP5ljjv8e7L1haprnRv7rJhaM77mt3jc',
    // redirectUri: 'http://localhost:3000/callback',
    redirectUri: 'https://blog-reactnode.herokuapp.com/callback',
    responseType: 'token id_token',
    scope: 'openid profile email'
  })

  userProfile = {}

  login = () => {
      this.auth.authorize()
  }

  handleAuth = history => {
    this.auth.parseHash((err, authResult) => {
      if(authResult) {
        localStorage.setItem('access_token', authResult.accessToken)
        localStorage.setItem('id_token', authResult.idToken)

        let expiresAt = JSON.stringify((authResult.expiresIn * 1000 + new Date().getTime()))
        localStorage.setItem('expiresAt', expiresAt)

        this.getProfile(()=>{history.replace('/authcheck')});
      } else {
        console.log(err)
      }
    })
  }

  getAccessToken = () => {
    if(localStorage.getItem('access_token')) {
      const accessToken = localStorage.getItem('access_token')
      return accessToken
    } else {
      return null
    }
  }


  getProfile = (callback) => {
    let accessToken = this.getAccessToken()
    if(accessToken) {
      this.auth.client.userInfo(accessToken, (err, profile) => {
          if(profile) {
            this.userProfile = { profile }
            callback()
          }
      } )
    }
  }


  logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expiresAt')
    this.auth.logout({
      // returnTo: 'http://localhost:3000/authcheck',
      returnTo: 'https://blog-reactnode.herokuapp.com/authcheck',
      client_id: 'gP5ljjv8e7L1haprnRv7rJhaM77mt3jc'
    });
    // setTimeout(() => { history.replace('/authcheck') }, 200);
  }

  isAuthenticated = () => {
    let expiresAt = JSON.parse(localStorage.getItem('expiresAt'))
    return new Date().getTime() < expiresAt
  }

}
