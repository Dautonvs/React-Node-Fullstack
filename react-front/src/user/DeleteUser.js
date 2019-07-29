import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {isAuthenticated, signout} from '../auth';
import {remove} from './apiUser';



class DeleteUser extends Component {

  state = {
    redirect: false
  }


  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    remove(userId, token)
    .then(data => {
      if(data.error){
        console.log(data.error);
      }else {
        //signout user
        signout(() => console.log("Ok, was deleted!"));
        //redirect
        this.setState({redirect: true});
      }
    })
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure about that?");
    if(answer){
      this.deleteAccount();
    }
  };



  render() {
    if(this.state.redirect){
      return <Redirect to="/" />
    }
    return (
      <div>
        <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
          Delete Profile
        </button>
      </div>
    )
  }
};

export default DeleteUser;
