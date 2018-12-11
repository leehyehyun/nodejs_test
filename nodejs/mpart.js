var M = {
    v:'v',
    f:function(){
        console.log(this.v);
    }
}

module.exports = M; // 함수를 모듈화해서 외부에서 사용할 수 있게 export 한다.