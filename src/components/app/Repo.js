import React, { Component } from "react";

class Repo extends Component {
  render() {
    return (
      <tr>
        <td><a href={this.props.item.html_url} target="_blank" rel="noopener noreferrer">{this.props.item.name}</a></td>
        <td>{this.props.item.stargazers_count}</td> 
        <td>{this.props.item.forks}</td>
      </tr>
    );
  }
}
 
export default Repo;
