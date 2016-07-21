function Swear(worker) {
    setTimeout(function() {
        worker(this.onSuccessCallback.bind(this), this.onErrorCallback.bind(this));
    }.bind(this), 0);
}

Swear.prototype.onSuccessCallback = function() {
    if (this._thenHandler) {
        const userSwear = this._thenHandler();

        if (userSwear) {
            userSwear.onSuccessCallback = function() {
                this._intermediateSwear.onSuccessCallback();
            }.bind(this);
        } else {
            // User does not provide a swear, invoke the success callback right away.
            this._intermediateSwear.onSuccessCallback();
        }
    }
};

Swear.prototype.onErrorCallback = function() {
    if (this._catchHandler) {
        const userSwear = this._catchHandler();

        if (userSwear) {
            userSwear.onSuccessCallback = function() {
                // TODO: Explain
                this._intermediateSwear.onSuccessCallback();
            }.bind(this);
        }
    }
};

Swear.prototype.then = function(resolveHandler) {
    this._thenHandler = resolveHandler;

    this._intermediateSwear = new Swear(function(resolve, reject) {
    });

    return this._intermediateSwear;
};

Swear.prototype.catch = function(rejectHandler) {
    this._catchHandler = rejectHandler;

    this._intermediateSwear = new Swear(function(resolve, reject) {
    });

    return this._intermediateSwear;
};

new Swear((resolve, reject) => {
    setTimeout(() => {
        console.log('foo');
        reject();
    }, 1000);
}).catch(() => {
    return new Swear((resolve, reject) => {
        setTimeout(() => {
            console.log('bar');
            resolve();
        }, 1000);
    });
}).then(() => {
    return new Swear((resolve, reject) => {
        setTimeout(() => {
            console.log('done');
            resolve();
        }, 1000);
    });
});
// }).catch(() => {
//     console.log('error caught');
// }).then(() => {
//     console.log('finally');
// });
