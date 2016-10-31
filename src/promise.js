var STATUS_PENDING = 0,
    STATUS_RESOLVED = 1,
    STATUS_REJECTED = 2;

function thenable(value){
    return value instanceof Promise;
}

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
        if(thenable(value)){
            return value.then(resolve,reject);
        }

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

function resolvePromise(promise,x,resolve,reject){
    var then , thenCalledOrThrow = false;

    if(promise === x){
        return reject(new TypeError('Chaining cycle detected for promise!'))
    }

    if(x instanceof Promise){
        if(x.status === 'pending'){
            x.then(function(value){
                resolvePromise(promise,value,resolve,reject);
            })
        }
        else{
            x.then(resolve,reject);
        }
        return;
    }

    resolve(x);

}

Promise.prototype.then = function(onResolved, onRejected){
    var self = this, newPromise;
    onResolved = ((onResolved && typeof onResolved === 'function') ? onResolved:function(value){});
    onRejected = ((onRejected && typeof onRejected === 'function') ? onRejected:function(reson){});
    if(self.status === STATUS_RESOLVED){
        return newPromise = new Promise(function(resolve,reject){
            try{
                var x = onResolved(self.data);
                
                resolvePromise(newPromise,x,resolve,reject);
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
                //resolve(x);
                resolvePromise(newPromise,x,resolve,reject);
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
                    resolvePromise(newPromise,x,resolve,reject);
                    //resolve(x);
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

Promise.resolve = function(value){
    return new Promise(function(resolve){
        resolve(value);
    })
}

Promise.reject = function(value){
    return new Promise(function(reject){
        reject(value);
    })
}

Promise.all = function(executors){
    return new Promise(function(resolve,reject){
        var resolvedCounter = 0;
        var promiseCount = executors.length ;
        var resolvedValues = new Array(promiseCount);
        for(var i =0; i<promiseCount;i++){
            (function(i){
                Promise.resolve(executors[i]).then(function(value){
                    debugger;
                    resolvedCounter ++ ;
                    resolvedValues[i] = value;
                    if(resolvedCounter == promiseCount){
                        return resolve(resolvedValues);
                    }
                },function(reason){
                    return reject(reason)
                })
            })(i)
        }
    })
}

/**
var promise = new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve({
            a:1
        });
    },1000)
}) 

var promise1 = promise.then(function(value){
    return {
        a:1,
        b:2
    }
});

promise1.then(function(value){
    console.log(value);
})

*/
var p2 = new Promise((resolve,reject)=>{
    setTimeout(resolve,3000,1337)
})


Promise.all([p2]).then(values => { 
  console.log(values); // [3, 1337, "foo"] 
});

module.exports = Promise;