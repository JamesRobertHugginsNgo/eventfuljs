/* exported eventfulPropertyDescriptors */
const eventfulPropertyDescriptors = {
	_eventData: {
		configurable: false,
		enumerable: false,
		value: undefined,
		writable: true
	},

	on: {
		configurable: false,
		enumerable: false,
		value: function (event, handler, once = false, owner = this, calledByOwner = false) {
			if (this._eventData == null) {
				this._eventData = [];
			}

			this._eventData.push({ event, handler, once, owner });
			if (!calledByOwner && owner && owner !== this && owner.listenTo) {
				owner.listenTo(this, event, handler, once, true);
			}
		},
		writable: false
	},

	off: {
		configurable: false,
		enumerable: false,
		value: function (event, handler, once, owner, calledByOwner = false) {
			if (this._eventData == null) {
				return;
			}

			let index = 0;
			while (index < this._eventData.length) {
				const eventData = this._eventData[index];
				if ((event == null || event === eventData.event)
					&& (handler == null || handler === eventData.handler)
					&& (once == null || once === eventData.once)
					&& (owner == null || owner === eventData.owner)) {

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
		value: function (event, ...args) {
			if (this._eventData == null) {
				return;
			}

			for (let index = 0, length = this._eventData.length; index < length; index++) {
				const eventData = this._eventData[index];
				if (eventData.event !== event) {
					continue;
				}

				eventData.handler.call(eventData.owner, ...args);
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
		value: function (other, event, handler, once = false, calledByOther = false) {
			if (this._listenToData == null) {
				this._listenToData = [];
			}

			this._listenToData.push({ other, event, handler, once });
			if (!calledByOther && other && other.on) {
				other.on(event, handler, once, this, true);
			}
		},
		writable: false
	},

	stopListeningTo: {
		configurable: false,
		enumerable: false,
		value: function (other, event, handler, once, calledByOther = false) {
			if (this._listenToData == null) {
				return;
			}

			let index = 0;
			while (index < this._listenToData.length) {
				const listenToData = this._listenToData[index];
				if ((other == null || other === listenToData.other)
					&& (event == null || event === listenToData.event)
					&& (handler == null || handler === listenToData.handler)
					&& (once == null || once === listenToData.once)) {

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
}
