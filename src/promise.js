var STATUS_PENDING = 0,
    STATUS_RESOLVED = 1,
    STATUS_REJECTED = 2;

function Promise (executor){
    var self = this ;
    this.status = STATUS_PENDING;
    this.data = undefined;

    /**
     * Array for async call 
     */
    this.onResolvedCallback = [];
    this.onRejectedCallback = [];
    

    function resolve(value){
        if(self.status === STATUS_PENDING){
            self.status = STATUS_RESOLVED;
            self.data = value;
            for(var i = 0; i < self.onResolvedCallback.length; i++){
                self.onResolvedCallback[i](value);
            }
        }
    }

    function reject(reason){
        if(self.status === STATUS_PENDING){
            self.status = STATUS_REJECTED;
            self.data = reason;
            for(var i = 0; i < self.onRejectedCallback.length; i++){
                self.onRejectedCallback[i](reason);
            }
        }        
    }

    try{
        executor(resolve,reject);
    }
    catch(e){
        reject(e);
    }
} 

Promise.prototype.then = function(onResolved, onRejected){
    var self = this, newPromise;
    onResolved = ((onResolved && typeof onResolved === 'function') ? onResolved:function(value){});
    onRejected = ((onRejected && typeof onRejected === 'function') ? onRejected:function(reson){});
    if(self.status === STATUS_RESOLVED){
        return newPromise = new Promise(function(resolve,reject){
            try{
                var x = onResolved(self.data);
                resolve(x);
            }
            catch(e){
                reject(e);
            }
        });
    }

    if(self.status === STATUS_REJECTED){
        return newPromise = new Promise(function(resolve,reject){
            try{
                var x = onRejected(self.data)
                resolve(x);
            }
            catch(e){
                reject(e);
            }
        });
    }

    if(self.status === STATUS_PENDING){
        return newPromise = new Promise(function(resolve,reject){
            self.onResolvedCallback.push(function(value){
                try{
                    var x = onResolved(self.data);
                    resolve(x);
                }
                catch(e){
                    reject(e);
                }
            });

            self.onRejectedCallback.push(function(value){
                try{
                    var x = onRejected(self.data);
                    resolve(x);
                }
                catch(e){
                    reject(e);
                }
            });
        });
    }
}
module.exports = Promise;