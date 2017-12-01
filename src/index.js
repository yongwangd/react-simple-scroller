import React from 'react';
import ReactDOM from 'react-dom';
import * as R from 'ramda';
import Scroller from './Scroller';

const perPage = 3;
const visible = 3;

class App extends React.Component {
  state = {
    items: [],
    visible,
    show: true
  };

  loadMore = () => {
    console.log('loadmore called');
    this.setState({ loading: true });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // console.log('resolved loadmore');
        this.setState({ loading: false });
        if (Math.random() > 0) {
          this.setState({
            visible: this.state.visible + perPage
          });
          resolve('im happy');
        } else reject('Una');
      }, 200 + Math.random() * 800);
    });
  };

  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          items: R.range(1, 120).map(id => ({
            id,
            height: 10 + Math.random() * 10
          }))
        }),
      1000
    );
  }

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
                    height: it.height
                  }}
                  key={it.id}
                >
                  {it.id}
                </div>
              ))}
              {loading && <div>Loading...</div>}
            </Scroller>
          </div>
        )}
      </div>
    );
  }
}

if (process.browser)
  ReactDOM.render(<App />, document.getElementById('content'));
