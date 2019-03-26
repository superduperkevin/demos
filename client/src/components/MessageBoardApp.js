import React from 'react';
import axios from 'axios';
import '../css/MessageBoard.css';
import CommentList from './CommentList';
import AddCommentForm from './AddCommentForm';
import SearchCommentsForm from './SearchCommentsForm';

/* Your task: 
    1. pass comments down to CommentList (using props)
    2. create a commentItem component
    3. render a single CommentItem with the data from the first comment (aka comment[0]) 
    4. Don't forget CSS!
*/

class MessageBoardApp extends React.Component {
  constructor(props) {
    super(props);

    // set initial state
    this.state = {
      comments: [],
    };
  }

  // lifecycle hook ran after component is loaded into DOM
  componentDidMount() {
    axios
      .get('https://express-codealonggg.herokuapp.com/api/comments')
      .then(response => this.setState({ comments: response.data }));
  }

  handleDelete = id => {
    axios
      .delete(`https://express-codealonggg.herokuapp.com/api/comments/${id}`)
      .then(response => this.setState({ comments: response.data.comments }))
      .catch(error => console.error(error));
    // filter out comments
    // const updatedComments = this.state.comments.filter(comment => comment.id !== id);
    // // set state
    // this.setState({ comments: updatedComments });
  };

  handleAddComment = commentText => {
    axios
      .post('https://express-codealonggg.herokuapp.com/api/comments/', {
        text: commentText,
      })
      .then(response => this.setState({ comments: response.data.comments }))
      .catch(err => {
        if (err.response && err.response.status === 400) {
          alert('Please enter comment text!');
        }
      });
  };

  handleSearchSubmit = searchTextValue => {
    axios
      .get('https://express-codealonggg.herokuapp.com/api/comments/', {
        params: { filter: searchTextValue },
      })
      .then(response => this.setState({ comments: response.data }));
  };
  render() {
    return (
      <div className="message-board-app">
        <SearchCommentsForm onSearchSubmit={this.handleSearchSubmit} />
        <CommentList comments={this.state.comments} onDelete={this.handleDelete} />
        <AddCommentForm onAddComment={this.handleAddComment} />
      </div>
    );
  }
}

export default MessageBoardApp;
