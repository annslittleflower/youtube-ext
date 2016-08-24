var mastHead = document.getElementById('yt-masthead');
var myButton = document.createElement('button');
myButton.setAttribute('id', 'insertedButton');
myButton.innerText = 'Show added';
mastHead.appendChild(myButton);
var LS_HASH = 'ytlistman';
myButton.addEventListener('click', function(e){
    var ListItems = document.getElementsByClassName('channels-content-item');
    var listLength = ListItems.length;
    var playListItems = document.getElementsByClassName('yt-shelf-grid-item');
    var playCount = playListItems.length;
    var lsItems = ls_get_items();

    if(e.target.innerText == 'Show added'){
        if(location.href.indexOf('videos') > -1){
            for(var i = 0; i< listLength; i++){
                var itemId = ListItems[i].children[0].getAttribute('data-context-item-id');
                if(inArray(lsItems, itemId)){
                    ListItems[i].style.display = 'inline-block';
                }
                else{
                    ListItems[i].style.display = 'none';
                }
            }
        }
        if(location.href.indexOf("playlists") > -1){
            for(var i = 0; i< playCount; i++){
                if(playListItems[i].classList.contains('compact-shelf-view-all-card') == false){
                    console.log("classlist");
                    var itemId = playListItems[i].children[0].children[0].children[1]
                    .children[0].children[0].getAttribute('href')
                    .split('/playlist?list=')[1];

                    if(inArray(lsItems, itemId)){
                        if(playListItems[i].children[1].src.indexOf('openedEye')){
                            playListItems[i].children[1].src = closedEyeURL;
                        }
                        playListItems[i].style.display = 'inline-block';
                    }
                    else{
                        playListItems[i].style.display = 'none';
                    } 
                }
            }
        }
    
        e.target.innerText = 'Show all';
    }
    else{

        if(location.href.indexOf('videos') > -1){
            for(var i = 0; i< listLength; i++){
                    ListItems[i].style.display = 'inline-block';
            }
        }

        if(location.href.indexOf("playlists") > -1){
            for(var i = 0; i< playCount; i++){
                playListItems[i].style.display = 'inline-block';
            }
        }
        e.target.innerText = "Show added";
    }
});
// openedEye image
var openedEyeURL = chrome.extension.getURL('img/openedEye.jpg');

// closedEye image
var closedEyeURL = chrome.extension.getURL('img/closedEye.png');

///////////////////////////setting eyes buttons/////////////////

function havno(){
    myButton.innerText = 'Show added';
    var openedEye = document.createElement('img');
    openedEye.setAttribute('class', 'openedEye');
    var lsItems = ls_get_items();

    if(location.href.indexOf('videos') > -1){
        var videoListItems = document.getElementsByClassName('channels-content-item');
        var countItem = videoListItems.length;
        if(countItem > 0){
            for(var i = 0; i < countItem; i++){
                var temp = document
                .querySelectorAll('li.channels-content-item img.openedEye')[i];
                if(!temp){
                    var itemId = videoListItems[i].children[0].getAttribute('data-context-item-id');
                    if(inArray(lsItems, itemId)){
                        openedEye.setAttribute('src', closedEyeURL);
                        openedEye.setAttribute('title', 'Click to remove this video (or list)');
                        videoListItems[i].appendChild(openedEye.cloneNode());
                    }
                    else{
                        openedEye.setAttribute('src', openedEyeURL);
                        openedEye.setAttribute('title', 'Click to add this video (or list)');
                        videoListItems[i].appendChild(openedEye.cloneNode());
                    }
                }
            }
        }
        var openedEye = document.getElementsByClassName("openedEye");
        if (openedEye){
            for (var i = 0; i < openedEye.length; i++) {
                openedEye[i].addEventListener('click', eyeToggler);
            }
        }
    }

    if(location.href.indexOf("playlists") > -1){

        var playListItems = document.getElementsByClassName('yt-shelf-grid-item');
        var playCount = playListItems.length;

        for(var i = 0; i < playCount; i++){
            var temp2 = document
                .querySelectorAll('li.yt-shelf-grid-item  img.openedEye')[i];
            
            if(!temp2 && (playListItems[i].classList.contains('compact-shelf-view-all-card') == false)){

                var itemId = playListItems[i].children[0].children[0].children[1]
                    .children[0].children[0].getAttribute('href')
                    .split('/playlist?list=')[1];

                if(inArray(lsItems, itemId)){
                    openedEye.setAttribute('src', closedEyeURL);
                    openedEye.setAttribute('title', 'Click to remove this video (or list)');
                    playListItems[i].appendChild(openedEye.cloneNode());
                }
                else{
                    openedEye.setAttribute('src', openedEyeURL);
                    openedEye.setAttribute('title', 'Click to add this video (or list)');
                    playListItems[i].appendChild(openedEye.cloneNode());
                } 
            }
        }
        var openedEye = document.getElementsByClassName("openedEye");
        if (openedEye){
            for (var i = 0; i < openedEye.length; i++) {
                openedEye[i].addEventListener('click', eyeToggler);
            }
        }
    }

};

havno();

//////////toggling eyes and adding/removing data to localStorage /////////
function eyeToggler(e){

    if(e.target.src.indexOf('openedEye') > -1){
        console.log(JSON.stringify(localStorage).length);
        if(location.href.indexOf('videos') > -1){
            var addItem = e.target.parentNode.children[0]
                .getAttribute('data-context-item-id');
            if(ls_add(addItem)){
                successItem();
                e.target.title = 'Click to remove this video (or list)';
                e.target.src = closedEyeURL;
            }
        }
        if(location.href.indexOf("playlists") > -1){
            var href = e.target.parentNode.children[0].children[0].children[1]
                                   .children[0].children[0].getAttribute('href');
            var addItem = href.split('/playlist?list=')[1];
            if(ls_add(addItem)){
                successItem();
                e.target.title = 'Click to remove this video (or list)';
                e.target.src = closedEyeURL;
            }
        }
    }
    else{
        e.target.title = 'Click to add this video (or list)';
        e.target.src = openedEyeURL;
        if(location.href.indexOf('videos') > -1){
            var remItem = e.target.parentNode.children[0]
                .getAttribute('data-context-item-id');
            ls_remove(remItem);
        }
        if(location.href.indexOf("playlists") > -1){
            var href = e.target.parentNode.children[0].children[0].children[1]
                                   .children[0].children[0].getAttribute('href');
            var remItem = href.split('/playlist?list=')[1];
            ls_remove(remItem);
        }
        e.target.parentNode.style.display = 'none';
    }
}

////// checking for DOM change /////////////
var prev = document.getElementsByClassName('channels-content-item').length;
var supa = setTimeout(function tick(){
    var next = document.getElementsByClassName('channels-content-item').length;
    if (prev !=next){
        prev = next;
        havno();
    }
    supa = setTimeout(tick, 1500);
}, 1500);


//////// localStorage actions ///////

function ls_add(item){
    var confirmString = "Sorry, i ran out of memory :( Please, delete some videos or playlists that you don\`t need anymore to let me continue to serve you";
    try{
        localStorage.setItem(LS_HASH+item, '1');
        return true;
    } catch (e){
        if(e.code == 22){
             alert(confirmString);
             return;
        }
        else return;
    }
};

function ls_remove(item){
    localStorage.removeItem(LS_HASH+item);
};

function ls_get_items(){
    var items = [];
    var lsLen = localStorage.length;
    if(lsLen > 0){
        for(var i = 0; i < lsLen; i++){
            var key = localStorage.key(i);
            if(key.indexOf(LS_HASH) > -1){
                items.push(localStorage.key(i).slice(LS_HASH.length))
            }
        }
        return items;
    }
};

function inArray(ar, val){
    if(ar.indexOf(val) > -1){
        return true;
    }
    else {
        return false;
  }
}

function successItem(){
    var bar = document.createElement('div');
    bar.setAttribute('id', 'successBar');
    bar.innerText = 'Your item has been successfully added!';
    document.body.appendChild(bar);
    /*
    bar.addEventListener('click', function(){
        var elem = document.getElementById('successBar');
        elem.parentNode.removeChild(elem);
    });
    */
    var op = 1;
    var fadeTimer = setInterval(function(){
        if(op < 0.4){
            clearInterval(fadeTimer);
            bar.parentNode.removeChild(bar);
        }

        op = op - 0.03;
        bar.style.opacity = op;
    }, 140)
}
