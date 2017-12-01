import React from 'react';
import ScrollContainer from '../src/Scroller';

let id = 0;
const getData = count => {
  let array = [];
  for (let i = 0; i < count; i++) {
    array.push(id++);
  }
  return array;
};

const getDataAsync = count => {
  return new Promise(resolve =>
    setTimeout(() => resolve(getData(count)), 1000)
  );
};

class TestCmp extends React.Component {
  state = {
    items: getData(5)
  };
  render() {
    const { items } = this.state;
    return (
      <div style={{ border: '1px solid black', height: 500 }}>
        <ScrollContainer
          loadMore={() =>
            getDataAsync(5).then(newItems =>
              this.setState({ items: items.concat(newItems) })
            )
          }
          hasMore={items.length < 50}
        >
          {items.map(item => (
            <div style={{ border: '1px solid red' }}>{item}</div>
          ))}
        </ScrollContainer>
      </div>
    );
  }
}
