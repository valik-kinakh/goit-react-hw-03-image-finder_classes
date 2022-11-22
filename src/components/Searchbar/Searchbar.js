import React from 'react';
import PropTypes from 'prop-types';
import Container from '../Container';
import { BiSearch } from 'react-icons/bi';
import s from './Searchbar.module.css';

class Searchbar extends React.Component {
  constructor(props) {
    super(props);

    this.search = React.createRef();
  }

  handleSubmitForm = e => {
    const { onSubmit } = this.props;
    e.preventDefault();

    if (!this.search.current.value) {
      alert('Please, enter your request!');
      return;
    }

    onSubmit(this.search.current.value);
  };

  render() {
    return (
      <header className={s.Searchbar}>
        <Container>
          <form onSubmit={this.handleSubmitForm} className={s.SearchForm}>
            <button type="submit" className={s.Button}>
              <BiSearch />
            </button>

            <input
              ref={this.search}
              className={s.Input}
              type="text"
              autoComplete="off"
              autoFocus
              placeholder="Search images and photos"
            />
          </form>
        </Container>
      </header>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
