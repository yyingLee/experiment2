// 播放按钮
var playPause = document.getElementsByClassName('playPause')[0];
var audio = document.getElementById('audioTag');
var body = document.body;
var recordImg = document.getElementById('record-img');
// 上一首下一首
var beforeMusic=document.getElementsByClassName('beforMusic')[0];
var nextMusic = document.getElementsByClassName('nextMusic')[0];
// 歌曲名字
var musicTitle = document.getElementsByClassName('music-title')[0];
var authorName = document.getElementsByClassName('author-name')[0];
// 播放时间
var playTime = document.getElementsByClassName('played-time')[0];
var totalTime = document.getElementsByClassName('audio-time')[0];
var progressPlay = document.getElementsByClassName('progress-play')[0];

//播放模式
var playMode = document.getElementsByClassName('playMode')[0];
// 音量
var volume = document.getElementsByClassName('volumn')[0];
var volumeTogger = document.getElementById('volumn-togger');
// 倍速
var speed = document.getElementById('speed');
// 列表
var closeContainer = document.getElementsByClassName('close-container')[0];
var listContainer = document.getElementsByClassName('list-container')[0];
var listIcon = document.getElementById('list');
// 音乐列表
var musicLists = document.getElementsByClassName('musicLists')[0];
// 歌曲名数组
var musicData = [
    ['洛春赋','25216950604李钰滢'],
    ['李钰滢','Alok/Sofi Tukker'],
    ['李钰滢','25216950604'],
    ['Vision pt.II','Vicetone'],
];

var musicId=0;
// 初始化这些音乐
function initMusic(){
    audio.src=`./mp3/music${musicId}.mp3`;
    // audio.src=`./mp3/music0.mp3`;
    audio.load();
    recordImg.classList.remove('rotate-play');
    // 当音乐的元数据完成加载时触发下面这个函数
    audio.onloadedmetadata = function(){
        recordImg.style.backgroundImage=`url('img/record${musicId}.jpg')`;
        body.style.backgroundImage=`url('img/bg${musicId}.png')`;
        musicTitle.innerText = musicData[musicId][0];
        authorName.innerText = musicData[musicId][1];
        totalTime.innerText = formatTime(audio.duration);
        audio.currentTime=0;
        refreshRotate();
    };
}
initMusic();
// 初始化并自动播放
function initAndPlay(){
    initMusic();
    rotateRecord();
    audio.play();
    playPause.classList.remove('icon-play');
    playPause.classList.add('icon-pause');
}
// 点击播放按钮
playPause.addEventListener('click',function(){
    if(audio.paused){
        audio.play();
        rotateRecord();
        playPause.classList.remove('icon-play');
        playPause.classList.add('icon-pause');
    }
    else{
        audio.pause();
        rotateRecordStop();
        playPause.classList.remove('icon-pause');
        playPause.classList.add('icon-play');
    }
});

// 让唱片旋转
function rotateRecord(){
    recordImg.style.animationPlayState = `running`;
}

// 停止唱片旋转
function rotateRecordStop(){
    recordImg.style.animationPlayState = `paused`;
}
// 刷新旋转角度
function refreshRotate(){
    recordImg.classList.add(`rotate-play`);
}
nextMusic.addEventListener('click',function(){
    musicId++;
    if(musicId>=musicData.length){
        musicId=0;
    }
    initAndPlay();
});
beforeMusic.addEventListener('click',function(){
    musicId--;
    if(musicId<0){
        musicId=musicData.length-1;
    }
    // this;
    initAndPlay();
});

// 时间格式化
function formatTime(value){
    var hours = parseInt(value/3600);
    var minutes = parseInt((value%3600)/60);
    var seconds = parseInt(value%60);
    if(hours>0){
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }
    return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

audio.addEventListener('timeupdate',updateProgress);
// 音乐进度更新
function updateProgress(){
    playTime.innerText = formatTime(audio.currentTime);
    var value = audio.currentTime/audio.duration;
    progressPlay.style.width = value*100 + '%';
}


//音乐模式
var modeID=1;
playMode.addEventListener('click',function(){
    modeID++;
    if(modeID>3){
        modeID=1;
    }
    playMode.style.backgroundImage = `url('img/mode${modeID}.png')`;
});

//当音乐播放完
audio.addEventListener('ended',function(){
    if(modeID==2){
        musicId=(musicId+1) % musicData.length;
    }
    else if(modeID==3){
        // Math.random()是在[0,1]生成一个小数
        var oldID = musicId;
        while(true){
            musicId = Math.floor(Math.random()*musicData.length);
            if(musicId!=oldID){
                break;
            }
    }
}
    initAndPlay();
});

// 记录上一次的音量
var lastVolume = 70;
audio.volume = lastVolume/100;
// 音量控制
volume.addEventListener('click',setVolume);
function setVolume(){
    if(audio.muted || audio.volume===0){
        audio.muted = false;
        volumeTogger.value = lastVolume;
        audio.volume = lastVolume/100;
    }
    else{
        audio.muted = true;
        lastVolume = volumeTogger.value;
        volumeTogger.value = 0;
    }
    updateVolumeIcon();
}

volumeTogger.addEventListener('input',updateVolume);
// 音量滑动条
function updateVolume(){
    const volumeValue = volumeTogger.value / 100;
    audio.volume = volumeValue;
    lastVolume = volumeTogger.value; // 同步更新最后音量
    if(volumeValue > 0){
        audio.muted = false;
    }
    updateVolumeIcon();
}
    

// 更新音量图标的函数
function updateVolumeIcon(){
    if(audio.muted || audio.volume==0){
        volume.style.backgroundImage = `url('img/静音.png')`;
    }
    else{
        volume.style.backgroundImage = `url('img/音量.png')`;
    }
}

// 倍速
speed.addEventListener('click',function(){
    var speedText = speed.innerText;
    if(speedText=='1.0X'){
        speed.innerText = '1.5X';
        audio.playbackRate = 1.5;
    }
    else if(speedText=='1.5X'){
        speed.innerText = '2.0X';
        audio.playbackRate = 2.0;
    }
    else if(speedText=='2.0X'){
        speed.innerText = '0.5X';
        audio.playbackRate = 0.5;
    }
    else if(speedText=='0.5X'){
        speed.innerText = '1.0X';
        audio.playbackRate = 1.0;
    }
});

// 列表
listIcon.addEventListener('click',function(){
    listContainer.classList.remove('list-hide');
    listContainer.classList.add('list-show');
    closeContainer.style.display = 'block';
    listContainer.style.display = 'block';
});
closeContainer.addEventListener('click',function(){
    listContainer.classList.remove('list-show');
    listContainer.classList.add('list-hide');
    closeContainer.style.display = 'none';
    // listContainer.style.display = 'none';

});

// 自动生成音乐列表
function createMusic(){
    for(let i = 0; i < musicData.length; i++){
        // 生成一个div
        let div = document.createElement('div');
        div.innerText = `${musicData[i][0]}`;
        musicLists.appendChild(div);
        div.addEventListener('click',function(){
            musicId = i;
            initAndPlay();
        });
    }
}
document.addEventListener('DOMContentLoaded',createMusic);

