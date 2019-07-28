"use strict";

/* exported eventfulPropertyDescriptors */
var eventfulPropertyDescriptors = {
  _eventData: {
    configurable: false,
    enumerable: false,
    value: undefined,
    writable: true
  },
  on: {
    configurable: false,
    enumerable: false,
    value: function value(event, handler) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var owner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this;
      var calledByOwner = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (this._eventData == null) {
        this._eventData = [];
      }

      this._eventData.push({
        event: event,
        handler: handler,
        once: once,
        owner: owner
      });

      if (!calledByOwner && owner && owner !== this && owner.listenTo) {
        owner.listenTo(this, event, handler, once, true);
      }
    },
    writable: false
  },
  off: {
    configurable: false,
    enumerable: false,
    value: function value(event, handler, once, owner) {
      var calledByOwner = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (this._eventData == null) {
        return;
      }

      var index = 0;

      while (index < this._eventData.length) {
        var eventData = this._eventData[index];

        if ((event == null || event === eventData.event) && (handler == null || handler === eventData.handler) && (once == null || once === eventData.once) && (owner == null || owner === eventData.owner)) {
          this._eventData.splice(index, 1);

          if (!calledByOwner && eventData.owner && eventData.owner !== this && eventData.owner.stopListeningTo) {
            eventData.owner.stopListeningTo(this, eventData.event, eventData.handler, eventData.once, true);
          }

          continue;
        }

        index++;
      }
    },
    writable: false
  },
  trigger: {
    configurable: false,
    enumerable: false,
    value: function value(event) {
      if (this._eventData == null) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      for (var index = 0, length = this._eventData.length; index < length; index++) {
        var _eventData$handler;

        var eventData = this._eventData[index];

        if (eventData.event !== event) {
          continue;
        }

        (_eventData$handler = eventData.handler).call.apply(_eventData$handler, [eventData.owner].concat(args));
      }

      this.off(event, null, true);
    },
    writable: false
  },
  _listenToData: {
    configurable: false,
    enumerable: false,
    value: undefined,
    writable: true
  },
  listenTo: {
    configurable: false,
    enumerable: false,
    value: function value(other, event, handler) {
      var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var calledByOther = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (this._listenToData == null) {
        this._listenToData = [];
      }

      this._listenToData.push({
        other: other,
        event: event,
        handler: handler,
        once: once
      });

      if (!calledByOther && other && other.on) {
        other.on(event, handler, once, this, true);
      }
    },
    writable: false
  },
  stopListeningTo: {
    configurable: false,
    enumerable: false,
    value: function value(other, event, handler, once) {
      var calledByOther = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (this._listenToData == null) {
        return;
      }

      var index = 0;

      while (index < this._listenToData.length) {
        var listenToData = this._listenToData[index];

        if ((other == null || other === listenToData.other) && (event == null || event === listenToData.event) && (handler == null || handler === listenToData.handler) && (once == null || once === listenToData.once)) {
          this._listenToData.splice(index, 1);

          if (!calledByOther && listenToData.other && listenToData.other.off) {
            listenToData.other.off(listenToData.event, listenToData.handler, listenToData.once, this, true);
          }

          continue;
        }

        index++;
      }
    },
    writable: false
  }
};