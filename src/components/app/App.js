import React, { Component } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Repo from "./Repo";
import { ImpulseSpinner } from "react-spinners-kit";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      limit: 10,
      loading: false,
      isSearch: false,
      error: false,
      isUserExist: true
    };
    this.loadMore = this.loadMore.bind(this);
  }

  handleResponse(response) {
    if (response.status === 404) {
      this.setState({
        isUserExist: false,
        loading: false
      })
      throw new Error(response.status);
    }
    return response.json();
  }

  getUserRepositories = () => {
    const username = this.refs.username.value;
    const apiUrl = "https://api.github.com";

    this.setState({
      loading: true,
      repos: []
    });

    setTimeout(() => {
      fetch(`${apiUrl}/users/${username}/repos`)
        .then(resp => this.handleResponse(resp))
        .then(resp => {
          this.setState({
            repos: resp,
            loading: false,
            isSearch: true,
            isUserExist: true
          });
        })
        .catch(error => {
          this.setState({
            error: true
          });
        });
    }, 500);
  };

  onEnterPress(target) {
    if (target.charCode === 13) {
      this.getUserRepositories();
    }
  }

  loadMore() {
    this.setState(prev => {
      return { limit: prev.limit + 10 };
    });
  }

  render() {
    const isSearch = this.state.isSearch;
    const isUserExist = this.state.isUserExist;
    return (
      <section>
        <div className="container">
          <div className="row search-bar">
            <input
              type="text"
              ref="username"
              placeholder="Enter a username"
              onKeyPress={this.onEnterPress.bind(this)}
            />
            <button type="button" onClick={this.getUserRepositories}>
              Search
            </button>
          </div>
          {!isUserExist ? <div className="error-message">User not found</div> : null}
          <table className="table table-striped table-bordered table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Stars</th>
                <th>Forks</th>
              </tr>
            </thead>
            <tbody>
              {!isSearch ? (
                <tr>
                  <td colSpan="3" className="search-info">
                    Click "Search" to load data
                  </td>
                </tr>
              ) : null}
              {this.state.repos.slice(0, this.state.limit).map((item, key) => (
                <Repo item={item} key={key} />
              ))}
            </tbody>
          </table>
          <div className="loading-spinner">
            <ImpulseSpinner loading={this.state.loading} />
          </div>
          {this.state.limit < this.state.repos.length ||
          this.state.repos.length === 0 ? (
            <div className="row load-more">
              <button
                type="button"
                onClick={this.loadMore}
              >
                Load more...
              </button>
            </div>
          ) : null}
        </div>
      </section>
    );
  }
}

export default App;
