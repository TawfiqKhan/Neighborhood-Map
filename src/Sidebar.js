import React, { Component } from "react";

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <input
          role="search"
          tabIndex={0}
          aria-label="Filter Location"
          className="search-field"
          type="text"
          placeholder="Filter Location"
          onChange={e => this.props.filterPlace(e.target.value)}
        />
        <ol
          className="locationList"
          role="listbox"
          aria-label="List of Location"
        >
          {this.props.places.map(place => (
            <li
              className="listitems"
              role="option"
              key={place.venue.id}
              tabIndex={0}
              onClick={() => {
                this.props.listItemClick(place);
              }}
              onKeyPress={event => {
                if (event.key === "Enter") {
                  this.props.listItemClick(place);
                }
              }}
            >
              <h3>{place.venue.name}</h3>
            </li>
          ))}
        </ol>
      </div>
    );
  }
}

export default Sidebar;
