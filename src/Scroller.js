import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/observable/fromEvent';

export default class Scroller extends Component {
  constructor() {
    super();
    this.check$ = new Subject().filter(this.shouldLoadMore);
  }

  componentDidMount() {
    const { doOneCheck, doRecursiveCheck, elm, check$ } = this;
    const { checkOnResize = true } = this.props;

    check$
      .debounceTime(20)
      .startWith(true)
      .exhaustMap(recur => Promise.all([recur, this.props.loadMore()]))
      .map(arr => arr[0])
      .subscribe(recur => recur && doRecursiveCheck());

    if (checkOnResize) {
      Observable.fromEvent(window, 'resize').subscribe(doRecursiveCheck);
    }

    Observable.fromEvent(elm, 'scroll')
      .map(() => elm.scrollTop)
      .pairwise()
      .filter(x => x[1] > x[0])
      .merge(
        Observable.fromEvent(elm, 'mousewheel').filter(
          e => (e.originalEvent || e).deltaY >= 0
        )
      )
      .subscribe(doOneCheck);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checkOnValueChange != this.props.checkOnValueChange) {
      setTimeout(this.doRecursiveCheck);
    }
  }

  componentWillUnmount() {
    this.check$.complete();
  }

  doOneCheck = () => this.check$.next(false);
  doRecursiveCheck = () => this.check$.next(true);

  shouldLoadMore = () => {
    const { distanceToBottom = 0, hasMore } = this.props;
    const { elm } = this;
    return (
      hasMore &&
      elm.scrollHeight - elm.scrollTop - elm.clientHeight <= distanceToBottom
    );
  };

  render() {
    const { children } = this.props;
    return (
      <div
        ref={elm => (this.elm = elm)}
        style={{
          height: '100%',
          overflow: 'auto'
        }}
      >
        {children}
      </div>
    );
  }
}

Scroller.propTypes = {
  hasMore: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  checkOnResize: PropTypes.bool,
  distanceToBottom: PropTypes.number
};

Scroller.defaultProps = {
  checkOnResize: true,
  distanceToBottom: 0
};
