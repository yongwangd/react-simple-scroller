'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Observable = require('rxjs/Observable');

var _Subject = require('rxjs/Subject');

require('rxjs/add/operator/takeUntil');

require('rxjs/add/operator/filter');

require('rxjs/add/operator/map');

require('rxjs/add/operator/pairwise');

require('rxjs/add/operator/merge');

require('rxjs/add/operator/debounceTime');

require('rxjs/add/operator/startWith');

require('rxjs/add/operator/exhaustMap');

require('rxjs/add/observable/fromEvent');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scroller = function (_Component) {
  _inherits(Scroller, _Component);

  function Scroller() {
    _classCallCheck(this, Scroller);

    var _this = _possibleConstructorReturn(this, (Scroller.__proto__ || Object.getPrototypeOf(Scroller)).call(this));

    _this.doOneCheck = function () {
      return _this.check$.next(false);
    };

    _this.doRecursiveCheck = function () {
      return _this.check$.next(true);
    };

    _this.shouldLoadMore = function () {
      var _this$props = _this.props,
          _this$props$distanceT = _this$props.distanceToBottom,
          distanceToBottom = _this$props$distanceT === undefined ? 0 : _this$props$distanceT,
          hasMore = _this$props.hasMore;
      var elm = _this.elm;

      return hasMore && elm.scrollHeight - elm.scrollTop - elm.clientHeight <= distanceToBottom;
    };

    _this.check$ = new _Subject.Subject().filter(_this.shouldLoadMore);
    return _this;
  }

  _createClass(Scroller, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var doOneCheck = this.doOneCheck,
          doRecursiveCheck = this.doRecursiveCheck,
          elm = this.elm,
          check$ = this.check$;
      var _props$checkOnResize = this.props.checkOnResize,
          checkOnResize = _props$checkOnResize === undefined ? true : _props$checkOnResize;


      check$.debounceTime(20).startWith(true).exhaustMap(function (recur) {
        return Promise.all([recur, _this2.props.loadMore()]);
      }).map(function (arr) {
        return arr[0];
      }).subscribe(function (recur) {
        return recur && doRecursiveCheck();
      });

      if (checkOnResize) {
        _Observable.Observable.fromEvent(window, 'resize').subscribe(doRecursiveCheck);
      }

      _Observable.Observable.fromEvent(elm, 'scroll').map(function () {
        return elm.scrollTop;
      }).pairwise().filter(function (x) {
        return x[1] > x[0];
      }).merge(_Observable.Observable.fromEvent(elm, 'mousewheel').filter(function (e) {
        return (e.originalEvent || e).deltaY >= 0;
      })).subscribe(doOneCheck);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.checkOnValueChange != this.props.checkOnValueChange) {
        setTimeout(this.doRecursiveCheck);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.check$.complete();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var children = this.props.children;

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(elm) {
            return _this3.elm = elm;
          },
          style: {
            height: '100%',
            overflow: 'auto'
          }
        },
        children
      );
    }
  }]);

  return Scroller;
}(_react.Component);

exports.default = Scroller;


Scroller.propTypes = {
  hasMore: _propTypes2.default.bool.isRequired,
  loadMore: _propTypes2.default.func.isRequired,
  checkOnResize: _propTypes2.default.bool,
  distanceToBottom: _propTypes2.default.number
};

Scroller.defaultProps = {
  checkOnResize: true,
  distanceToBottom: 0
};