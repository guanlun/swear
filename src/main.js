function Swear(worker) {
    setTimeout(function() {
        worker(this.onSuccessCallback.bind(this));
    }.bind(this), 0);
}

Swear.prototype.onSuccessCallback = function() {
    if (this._thenHandler) {
        var userSwear = this._thenHandler();

        if (userSwear) {
            userSwear.onSuccessCallback = function() {
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
}

new Promise(function(resolve, reject) {
    setTimeout(function() {
        console.log('foo');
        resolve();
    }, 1000);
}).then(function() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            console.log('bar');
            resolve();
        }, 500);
    });
}).then(function() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            console.log('done');
            resolve();
        }, 1000);
    });
}).then(function() {
    setTimeout(function() {
        console.log('finally');
    }, 1000);
});
