var count = 1;
var container = document.getElementById('container');

function getUserAction() {
    console.log(this)
    container.innerHTML = count++;
};

// container.onmousemove = getUserAction;
//window.onresize=getUserAction;
//container.onmousemove=debounce4(getUserAction,1000,true);
container.onmousemove=throttle2(getUserAction,1000);

function debounce(func,wait){
    var timeoutID;
    console.log(timeoutID);
    return function(){//闭包，注意setTimeout的返回值
        clearTimeout(timeoutID);//在延时时间内又触发就会取消相应的定时器
        timeoutID =setTimeout(func,wait);
    }
}
//问题修复
//this指向问题修复
function debounce2(func,wait){
    var timeoutID;
    return function(){
        var context=this;
        clearTimeout(timeoutID);
        timeoutID=setTimeout(function(){
            func.apply(context);//使用apply指定this
        },wait);
    }
}
//event对象
function debounce3(func,wait){
    var timeoutID;
    return function(){
        var context=this;
        var args=arguments;//event对象
         
        clearTimeout(timeoutID);
        timeoutID=setTimeout(() => {
           func.apply(context,args); 
        }, timeout);
    }
}
//立即执行问题
//需求：我不希望非要等到事件停止触发后才执行，我希望立刻执行函数，
//然后等到停止触发 n 秒后，才可以重新触发执行。
function debounce4(func,wait,immediate){
    var timeoutID;

    return function(){
        var context=this;
        var args=arguments;

        if(timeoutID) clearTimeout(timeoutID);//
        
        if(immediate){//分两种选项：1、立即执行，停止触发ns后再复位可触发；2、延时ns不触发后再执行
            var callNOw=!timeoutID;//!undefined==true,!null==true
            
            timeoutID=setTimeout(() => {
                timeoutID=null;
            }, wait);//过了延时时间后再次将timeoutID设为null，就可以再次触发callNow
            if(callNOw){//立即执行
                console.log(timeoutID)
                func.apply(context,args);
            }
        }else{
           
            timeoutID=setTimeout(() => {
                func.apply(context,args);
            }, wait);
        }
    }

}
//var timeoutID=setTimeout(func,delay,param1,param2);

//节流，1、使用时间戳
//使用时间戳，当触发事件的时候，我们取出当前的时间戳，
//然后减去之前的时间戳(最一开始值设为 0 )，如果大于设置的时间
//周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就
//不执行。
function throttle(func,wait){//立即执行，最后不执行
    var context,args;
    var previous=0;

    return function(){
        var now=+new Date();
        context=this;
        args=arguments;
        if(now-previous>wait){
            func.apply(context,args);
            previous=now;
        }
    }

}

//使用定时器

//当触发事件的时候，我们设置一个定时器，再触发事件的时候，
//如果定时器存在，就不执行，直到定时器执行，然后执行函数，
//清空定时器，这样就可以设置下个定时器。
function throttle1(func,wait){//立即执行，最后不执行
    var timeoutID;
    var previous=0;

    return function(){
        context=this;
        args=arguments;
        if(!timeoutID){
            timeoutID=setTimeout(function(){
                timeoutID=null;
                //func.apply(context,args);
            },wait);
            func.apply(context,args);
        }
    }
}
function throttle2(func,wait){//ns后第一次执行，停止触发后会执行一次
    var timeoutID;
    var previous=0;

    return function(){
        context=this;
        args=arguments;
        if(!timeoutID){
            timeoutID=setTimeout(function(){
                timeoutID=null;
                func.apply(context,args);
            },wait);
        }
    }
}
function throttle3(func,wait){
    var timeoutID,context,args,result;
    var previous=0;

    var later=function(){
        prevous=+new Date();
        timeout=null;
        func.apply(context,args);
    };

    var throttled=function(){
        var now=+new Date();
        var remaining=wait-(now-previous);
        context=this;
        args=arguments;

        if(remaining<0||remaining>wait){//第一次触发一定是立即执行，now非常大，而previous=0
           //后面触发就要在wait时间间隔
            if(timeoutID){
                clearTimeout(timeoutID);
                timeoutID=null;
            }
            previous=now;
            console.log(now);
            func.apply(context,args);
        }else if(!timeoutID){
            timeoutID=setTimeout(later,remaining);
        }
    };
    return throttled;
}