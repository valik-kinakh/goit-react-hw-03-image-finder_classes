import React from 'react';
import pixabayAPI from '../services/imageAPI';
import Section from './Section';
import Container from './Container';
import WariningMessage from './WarningMessage';
import ErrorMessage from './ErrorMessage';
import ImageGallery from './ImageGallery';
import Loader from './Loader';
import Button from './Button';
import Modal from './Modal';
import Searchbar from './Searchbar';

const IMAGES_PER_REQUEST = 12;

class App extends React.Component {
  state = {
    page: 1,
    error: '',
    query: '',
    loading: false,
    images: [],
    showModal: false,
    modalImageURL: '',
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      if (!this.state.query) return;
      this.setLoading(true);

      const { query, page } = this.state;
      this.getImages(query, page);
    }

    if (
      prevState.images !== this.state.images &&
      this.state.images.length > IMAGES_PER_REQUEST
    ) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  setLoading = value => {
    this.setState(prevState => ({
      ...prevState,
      loading: value,
    }));
  };

  getImages = (query, page) => {
    pixabayAPI
      .fetchImage(query, page)
      .then(({ hits }) => {
        this.setState(prevState => ({
          ...prevState,
          images: [...prevState.images, ...hits],
        }));
      })
      .catch(err => {
        this.setState(prevState => ({
          ...prevState,
          error: err.message,
        }));
      })
      .finally(() => {
        this.setLoading(false);
      });
  };

  handleFormSubmit = query => {
    this.setState(prevState => ({
      ...prevState,
      query,
      page: 1,
      images: [],
    }));
    if (this.state.error) {
      this.setState(prevState => ({
        ...prevState,
        error: '',
      }));
    }
  };

  handleIncrement = () => {
    this.setState(prevState => ({
      ...prevState,
      page: (prevState.page += 1),
    }));
  };

  openModal = url => {
    this.setState(prevState => ({
      ...prevState,
      showModal: true,
      modalImageURL: url,
    }));
  };

  closeModal = () => {
    this.setState(prevState => ({
      ...prevState,
      showModal: false,
      modalImageURL: '',
    }));
  };

  render() {
    const { query, error, images, loading, showModal, modalImageURL } =
      this.state;
    return (
      <div className="app">
        <Searchbar onSubmit={this.handleFormSubmit} />
        <Section>
          <Container>
            {!query && <WariningMessage />}
            {error && <ErrorMessage message={error} />}
            {!error && (
              <ImageGallery images={images} openModal={this.openModal} />
            )}
            {loading && <Loader />}
            {images.length > 0 && !loading && (
              <Button onClick={this.handleIncrement} />
            )}
          </Container>
        </Section>
        {showModal && (
          <Modal onClose={this.closeModal}>
            <img src={modalImageURL} alt="" />
          </Modal>
        )}
      </div>
    );
  }
}

export default App;
