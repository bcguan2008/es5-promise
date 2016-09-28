var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var Promise = require('../src/promise.js');

describe('Test Promise',function(){
    it('Should have then function ',function(){
        var promise = new Promise(function(resolve,reject){
            resolve(222);
        })
        promise.should.have.property('then');
    });
 
    it('Test then',function(){
        var promise1 = new Promise().then();

        promise1.then();
    })

    it('Test resolve sync',function(){
        var promise = new Promise(function(resolve,reject){
            resolve(222);
        })
        promise.then(function(value){
            expect(value).to.be.equal(222);
        })
    })

    it('Test resolve async',function(done){
        var promise = new Promise(function(resolve,reject){
            setTimeout(function(){
                resolve(111);
                done()
            },10)
        })
        promise.then(function(value){
            expect(value).to.be.equal(111);
        })
    })

    it('Test reject sync',function(){
        var promise = new Promise(function(resolve,reject){
            reject(222);
        })

        promise.then(function(value){
        },function(reason){
            expect(reason).to.be.equal(222);
        })
    })

    it('Test reject async',function(done){
        var promise = new Promise(function(resolve,reject){
            setTimeout(function(){
                reject(222);
                done();
            })
        })

        promise.then(function(value){

        },function(reason){
            expect(reason).to.be.equal(222);
        })
    })


    describe('Test exception',function(){

        it('Test normal exception',function(){
            var promise = new Promise(function(resolve,reject){
                throw 'exception'
            });

            promise.then(function(value){
            },function(reason){
                expect(reason).to.be.equal('exception')
            })
            
        })

        it('Test onResolve exception',function(){
            var promise = new Promise(function(resolve,reject){
                resolve(100);
            }) 

            promise.then(function(value){
                throw 'exception'
            }).then(null,function(reason){
                expect(reason).to.be.equal('exception')
            })
        })

        it('Test onReject exception',function(){
            var promise = new Promise(function(resolve,reject){
                reject(100);
            }) 

            promise.then(null,function(value){
                throw 'exception'
            }).then(null,function(reason){
                expect(reason).to.be.equal('exception')
            })
        })

        it('Test onResolve exception with async',function(done){
            var promise = new Promise(function(resolve,reject){
                setTimeout(function(){
                    resolve(100);
                },10)
            }) 

            promise.then(function(value){
                throw 'exception'
            }).then(null,function(reason){
                expect(reason).to.be.equal('exception')
                done();
            })
        })

        it('Test onReject exception with async',function(done){
            var promise = new Promise(function(resolve,reject){
                setTimeout(function(){
                    reject(100);
                },10)
            }) 

            promise.then(null,function(value){
                throw 'exception'
            }).then(null,function(reason){
                expect(reason).to.be.equal('exception')
                done();
            })
        })
    })

})