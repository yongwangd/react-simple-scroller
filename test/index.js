import React from 'react';
import ReactDOM from 'react-dom';
import Scroller from '../dist/Scroller';

const perPage = 3;
const visible = 3;

const getNumbers = count => {
  let array = [];
  for (let i = 0; i < count; i++) {
    array.push(i);
  }
  return array;
};

class App extends React.Component {
  state = {
    items: getNumbers(100),
    visible,
    show: true
  };

  loadMore = () => {
    console.log('loadmore called');
    this.setState({ loading: true });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.setState({ loading: false });
        this.setState({
          visible: this.state.visible + perPage
        });
        resolve('done');
      }, 500);
    });
  };

  render() {
    const { items, visible, loading = false, show = true } = this.state;
    const { loadMore } = this;
    const hasMore = visible < items.length;
    return (
      <div>
        <div>items showing: {visible}</div>
        {this.state.show && (
          <div
            id="wrap"
            style={{
              height: '80vh',
              width: 500,
              border: '1px solid black'
            }}
          >
            <Scroller
              checkOnResize
              checkOnValueChange={items.length}
              loadMore={loadMore}
              hasMore={hasMore}
            >
              {items.slice(0, visible).map(it => (
                <div
                  style={{
                    border: '1px solid red',
                    margin: 4,
                    padding: 2
                  }}
                  key={it}
                >
                  {it}
                </div>
              ))}
              {loading && <p>Loading...</p>}
            </Scroller>
          </div>
        )}
      </div>
    );
  }
}

if (process.browser)
  ReactDOM.render(<App />, document.getElementById('content'));
