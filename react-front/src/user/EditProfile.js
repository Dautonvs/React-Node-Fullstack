import React, {Component} from 'react';
import { isAuthenticated } from "../auth";
import {read, update} from "./apiUser";
import {Redirect} from 'react-router-dom';
import DefaultProfile from "../imgs/avatar.png";


class EditProfile extends Component{
  constructor(){
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
          this.setState({ redirectToProfile: true });
      } else {
        this.setState({
                id: data._id,
                name: data.name,
                email: data.email,
                error: ""
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  };

  isValid = () => {
    const {name, email, password, fileSize} = this.state;
    if(fileSize > 10000){
      this.setState({error: "File size should be less than 100kb"});
      return false;
    };
      if(name.lenght === 0){
        this.setState({error: "The name is empty!"});
        return false;
      };

      if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        this.setState({error: "The email is not match!"});
        return false;
      };

      if(password.length >= 1 && password.length <= 5) {
        this.setState({
          error: "The password must contain at least 6 characters"});
        return false;
      }

      return true;
    };



  handleChange = name => event => {
    this.setState({error:""});
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({loading:true});

    if(this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then(data => {
        if(data.error){
          this.setState({error: data.error});
        }
          else this.setState({
              redirectToProfile: true
          });
      });
    }

  };

  signupForm = (name, email, password) => (
    <form>
    <div className="form-group">
      <label className="text-muted">Profile Photo</label>
      <input onChange={this.handleChange("photo")}
             type="file"
             accept="image/*"
             className="form-control"
      />
    </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input onChange={this.handleChange("name")}
               type="text" className="form-control"
               value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input onChange={this.handleChange("email")}
               type="email" className="form-control"
               value={email}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input onChange={this.handleChange("password")}
               type="password" className="form-control"
               value={password}
        />
      </div>
      <button onClick={this.clickSubmit}
              className="btn btn-raised btn-primary">
              Update
      </button>
    </form>
  );


  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading
    } = this.state;

    if(redirectToProfile){
      return <Redirect to={`/user/${id}`} />;
    };

    const photoUrl = id
              ? `${
                    process.env.REACT_APP_API_URL
                }/user/photo/${id}?${new Date().getTime()}`
              : DefaultProfile;

    return(
        <div className="container">
            <h2 className="mt-5 mb-5">Edit Profile</h2>

            <div className="alert alert-danger"
                 style={{display: error ? "" : "none" }}>
                 {error}
            </div>

            {loading ? (
              <div className="jumbotron text-center">
                  <h2>Now Loading...</h2>
              </div>
              ) : (
                ""
            )}

            <img src={photoUrl} alt={name}/>

            {this.signupForm(name, email, password)}
        </div>
    );
  };

}

export default EditProfile;
