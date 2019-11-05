import React from "react";
import { Spin, Icon } from "antd";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";
import * as navActions from "../store/actions/nav";
import * as messageActions from "../store/actions/message";
import Contact from "../components/Contact";
import { IMG_URL } from "../settings";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Sidepanel extends React.Component {
  state = {
    loginForm: true
  };

  waitForAuthDetails() {
    const component = this;
    setTimeout(function () {
      if (
        component.props.token !== null &&
        component.props.token !== undefined
      ) {
        component.props.getUserChats(
          component.props.username,
          component.props.token
        );
        return;
      } else {
        console.log("waiting for authentication details...");
        component.waitForAuthDetails();
      }
    }, 100);
  }

  componentDidMount() {
    this.waitForAuthDetails();
  }

  openAddChatPopup() {
    this.props.addChat();
  }

  changeForm = () => {
    this.setState({ loginForm: !this.state.loginForm });
  };

  authenticate = e => {
    e.preventDefault();
    if (this.state.loginForm) {
      this.props.login(e.target.username.value, e.target.password.value);
      console.log(this.props.login);
    } else {
      this.props.signup(
        e.target.username.value,
        e.target.email.value,
        e.target.password.value,
        e.target.password2.value
      );
    }
  };

  render() {
    let activeChats = this.props.chats.map(c => {
      return (
        <Contact
          key={c.id && console.log(this.props.chats)}
          name={c.participants[0] == this.props.username ? c.participants[1] : c.participants[0]}
          picURL="http://emilcarlsson.se/assets/louislitt.png"
          status="online"
          chatURL={`/${c.id}`}
        />
      );
    });
    return (
      <div id="sidepanel">
        <div id="profile">
          <div className="wrap">
            {
              this.props.isAuthenticated ? (
                <div>
                  <img
                    id="profile-img"
                    src={IMG_URL}
                    className="online"
                    alt=""
                  />
                  <p>{this.props.username}</p>
                </div>
              ) : (
                  <p>Authentication</p>
                )
            }

            <div id="expanded">
              {this.props.loading ? (
                <Spin indicator={antIcon} />
              ) : this.props.isAuthenticated ? (
                <button onClick={() => this.props.logout()} className="authBtn">
                  <span>Logout</span>
                </button>
              ) : (
                    <div>
                      <form method="POST" onSubmit={this.authenticate}>
                        {this.state.loginForm ? (
                          <div>
                            <input
                              name="username"
                              type="text"
                              placeholder="username"
                            />
                            <input
                              name="password"
                              type="password"
                              placeholder="password"
                            />
                            <button type="submit">Login</button>
                          </div>
                        ) : (
                            <div>
                              <input
                                name="username"
                                type="text"
                                placeholder="username"
                              />
                              <input name="email" type="email" placeholder="email" />
                              <input
                                name="password"
                                type="password"
                                placeholder="password"
                              />
                              <input
                                name="password2"
                                type="password"
                                placeholder="password confirm"
                              />
                              <button type="submit">Sign Up</button>
                            </div>
                          )}
                      </form>

                      <button onClick={this.changeForm}>Switch</button>
                    </div>
                  )}
            </div>
          </div>
        </div>
        <div id="search">
          <label htmlFor="">
            <i className="fa fa-search" aria-hidden="true" />
          </label>
          <input type="text" placeholder="Search Chats..." />
        </div>
        <div id="contacts">
          <ul>{
            this.props.token === null ?
              null :
              activeChats
          }</ul>
        </div>
        <div id="bottom-bar">
          <button id="addChat" onClick={() => this.openAddChatPopup()}>
            <i className="fa fa-user-plus fa-fw" aria-hidden="true" />
            <span>Create chat</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    loading: state.auth.loading,
    token: state.auth.token,
    username: state.auth.username,
    chats: state.message.chats
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (userName, password) =>
      dispatch(actions.authLogin(userName, password)),
    logout: () => dispatch(actions.logout()),
    signup: (username, email, password1, password2) =>
      dispatch(actions.authSignup(username, email, password1, password2)),
    addChat: () => dispatch(navActions.openAddChatPopup()),
    getUserChats: (username, token) =>
      dispatch(messageActions.getUserChats(username, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidepanel);
