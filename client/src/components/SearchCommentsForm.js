import React from 'react';

class SearchCommentsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTextValue: '',
    };
  }
  handleSearchChange = event => {
    this.setState({ searchTextValue: event.target.value });
  };

  handleSearchSubmit = event => {
    event.preventDefault();
    this.props.onSearchSubmit(this.state.searchTextValue);
  };

  render() {
    return (
      <nav>
        <form onSubmit={this.handleSearchSubmit}>
          <input
            type="text"
            value={this.state.searchTextValue}
            onChange={this.handleSearchChange}
            name="search"
            placeholder="Search"
          />
          <button type="submit">Search</button>
        </form>
      </nav>
    );
  }
}

export default SearchCommentsForm;
