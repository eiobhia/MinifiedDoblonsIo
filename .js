var targetFPS=60,delta,delta2,currentTime,oldTime=0,gameData,socket,port;
Math.lerp=function(b,a,c){
    c=0>c?0:c;
    return b+(a-b)*(1<c?1:c)
}
Math.lerpAngle=function(b,a,c){
    Math.abs(a-b)>Math.PI&&(b>a?a+=2*Math.PI:b+=2*Math.PI);
    return a+(b-a)*c
}
Number.prototype.round=function(b){return+this.toFixed(b)}
CanvasRenderingContext2D.prototype.roundRect=function(b,a,c,d,f,h){
    h=h||1;
    c<2*f&&(f=c/2);
    d<2*f&&(f=d/2);
    this.beginPath();
    this.moveTo(b+f,a);
    this.arcTo(b+c*h,a,b+c*h,a+d,f);
    this.arcTo(b+c,a+d,b,a+d,f);
    this.arcTo(b,a+d,b,a,f);
    this.arcTo(b*(1==h?h:1.2*h),a,b+c*h,a,f);
    this.closePath();
    return this
}
var MathPI = Math.PI
  , MathCOS = Math.cos
  , MathSIN = Math.sin
  , MathABS = Math.abs
  , MathPOW = Math.pow
  , MathMIN = Math.min
  , MathMAX = Math.max
  , MathATAN2 = Math.atan2
  , mainCanvas = document.getElementById("mainCanvas")
  , mainContext = mainCanvas.getContext("2d")
  , gameUiContainer = document.getElementById("gameUiContainer")
  , userInfoContainer = document.getElementById("userInfoContainer")
  , loadingContainer = document.getElementById("loadingContainer")
  , enterGameButton = document.getElementById("enterGameButton")
  , userNameInput = document.getElementById("userNameInput")
  , menuContainer = document.getElementById("menuContainer")
  , darkener = document.getElementById("darkener")
  , linksContainer = document.getElementById("linksContainer")
  , leaderboardList = document.getElementById("leaderboardList")
  , followText = document.getElementById("followText")
  , lobbyKey = document.getElementById("lobbyKey")
  , lobbyKeyText = document.getElementById("lobbyKeyText")
  , upgradeContainer = document.getElementById("upgradeContainer")
  , coinDisplay = document.getElementById("coinDisplay")
  , upgradeList = document.getElementById("upgradeList")
  , scoreContainer = document.getElementById("scoreContainer")
  , className = document.getElementById("className")
  , minimap = document.getElementById("minimap")
  , minimapContext = minimap.getContext("2d")
  , weaponsProgress = document.getElementById("weaponsProgress")
  , wpnsProgressBar = document.getElementById("wpnsProgressBar")
  , weaponsList = document.getElementById("weaponsList")
  , weaponsPopups = document.getElementById("weaponsPopups")
  , upgradesInfo = document.getElementById("upgradesInfo")
  , skinInfo = document.getElementById("skinInfo")
  , skinSelector = document.getElementById("skinSelector")
  , skinName = document.getElementById("skinName")
  , skinIcon = document.getElementById("skinIcon")
  , controlsButton = document.getElementById("controlsButton")
  , modeSelector = document.getElementById("modeSelector")
  , modeListView = document.getElementById("modeListView")
  , timeDisplay = document.getElementById("timeDisplay")
  , wpnsProgressTxt = document.getElementById("wpnsProgressTxt")
  , adHolderDiv = document.getElementById("adHolderDiv")
  , randomLoadingTexts = ["discovering treasure...", "setting sail..."]
  , upgrInputsToIndex = {
    k48: 9,
    k49: 0,
    k50: 1,
    k51: 2,
    k52: 3,
    k53: 4,
    k54: 5,
    k55: 6,
    k56: 7,
    k57: 8,
    k84: 10,
    k89: 11
}
  , upgrInputsToKey = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "T", "Y"]
  , keys = {
    l: 0,
    r: 0,
    u: 0,
    d: 0
};
function resetKeys(){keys.l=0;keys.r=0}
var hasStorage="undefined"!==typeof Storage;
if(hasStorage){
    var cid=localStorage.getItem("sckt");
    cid||(cid=UTILS.getUniqueID(),
    localStorage.setItem("sckt",cid))
}
var partyKey = null
  , player = null
  , modeList = null
  , modeIndex = null
  , currentMode = null
  , dayTimeValue = 0
  , users = []
  , gameObjects = []
  , target = 0
  , targetD = 1
  , turnDir = 0
  , speedInc = 0
  , mTarget = 0
  , controlIndex = 0;
if(hasStorage){
    var contIndx=localStorage.getItem("contrlSt");
    contIndx&&(controlIndex=contIndx)
}
var controlShemes=[{
    id:1,name:"<i style='vertical-align: middle;' class='material-icons'>&#xE312;</i> Keyboard & Mouse"
},{
    id:2,name:"<i style='vertical-align: middle;' class='material-icons'>&#xE323;</i> Mouse Only"
}];
function setControlSheme(b){
    controlsButton.innerHTML=controlShemes[b].name;
    localStorage.setItem("contrlSt",b);
    socket.emit("6","cont",b)
}
function toggleControls(){
    controlIndex++;
    controlIndex>=controlShemes.length&&(controlIndex=0);
    setControlSheme(controlIndex)
}
var viewMult = 1, maxScreenWidth = 2208, maxScreenHeight = 1242, originalScreenWidth = maxScreenWidth, originalScreenHeight = maxScreenHeight, screenWidth, screenHeight, darkColor = "#4d4d4d";
function getURLParam(b, a) {
    a || (a = location.href);
    b = b.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var c = (new RegExp("[\\?&]" + b + "=([^&#]*)")).exec(a);
    return null == c ? null : c[1]
}
var lobbyURLIP = getURLParam("l"), lobbyRoomID;
if (lobbyURLIP) {
    var tmpL = lobbyURLIP.split("-")
      , lobbyURLIP = tmpL[0];
    lobbyRoomID = tmpL[1]
}
onload=function() {
    enterGameButton.onclick=function(){
        setTimeout(factorem.refreshAds.bind(factorem,null,!0),10);
        enterGame()
    }
    userNameInput.onkeypress=b=>13==(b.which||b.keyCode)&&enterGame();
    $.get("/getIP", {
        sip: lobbyURLIP
    }, function(b) {
        port = b.port;
        socket || (socket = io.connect("http://" + b.ip + ":" + b.port, {
            query: "cid=" + cid + "&rmid=" + lobbyRoomID + "&apid=19ytahhsb"
        }),
        setupSocket())
    })
}
;
mainCanvas.addEventListener("mousemove", gameInput, !1);
mainCanvas.addEventListener("mousedown", mouseDown, !1);
mainCanvas.addEventListener("mouseup", mouseUp, !1);
var mouseX, mouseY, forceTarget = !0;
function gameInput(b) {
    b.preventDefault();
    b.stopPropagation();
    mouseX = b.clientX;
    mouseY = b.clientY;
    sendTarget(forceTarget);
    forceTarget = !1
}
function mouseDown(b) {
    b.preventDefault();
    b.stopPropagation();
    socket.emit("2", 1)
}
function mouseUp(b) {
    b.preventDefault();
    b.stopPropagation();
    socket && player && !player.dead && socket.emit("2")
}
var shooting = !1;
onkeyup=function(b){
    b=b.keyCode?b.keyCode:b.which;
    if(socket&&player&&!player.dead){
        void 0 != upgrInputsToIndex["k" + b] && doUpgrade(upgrInputsToIndex["k" + b], 0, 1);
        32 == b && (shooting = !1,
        socket.emit("2"));
        if (65 == b || 37 == b)
            keys.l = 0,
            sendMoveTarget();
        if (68 == b || 39 == b)
            keys.r = 0,
            sendMoveTarget();
        if (87 == b || 38 == b)
            keys.u = 0,
            sendMoveTarget();
        if (83 == b || 40 == b)
            keys.d = 0,
            sendMoveTarget();
        69 == b && socket.emit("as");
        70 == b && socket.emit("5")
    }
}
onkeydown = function(b) {
    b = b.keyCode ? b.keyCode : b.which;
    socket && player && !player.dead && (shooting || 32 != b || (shooting = !0,
    socket.emit("2", 1)),
    65 != b && 37 != b || keys.l || (keys.l = 1,
    keys.r = 0,
    turnDir = -1,
    sendMoveTarget()),
    68 != b && 39 != b || keys.r || (keys.r = -1,
    keys.l = 0,
    turnDir = 1,
    sendMoveTarget()),
    87 != b && 38 != b || keys.u || (keys.u = 1,
    keys.d = 0,
    speedInc = 1,
    sendMoveTarget()),
    83 != b && 40 != b || keys.d || (keys.d = 1,
    keys.u = 0,
    speedInc = -1,
    sendMoveTarget()))
}
;
function setupSocket(){
    socket.on("connect_error",()=>lobbyURLIP?kickPlayer("Connection failed. Please check your lobby ID"):kickPlayer("Connection failed. Check your internet and firewall settings"));
    socket.on("disconnect",a=>{kickPlayer("Disconnected.");console.log("Send this to the dev: "+a)});
    socket.on("kick",a=>kickPlayer(a));
    socket.on("lk",a=>partyKey=a);
    socket.on("mds", function(a, b) {
        modeList = a;
        modeSelector.innerHTML = a[b].name + "  <i style='vertical-align: middle;' class='material-icons'>&#xE5C5;</i>";
        modeIndex = b;
        currentMode = modeList[b]
    });
    socket.on("v", function(a, b, f) {
        viewMult != f && (viewMult = f,
        maxScreenWidth = Math.round(a * f),
        maxScreenHeight = Math.round(b * f),
        resize())
    });
    socket.on("spawn", function(a, b) {
        objectExists(a) ? updateOrPushUser(a) : users.push(a);
        player = a;
        toggleMenuUI(!1);
        toggleGameUI(!0);
        if (b) {
            gameData = b;
            for (var d = gameObjects.length = 0; d < b.objCount; ++d)
                gameObjects.push({})
        }
        targetD = 1;
        resetKeys()
    });
    socket.on("d", function(a) {
        a = getPlayerIndexById(a);
        null != a && users.splice(a, 1)
    });
    socket.on("dnt",(a,b)=>{timeDisplay.innerHTML=a;dayTimeValue=b});
    socket.on("0", function(a) {
        for (var b = "", f = 1, c, e = 0; e < a.length; )
            c = "",
            currentMode && currentMode.teams && player && a[e] != player.sid && (c = "color:" + userSkins[a[e + 3]].color1),
            b += "<div class='leaderboardItem'><div style='display:inline-block;float:left;' class='whiteText'>" + f + ".</div> <div class='" + (player && a[e] == player.sid ? "leaderYou" : "leader") + "' style='" + c + "'>" + a[e + 1] + "</div><div class='leaderboardLapsNum'>" + a[e + 2] + "</div></div>",
            e += 4,
            f++;
        leaderboardList.innerHTML = b
    });
    socket.on("1", function(a, b) {
        if (a)
            a.visible = !0,
            updateOrPushUser(a);
        else if (b) {
            for (var d = Date.now(), c = 0; c < users.length; ++c)
                users[c].visible || (users[c].forcePos = 1),
                users[c].visible = !1;
            for (var e, c = 0; c < b.length; )
                e = getPlayerIndex(b[c]),
                null != e && (users[e].t1 = void 0 != users[e].t2 ? users[e].t2 : d,
                users[e].t2 = d,
                users[e].x2 = void 0 != users[e].x ? users[e].x : b[c + 1],
                users[e].y2 = void 0 != users[e].y ? users[e].y : b[c + 2],
                users[e].x = b[c + 1],
                users[e].y = b[c + 2],
                users[e].dir = b[c + 3],
                users[e].targetDir = b[c + 4],
                users[e].aimDir = b[c + 5],
                users[e].visible = !0),
                c += 6
        }
    });
    socket.on("2", function(a, b, f, h) {
        if (f) {
            a = "<div class='upgradeSubHeader'>Upgrades " + a + "</div></br>";
            for (var c = 1, d = 0; d < f.length; ) {
                var k = (f[d + 2] - 1) / (f[d + 3] - 1) * 150;
                9 == c && (a += "<div class='upgradeSubHeader'>Fleet " + b + "</div></br>");
                a += "<div class='upgradeItem' onclick='doUpgrade(" + (c - 1) + ",0,1)'><div class='upgrProg' style='width:" + k + "px'></div>" + f[d] + " <span class='greyMenuText'>" + (f[d + 2] != f[d + 3] ? "$" + f[d + 1] : "max") + "</span></div><span class='upgrIndx'>" + upgrInputsToKey[c - 1] + "</span></br>";
                d += 4;
                c++
            }
            upgradeList.innerHTML = a;
            upgradeContainer.style.display = "inline-block"
        }
        void 0 != h && (coinDisplay.innerHTML = "coins <span class='greyMenuText'>$" + (h || 0) + "</span>")
    });
    socket.on("8", function(a, b, f) {
        if (a || void 0 != b || void 0 != f) {
            if (!b)
                weaponsProgress.style.display = "inline-block",
                weaponsList.style.display = "none",
                weaponsPopups.style.display = "none",
                upgradesInfo.style.display = "none";
            else if (a) {
                weaponsProgress.style.display = "none";
                weaponsList.style.display = "block";
                weaponsPopups.style.display = "block";
                for (var d = "", c = "", g = 0, k = 0; k < a.length; ) {
                    for (var d = d + ("<div onclick='showWeaponPopup(" + g + ")' class='weaponItem'><div class='upgradeTxt'>" + a[k] + "</div><div class='upgradeNum'>Tier " + a[k + 1] + "</div></div>"), c = c + ("<div id='popupRow" + g + "' class='weaponPopupRow'>"), m = 0; m < a[k + 2].length; ++m)
                        c += "<div onclick='doUpgrade(" + m + "," + g + ")' class='weaponPopupItem' style='bottom:" + 32 * m + "px'>" + a[k + 2][m] + "</div>";
                    c += "</div>";
                    k += 3;
                    g++
                }
                weaponsList.innerHTML = d;
                weaponsPopups.innerHTML = c
            }
            void 0 != f && (wpnsProgressBar.style.width = 277 * f + "px",
            wpnsProgressTxt.innerHTML = Math.round(100 * f) + "%");
            b && (upgradesInfo.style.display = "inline-block",
            upgradesInfo.innerHTML = "Items (" + b + ")")
        } else
            weaponsProgress.style.display = "none",
            weaponsList.style.display = "none",
            weaponsPopups.style.display = "none",
            upgradesInfo.style.display = "none"
    });
    socket.on("3", function(a, b) {
        var c = getPlayerIndex(a);
        if (null != c)
            for (var c = users[c], d = 0; d < b.length; )
                c[b[d]] = b[d + 1],
                d += 2
    });
    var b;
    socket.on("4", function(a, d) {
        if (b = gameObjects[a])
            d ? (b.x = d[0],
            b.xS = d[1],
            b.y = d[2],
            b.yS = d[3],
            b.s = d[4],
            b.c = d[5],
            b.shp = d[6],
            b.active = !0) : b.active = !1
    });
    socket.on("5", function(a, b) {
        var c = getPlayerIndex(a);
        null!=c&&(c=users[c],c.animMults||(c.animMults=[{mult:1},{mult:1},{mult:1},{mult:1}]),
        c.animMults[b].plus = -.03)
    });
    socket.on("6", function(a, b) {
        var c = getPlayerIndex(a);
        null != c && (c = users[c],
        c.health = b,
        0 >= c.health && (c.dead = !0,
        player && a == player.sid && (player.dead = 0 >= b,
        player.dead && (hideMainMenuText(),
        leaveGame()))))
    });
    socket.on("7",a=>scoreContainer.innerHTML="score <span class='greyMenuText'>"+a+"</span>");
    socket.on("n",a=>showNotification(a));
    socket.on("s",a=>showScoreNotif(a));
    var a = "#fff #fff #ff6363 #ff6363 rgba(103,255,62,0.2) rgba(255,255,255,0.3) #63b0ff rgba(255,242,99,0.3)".split(" ");
    socket.on("m", function(b) {
        minimap.width = minimap.width;
        for (var c = 0; c < b.length; )
            minimapContext.fillStyle = a[b[c]],
            minimapContext.font = "10px regularF",
            minimapContext.beginPath(),
            minimapContext.arc((b[c + 1] + gameData.mapScale) / (2 * gameData.mapScale) * minimap.width, (b[c + 2] + gameData.mapScale) / (2 * gameData.mapScale) * minimap.height, 2 * b[c + 3], 0, 2 * MathPI, !0),
            minimapContext.closePath(),
            minimapContext.fill(),
            c += 4
    });
    setControlSheme(controlIndex)
}
function showModeList() {
    if (modeList)
        if ("block" == modeListView.style.display)
            modeListView.style.display = "none";
        else {
            for (var b = "", a = 0; a < modeList.length; ++a)
                b += "<div onclick='changeMode(" + a + ")' class='modeListItem'>" + modeList[a].name + "</div>";
            modeListView.style.display = "block";
            modeListView.innerHTML = b
        }
}
function changeMode(b) {
    modeList && modeList[b] && b !== modeIndex && (modeListView.style.display = "none",
    modeSelector.innerHTML = modeList[b].name + "<i style='vertical-align: middle;' class='material-icons'>&#xE5C5;</i>",
    window.location.href = modeList[b].url)
}
function loadPartyKey() {
    partyKey && (window.history.pushState("", "Doblons.io", "/?l=" + partyKey),
    lobbyKeyText.innerHTML = "send the url above to a friend",
    lobbyKey.className = "deadLink")
}
hasStorage && localStorage.getItem("lstnmdbl") && (userNameInput.value = localStorage.getItem("lstnmdbl"));
function enterGame() {
    socket && (showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 1)]),
    socket.emit("respawn", {
        name: userNameInput.value,
        skin: skinIndex
    }),
    localStorage.setItem("lstnmdbl", userNameInput.value))
}
function leaveGame(){toggleGameUI(!1);toggleMenuUI(!0)}
function doUpgrade(b,a,c){socket.emit("3",b,a,c)}
var activePopup;
function showWeaponPopup(b) {
    for (var a = 0; 4 > a; a++) {
        var c = document.getElementById("popupRow" + a);
        c && (c.style.visibility = a != b || "visible" == c.style.visibility ? "hidden" : "visible")
    }
}
var playerCanvas = document.createElement("canvas")
  , playerCanvasScale = 430
  , maxFlashAlpha = .25;
playerCanvas.width = playerCanvas.height = playerCanvasScale;
var skinIndex = 0;
hasStorage && (skinIndex = parseInt(localStorage.getItem("sknInx")) || 0);
var userSkins = [{
    name: "Default",
    color1: "#eb6d6d",
    color2: "#949494"
}, {
    name: "Purple",
    color1: "#b96bed",
    color2: "#949494"
}, {
    name: "Green",
    color1: "#6FED6B",
    color2: "#949494"
}, {
    name: "Orange",
    color1: "#EDB76B",
    color2: "#949494"
}, {
    name: "Black",
    color1: "#696969",
    color2: "#949494"
}, {
    name: "Navy",
    color1: "#adadad",
    color2: "#949494"
}, {
    name: "Ghostly",
    color1: "#9BEB6D",
    color2: "#949494",
    opacity: .7,
    overlay: "rgba(0,255,0,0.3)"
}, {
    name: "Glass",
    color1: "#6DEBDE",
    color2: "#949494",
    opacity: .6,
    overlay: "rgba(0,0,255,0.3)"
}, {
    name: "Pirate",
    color1: "#5E5E5E",
    color2: "#737373"
}, {
    name: "Sketch",
    color1: "#E8E8E8",
    color2: "#E8E8E8"
}, {
    name: "Gold",
    color1: "#e9cd5f",
    color2: "#949494"
}, {
    name: "Hazard",
    color1: "#737373",
    color2: "#e9cd5f"
}, {
    name: "Apples",
    color1: "#91DB30",
    color2: "#eb6d6d"
}, {
    name: "Beach",
    color1: "#eac086",
    color2: "#FFD57D"
}, {
    name: "Wood",
    color1: "#8c5d20",
    color2: "#949494"
}, {
    name: "Diamond",
    color1: "#6FE8E2",
    color2: "#EDEDED"
}, {
    name: "Midnight",
    color1: "#5E5E5E",
    color2: "#A763BA"
}, {
    name: "Valentine",
    color1: "#FE4998",
    color2: "#F9A7FE"
}, {
    name: "Cheddar",
    color1: "#FCA403",
    color2: "#FDFC08"
}, {
    name: "Crimson",
    color1: "#6B3333",
    color2: "#AD3E3E"
}, {
    name: "Banana",
    color1: "#fbf079",
    color2: "#f9f9f9"
}, {
    name: "Cherry",
    color1: "#F8E0F7",
    color2: "#F5A9F2"
}, {
    name: "Moon",
    color1: "#1C1C1C",
    color2: "#F2F5A9"
}, {
    name: "Master",
    color1: "#fce525",
    color2: "#bb5e0e"
}, {
    name: "Reddit",
    color1: "#fe562d",
    color2: "#f9f9f9"
}, {
    name: "4Chan",
    color1: "#ffd3b4",
    color2: "#3c8d2e"
}, {
    name: "Necron",
    color1: "#808080",
    color2: "#80ff80"
}, {
    name: "Ambient",
    color1: "#626262",
    color2: "#80ffff"
}, {
    name: "Uranium",
    color1: "#5a9452",
    color2: "#80ff80"
}, {
    name: "XPlode",
    color1: "#fe4c00",
    color2: "#f8bf00"
}, {
    name: "\u5de7\u514b\u529b",
    color1: "#804029",
    color2: "#f9ebb4"
}]
  , renderedSkins = []
  , skinDisplayIconSize = 200;
function changeSkin(b) {
    skinIndex += b;
    skinIndex >= userSkins.length ? skinIndex = 0 : 0 > skinIndex && (skinIndex = userSkins.length - 1);
    if (!renderedSkins[skinIndex]) {
        b = document.createElement("canvas");
        b.width = b.height = skinDisplayIconSize;
        var a = b.getContext("2d");
        a.translate(b.width / 2, b.height / 2);
        a.lineJoin = "round";
        renderPlayer(a, {
            dir: MathPI,
            width: 60,
            length: 125,
            rearLength: 25,
            noseLength: 35,
            cannonLength: 18,
            cannonWidth: 28,
            cannons: 1
        }, 0, 0, userSkins[skinIndex]);
        renderedSkins[skinIndex] = b.toDataURL()
    }
    skinIcon.src = renderedSkins[skinIndex];
    skinName.innerHTML = userSkins[skinIndex].name;
    hasStorage && localStorage.setItem("sknInx", skinIndex)
}
changeSkin(0);
$("#skinSelector").bind("contextmenu", function(b) {
    changeSkin(-1);
    return !1
});
hasStorage && localStorage.getItem("isFollDob") && unlockSkins(0);
function unlockSkins(b) {
    b || (skinInfo.style.display = "inline-block",
    skinSelector.style.display = "inline-block",
    hasStorage && localStorage.setItem("isFollDob", 1))
}
var playerContext = playerCanvas.getContext("2d")
  , updateGameLoop = function(b) {
    if (player) {
        for (var a, c = currentTime - 1E3 / 18, d = 0; d < users.length; ++d)
            if (a = users[d],
            a.visible && !a.dead)
                if (a.forcePos || void 0 == a.localX || void 0 == a.localY)
                    a.localX = a.x,
                    a.localY = a.y,
                    a.forcePos = !1;
                else {
                    var f = (c - a.t1) / (a.t2 - a.t1);
                    a.localX = Math.lerp(a.x2, a.x, f);
                    a.localY = Math.lerp(a.y2, a.y, f)
                }
        a = users[getPlayerIndex(player.sid)];
        var h, e;
        a && (h = a.localX,
        e = a.localY);
        c = (h || 0) - maxScreenWidth / 2 - screenSkX;
        e = (e || 0) - maxScreenHeight / 2 - screenSkY;
        if (gameData) {
            mainContext.lineWidth = 7;
            mainContext.fillStyle = gameData.outerColor;
            mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
            mainContext.fillStyle = gameData.waterColor;
            mainContext.roundRect(MathMAX(-7, -gameData.mapScale - c), MathMAX(-7, -gameData.mapScale - e), MathMIN(maxScreenWidth + 14, gameData.mapScale - c + 7), MathMIN(maxScreenHeight + 14, gameData.mapScale - e + 7), 0).fill();
            mainContext.stroke();
            mainContext.lineWidth = 5;
            mainContext.strokeStyle = darkColor;
            mainContext.globalAlpha = .18;
            mainContext.beginPath();
            for (d = -c - gameData.mapScale - 960; d < maxScreenWidth; d += 40)
                mainContext.moveTo(d, 0),
                mainContext.lineTo(d, maxScreenHeight);
            for (d = -e - gameData.mapScale - 960; d < maxScreenHeight; d += 40)
                mainContext.moveTo(0, d),
                mainContext.lineTo(maxScreenWidth, d);
            mainContext.stroke();
            mainContext.globalAlpha = 1;
            if (gameData.islands)
                for (d = 0; d < gameData.islands.length; ++d)
                    a = gameData.islands[d],
                    f = a.x - c,
                    h = a.y - e,
                    0 <= f + a.s + 125 && 0 <= h + a.s + 125 && f - a.s - 125 <= maxScreenWidth && h - a.s - 125 <= maxScreenHeight && drawIsland(f, h, a.s, a.i, mainContext)
        }
        mainContext.lineWidth = 8.5;
        for (d = 0; d < gameObjects.length; ++d)
            a = gameObjects[d],
            a.active && (a.x += b / 1E3 * a.xS,
            a.y += b / 1E3 * a.yS,
            f = a.x - c,
            h = a.y - e,
            0 <= f + a.s && 0 <= h + a.s && f - a.s <= maxScreenWidth && h - a.s <= maxScreenHeight && (mainContext.translate(f, h),
            renderGameObject(a, mainContext),
            mainContext.translate(-f, -h)));
        for (var g, d = 0; d < users.length; ++d)
            if (a = users[d],
            a.visible && !a.dead) {
                f = a.localX - c;
                h = a.localY - e;
                (g = userSkins[a.skin || 0]) || (g = userSkins[0]);
                if (a.animMults)
                    for (var k = 0; k < a.animMults.length; ++k)
                        a.animMults[k].plus && (a.animMults[k].mult += a.animMults[k].plus,
                        1 <= a.animMults[k].mult && (a.animMults[k].mult = 1,
                        a.animMults[k].plus = 0),
                        .8 > a.animMults[k].mult && (a.animMults[k].mult = .8,
                        a.animMults[k].plus *= -1));
                playerCanvas.width = playerCanvas.height = a.length + a.ramLength + a.rudder + 100;
                playerContext.translate(playerCanvas.width / 2, playerCanvas.height / 2);
                renderPlayer(playerContext, a, f, h, g, b);
                a.spawnProt && (void 0 == a.flashAlpha && (a.flashAlpha = maxFlashAlpha,
                a.flashInc = 5E-4),
                a.flashAlpha += a.flashInc * b,
                a.flashAlpha > maxFlashAlpha ? (a.flashAlpha = maxFlashAlpha,
                a.flashInc *= -1) : 0 >= a.flashAlpha && (a.flashAlpha = 0,
                a.flashInc *= -1),
                playerContext.globalCompositeOperation = "source-atop",
                playerContext.fillStyle = "rgba(255, 255, 255, " + a.flashAlpha + ")",
                playerContext.fillRect(-playerCanvas.width / 2, -playerCanvas.height / 2, playerCanvas.width, playerCanvas.height),
                playerContext.globalCompositeOperation = "source-over");
                playerContext.translate(-(playerCanvas.width / 2), -(playerCanvas.height / 2));
                g.opacity && (mainContext.globalAlpha = g.opacity);
                mainContext.save();
                mainContext.translate(f, h);
                mainContext.rotate(a.dir - MathPI / 2);
                mainContext.drawImage(playerCanvas, -(playerCanvas.width / 2), -(playerCanvas.height / 2));
                mainContext.restore();
                mainContext.globalAlpha = 1;
                mainContext.globalCompositeOperation = "source-over"
            }
        for (var m, l, n, d = 0; d < users.length; ++d)
            if (a = users[d],
            a.visible && !a.dead) {
                f = a.localX - c;
                h = a.localY - e;
                n = 1 + a.length / 270;
                g = a.length / 3.4;
                if (a.name) {
                    k = a.name + "-" + a.lvl + "-" + n;
                    if (a.nameSpriteID != k) {
                        m = document.createElement("canvas");
                        l = m.getContext("2d");
                        n *= 25;
                        l.font = n + "px regularF";
                        var p = l.measureText(a.name);
                        l.font = 1.3 * n + "px regularF";
                        var q = l.measureText(a.lvl ? a.lvl + "" : "");
                        l.font = n + "px regularF";
                        m.width = p.width + 2 * q.width + 20;
                        m.height = 2 * n;
                        l.translate(m.width / 2, m.height / 2);
                        l.font = n + "px regularF";
                        l.fillStyle = "#ffffff";
                        l.strokeStyle = darkColor;
                        l.lineWidth = 6.5;
                        l.textAlign = "center";
                        700 >= m.width && (l.strokeText(a.name, 0, 0),
                        l.fillText(a.name, 0, 0),
                        a.lvl && (l.font = 1.3 * n + "px regularF",
                        n = -(p.width / 2) - (10 + q.width / 2),
                        l.strokeStyle = darkColor,
                        l.strokeText(a.lvl, n, 0),
                        l.fillText(a.lvl, n, 0)));
                        a.nameSpriteID = k;
                        a.nameSprite = m
                    }
                    a.nameSprite && mainContext.drawImage(a.nameSprite, f - a.nameSprite.width / 2, h - 2 * g - a.nameSprite.height / 2, a.nameSprite.width, a.nameSprite.height)
                }
                n = 1 + a.maxHealth / 160 / 17;
                k = 70 * n;
                m = a.health / a.maxHealth;
                m *= k;
                l = 75 / 9;
                mainContext.fillStyle = darkColor;
                mainContext.roundRect(f - k / 2 - 4, h + g + g - 4, k + 8, l + 8, 6).fill();
                mainContext.fillStyle = a.team == player.team ? "#78d545" : "#ED6B6B";
                mainContext.roundRect(f - k / 2, h + g + g, m, l, 6).fill()
            }
        0 > dayTimeValue ? (mainContext.fillStyle = "rgba(0, 0, 0, " + -1 * dayTimeValue + ")",
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight)) : 0 < dayTimeValue && (mainContext.fillStyle = "rgba(255, 255, 255, " + dayTimeValue + ")",
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight));
        updateAnimTexts(b)
    }
};
function renderPlayer(b, a, c, d, f, h) {
    b.lineWidth = 8.5;
    b.fillStyle = f.color2;
    b.strokeStyle = darkColor;
    c = a.length - (a.rearLength + a.noseLength);
    var e = (2 * a.cannonLength + a.width + b.lineWidth) * (a.animMults ? a.animMults[0].mult || 1 : 1);
    if (a.cannons) {
        d = (c / a.cannons + 1) / 2 * -(a.cannons - 1);
        for (var g = 0; g < a.cannons; ++g)
            b.roundRect(-e / 2, d + c / a.cannons * g - a.cannonWidth / 2, e, a.cannonWidth, 0).stroke(),
            b.fill()
    }
    if (a.scatterCannons) {
        b.save();
        b.rotate(MathPI / 2);
        d = (c / a.scatterCannons + 1) / 2 * -(a.scatterCannons - 1);
        for (g = 0; g < a.scatterCannons; ++g)
            for (var k = 0; 2 > k; ++k)
                b.roundRect(d + c / a.scatterCannons * g - a.cannonWidth / 2, -e / 2.4, a.cannonWidth, e / 2.4, 0, 1.3).stroke(),
                b.fill(),
                b.rotate(MathPI);
        b.restore()
    }
    if (a.rows)
        for (a.rowRot || (a.rowRot = 0),
        a.rowSpeed || (a.rowSpeed = .002),
        a.rowRot += a.rowSpeed * h,
        .3 <= a.rowRot && (a.rowRot = .3,
        a.rowSpeed = -.001),
        -.35 >= a.rowRot && (a.rowRot = -.35,
        a.rowSpeed = .002),
        d = (c / a.rows + 1) / 2 * (a.rows - 1),
        h = a.width / 5,
        e = 9 + a.width,
        g = 0; g < a.rows; ++g)
            k = d - c / a.rows * g,
            b.save(),
            b.translate(0, k),
            b.rotate(a.rowRot),
            b.roundRect(0, -(h / 2), e, h, 0).stroke(),
            b.fill(),
            b.rotate(-(2 * a.rowRot) - MathPI),
            b.roundRect(0, -(h / 2), e, h, 0).stroke(),
            b.fill(),
            b.restore();
    a.mineDropper && (b.roundRect(.55 * -(a.width / 2), -(a.length / 2) - 15 * (a.animMults ? a.animMults[2].mult || 1 : 1) + 2, .55 * a.width, 17, 0, 1.2).stroke(),
    b.fill());
    a.rearCannon && (b.roundRect(.55 * -(a.width / 2), -(a.length / 2) - 15 * (a.animMults ? a.animMults[2].mult || 1 : 1) + 2, .55 * a.width, 17, 0).stroke(),
    b.fill());
    a.rudder && (b.save(),
    b.translate(0, -(a.length / 2)),
    b.roundRect(-4, -a.rudder, 8, a.rudder, 0).stroke(),
    b.fill(),
    b.restore());
    a.ramLength && (b.beginPath(),
    b.moveTo(a.width / 2.5, a.length / 2 - a.noseLength),
    b.lineTo(a.width / 20, a.length / 2 + a.ramLength),
    b.lineTo(-(a.width / 20), a.length / 2 + a.ramLength),
    b.lineTo(-(a.width / 2.5), a.length / 2 - a.noseLength),
    b.closePath(),
    b.stroke(),
    b.fill());
    a.chaseCannons && (c = a.cannonWidth / 2.5,
    b.roundRect(-(a.width / 2), 0, c, a.length / 2 - a.noseLength + 2.3 * a.cannonLength * (a.animMults ? a.animMults[3].mult || 1 : 1), 0).stroke(),
    b.fill(),
    b.roundRect(a.width / 2 - c, 0, c, a.length / 2 - a.noseLength + 2.3 * a.cannonLength * (a.animMults ? a.animMults[3].mult || 1 : 1), 0).stroke(),
    b.fill());
    c = a.length / 1.85;
    b.fillStyle = f.color1;
    b.beginPath();
    b.moveTo(0, -(a.length / 2));
    b.lineTo(a.width / 2 * .55, -(a.length / 2));
    b.lineTo(a.width / 2, -(a.length / 2) + a.rearLength);
    b.lineTo(a.width / 2, a.length / 2 - a.noseLength);
    b.quadraticCurveTo(a.width / 2, c - a.noseLength / 2, 0, c);
    b.quadraticCurveTo(-(a.width / 2), c - a.noseLength / 2, -(a.width / 2), c - a.noseLength);
    b.lineTo(-(a.width / 2), -(a.length / 2) + a.rearLength);
    b.lineTo(.55 * -(a.width / 2), -(a.length / 2));
    b.closePath();
    b.stroke();
    b.fill();
    c = a.length;
    b.fillStyle = f.color2;
    if (a.swivelCannons || a.gatlinCannons || a.twinCannons || a.quadCannons || a.autoCannons || a.bigCannon || a.sniperCannon || a.trippleCannons || a.busterCannon) {
        if (e = a.gatlinCannons)
            for (d = (c / e + 1) / 2 * (e - 1),
            h = (player.sid == a.sid ? target : a.targetDir) - a.dir + MathPI / 2,
            g = 0; g < a.gatlinCannons; ++g)
                b.save(),
                k = d - c / e * g,
                b.translate(0, k),
                b.rotate(h),
                b.roundRect(0, -(a.cannonWidth / 2.5), 2.1 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), a.cannonWidth / 1.25, 0).stroke(),
                b.fill(),
                b.beginPath(),
                b.moveTo(0, 0),
                b.lineTo(2.1 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), 0),
                b.closePath(),
                b.stroke(),
                drawCircle(0, 0, a.cannonWidth / 1.8, b),
                b.restore();
        if (e = a.bigCannon)
            for (d = (c / e + 1) / 2 * (e - 1),
            h = (player.sid == a.sid ? target : a.targetDir) - a.dir + MathPI / 2,
            g = 0; g < a.bigCannon; ++g)
                b.save(),
                k = d - c / e * g,
                b.translate(0, k),
                b.rotate(h - MathPI / 2),
                b.roundRect(-(a.cannonWidth / 2), 0, a.cannonWidth / 2 * 2, 3 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), 0, 1.2).stroke(),
                b.fill(),
                drawCircle(0, 0, a.cannonWidth / 1.2, b),
                b.restore();
        if (e = a.sniperCannon)
            for (d = (c / e + 1) / 2 * (e - 1),
            h = (player.sid == a.sid ? target : a.targetDir) - a.dir + MathPI / 2,
            g = 0; g < a.sniperCannon; ++g)
                b.save(),
                k = d - c / e * g,
                b.translate(0, k),
                b.rotate(h - MathPI / 2),
                b.roundRect(-(a.cannonWidth / 2.2), 0, a.cannonWidth / 2.2 * 2, 3.5 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), 0).stroke(),
                b.fill(),
                b.roundRect(-(a.cannonWidth / 2), 0, a.cannonWidth / 2 * 2, 2.5 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), 0, 1.2).stroke(),
                b.fill(),
                drawCircle(0, 0, a.cannonWidth / 1.2, b),
                b.restore();
        if (e = a.busterCannon)
            for (d = (c / e + 1) / 2 * (e - 1),
            h = (player.sid == a.sid ? target : a.targetDir) - a.dir + MathPI / 2,
            g = 0; g < a.busterCannon; ++g)
                b.save(),
                k = d - c / e * g,
                b.translate(0, k),
                b.rotate(h - MathPI / 2),
                b.roundRect(-(a.cannonWidth / 2), 0, a.cannonWidth / 2 * 2, 3.5 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), 0).stroke(),
                b.fill(),
                b.roundRect(-(a.cannonWidth / 1.8), 0, a.cannonWidth / 1.8 * 2, 2.5 * a.cannonLength, 0, 1.2).stroke(),
                b.fill(),
                b.roundRect(-(a.cannonWidth / 1.5), 3.5 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), a.cannonWidth / 1.5 * 2, 1.2 * a.cannonLength, 0).stroke(),
                b.fill(),
                drawCircle(0, 0, a.cannonWidth / 1.2, b),
                b.restore();
        if (e = a.swivelCannons)
            for (d = (c / e + 1) / 2 * (e - 1),
            h = (player.sid == a.sid ? target : a.targetDir) - a.dir + MathPI / 2,
            g = 0; g < a.swivelCannons; ++g)
                b.save(),
                k = d - c / e * g,
                b.translate(0, k),
                b.rotate(h),
                b.roundRect(0, -(a.cannonWidth / 2.4), 2 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), a.cannonWidth / 1.2, 0).stroke(),
                b.fill(),
                drawCircle(0, 0, MathMAX(a.cannonWidth / 1.8, 13), b),
                b.restore();
        if (e = a.twinCannons || a.quadCannons) {
            d = (c / e + 1) / 2 * (e - 1);
            var m = 2
              , l = MathPI;
            a.quadCannons && (m = 4,
            l /= 2);
            h = (player.sid == a.sid ? target : a.targetDir) - a.dir + MathPI / 2;
            for (g = 0; g < e; ++g) {
                k = d - c / e * g;
                b.save();
                b.translate(0, k);
                b.rotate(h);
                for (k = 0; k < m; ++k)
                    b.roundRect(0, -(a.cannonWidth / 2.4), 2.1 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), a.cannonWidth / 1.25, 0).stroke(),
                    b.fill(),
                    b.rotate(l);
                drawCircle(0, 0, a.cannonWidth / 1.4, b);
                b.restore()
            }
        }
        if (e = a.trippleCannons)
            for (f = a.cannonWidth / 1.3,
            d = (c / e + 1) / 2 * (e - 1),
            h = (player.sid == a.sid ? target : a.targetDir) - a.dir + MathPI / 2,
            g = 0; g < e; ++g)
                k = d - c / e * g,
                b.save(),
                b.translate(0, k),
                b.rotate(h),
                b.roundRect(0, -f, 2.1 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), f / 1.4, 0).stroke(),
                b.fill(),
                b.roundRect(0, f - f / 1.4, 2.1 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), f / 1.4, 0).stroke(),
                b.fill(),
                drawCircle(0, 0, f, b),
                b.restore();
        if (e = a.autoCannons)
            for (d = (c / e + 1) / 2 * (e - 1),
            g = 0; g < a.autoCannons; ++g)
                b.save(),
                k = d - c / e * g,
                h = a.aimDir - a.dir + MathPI / 2,
                b.translate(0, k),
                b.rotate(h),
                b.roundRect(0, -(a.cannonWidth / 2.6), 2 * a.cannonLength * (a.animMults ? a.animMults[1].mult || 1 : 1), a.cannonWidth / 1.3, 0).stroke(),
                b.fill(),
                drawCircle(0, 0, a.cannonWidth / 1.85, b),
                b.restore()
    } else
        drawCircle(0, 0, a.cannonWidth / 1.8, b);
    f.overlay && (b.globalCompositeOperation = "source-atop",
    b.fillStyle = f.overlay,
    b.fillRect(-playerCanvas.width / 2, -playerCanvas.height / 2, playerCanvas.width, playerCanvas.height),
    b.globalCompositeOperation = "source-over")
}
function drawCircle(b, a, c, d) {
    d.beginPath();
    d.arc(b, a, c, 0, 2 * Math.PI);
    d.stroke();
    d.fill()
}
var gameObjSprites = [];
function renderGameObject(b, a) {
    var c = b.c + "-" + b.shp + "-" + b.s
      , d = gameObjSprites[c];
    if (!d) {
        var d = document.createElement("canvas")
          , f = d.getContext("2d");
        d.width = 2 * b.s + 10;
        d.height = d.width;
        f.strokeStyle = darkColor;
        f.lineWidth = 8.5;
        f.translate(d.width / 2, d.height / 2);
        0 == b.c ? f.fillStyle = "#797979" : 1 == b.c ? f.fillStyle = "#e89360" : 2 == b.c ? f.fillStyle = "#c8c8c8" : 3 == b.c ? f.fillStyle = "#e9cd5f" : 4 == b.c ? f.fillStyle = "#EB6565" : 5 == b.c ? f.fillStyle = "#6FE8E2" : 6 == b.c && (f.fillStyle = "#7BE86F");
        if (1 == b.shp) {
            var h = MathPI / 2 * 3
              , e = b.s / 2
              , g = MathPI / 6;
            f.beginPath();
            f.moveTo(0, -e);
            for (var k = 0; 6 > k; k++)
                f.lineTo(MathCOS(h) * e, MathSIN(h) * e),
                h += g,
                f.lineTo(.8 * MathCOS(h) * e, .8 * MathSIN(h) * e),
                h += g;
            f.lineTo(0, -e);
            f.closePath()
        } else
            2 == b.shp ? (e = b.s / 1.6,
            f.beginPath(),
            f.moveTo(0, -e),
            f.lineTo(e, 0),
            f.lineTo(0, e),
            f.lineTo(-e, 0),
            f.closePath()) : 3 == b.shp ? (e = b.s / 1.6,
            f.beginPath(),
            f.moveTo(0, -e),
            f.lineTo(e / 1.5, 0),
            f.lineTo(0, e),
            f.lineTo(-e / 1.5, 0),
            f.closePath()) : (f.beginPath(),
            f.arc(0, 0, b.s / 2, 0, 2 * Math.PI));
        f.stroke();
        f.fill();
        gameObjSprites[c] = d;
        d = gameObjSprites[c]
    }
    a.drawImage(d, -d.width / 2, -d.height / 2, d.width, d.height)
}
var islandInfo = [{
    sides: 17,
    color: "#e0cca7",
    offsets: [.92, .95, 1, 1.05, 1, .85, .95, 1, 1.1, 1, .96]
}, {
    sides: 17,
    color: "#d4c19e",
    offsets: [1, .94, 1, 1.13, .98, 1.05, 1.1, 1, .96]
}, {
    sides: 17,
    color: "#c7b694",
    offsets: [1.05, .92, 1, 1.06, 1, .98, 1, .92]
}, {
    sides: 5,
    color: "#a4a4a4",
    offsets: [1.05, .92, 1, 1.06, 1, .98, 1, .92]
}], islandSprites = [], tmpIsl;
function drawIsland(b, a, c, d, f) {
    var h = c + "-" + d
      , e = islandSprites[h];
    if (!e) {
        (tmpIsl = islandInfo[d]) || (tmpIsl = islandInfo[0]);
        var e = document.createElement("canvas")
          , g = e.getContext("2d");
        e.width = 2 * c + (3 > d ? 300 : 10);
        e.height = e.width;
        g.fillStyle = tmpIsl.color;
        g.strokeStyle = darkColor;
        g.translate(e.width / 2, e.height / 2);
        var k = c * tmpIsl.offsets[0];
        g.beginPath();
        g.moveTo(k * MathCOS(0), k * MathSIN(0));
        for (var m = 0, l = 1; l <= tmpIsl.sides - 1; l++)
            m++,
            m >= tmpIsl.offsets.length - 1 && (m = 0),
            k = c * tmpIsl.offsets[m],
            g.lineTo(k * MathCOS(2 * l * MathPI / tmpIsl.sides), k * MathSIN(2 * l * MathPI / tmpIsl.sides));
        g.closePath();
        3 > d && (g.lineWidth = 300,
        g.globalAlpha = .1,
        g.stroke(),
        g.lineWidth = 120,
        g.stroke());
        g.lineWidth = 8.5;
        g.globalAlpha = 1;
        g.stroke();
        g.fill();
        islandSprites[h] = e;
        e = islandSprites[h]
    }
    f.drawImage(e, b - e.width / 2, a - e.height / 2, e.width, e.height)
}
var sendFrequency = 62.5
  , tUpdateFrequency = 1E3 / 24
  , lastUpdated = 0
  , lastSent = 0;
function sendTarget(b) {
    var a = currentTime;
    if (player && !player.dead) {
        target = MathATAN2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
        if (b || a - lastUpdated > tUpdateFrequency)
            1 == controlIndex && (targetD = Math.sqrt(MathPOW(mouseY - screenHeight / 2, 2) + MathPOW(mouseX - screenWidth / 2, 2)),
            targetD *= MathMIN(maxScreenWidth / screenWidth, maxScreenHeight / screenHeight),
            targetD /= maxScreenHeight / 3.5,
            targetD = targetD.round(1),
            1 < targetD ? targetD = 1 : .5 > targetD && (targetD = .5)),
            lastUpdated = a;
        if (b || a - lastSent > sendFrequency)
            lastSent = a,
            1 == controlIndex ? socket.emit("1", target.round(2), targetD.round(1)) : socket.emit("1", target)
    }
}
function sendMoveTarget() {
    keys.r || keys.l || (turnDir = 0);
    keys.u || keys.d || (speedInc = 0);
    socket.emit("4", turnDir, speedInc)
}
for (var animTexts = [], animTextIndex = 0, scoreCountdown = 0, lastScore = 0, scoreDisplayTime = 1500, i = 0; 20 > i; ++i)
    animTexts.push(new animText);
function updateAnimTexts(b) {
    scoreCountdown && (scoreCountdown -= b,
    0 >= scoreCountdown && (lastScore = scoreCountdown = 0));
    mainContext.textAlign = "center";
    mainContext.strokeStyle = "#5f5f5f";
    mainContext.fillStyle = "#ffffff";
    mainContext.lineWidth = 7;
    for (var a = 0; a < animTexts.length; ++a)
        animTexts[a].update(b);
    mainContext.globalAlpha = 1
}
function animText() {
    this.fadeSpeed = this.fadeDelay = this.scalePlus = this.maxScale = this.minScale = this.scale = this.alpha = this.y = this.x = 0;
    this.text = "";
    this.active = !1;
    this.update = function(b) {
        this.active && (this.scale += this.scalePlus * b,
        this.scale >= this.maxScale ? (this.scalePlus *= -1,
        this.scale = this.maxScale) : this.scale <= this.minScale && (this.scalePlus = 0,
        this.scale = this.minScale),
        this.fadeDelay -= b,
        0 >= this.fadeDelay && (this.alpha -= this.fadeSpeed * b,
        0 >= this.alpha && (this.alpha = 0,
        this.active = !1)),
        this.active && (mainContext.globalAlpha = this.alpha,
        mainContext.font = this.scale * viewMult + "px regularF",
        mainContext.strokeText(this.text, this.x, this.y),
        mainContext.fillText(this.text, this.x, this.y)))
    }
    ;
    this.show = function(b, a, c, d, f, h) {
        this.x = b;
        this.y = a;
        this.minScale = this.scale = d;
        this.maxScale = 1.35 * d;
        this.scalePlus = h;
        this.text = c || "";
        this.alpha = 1;
        this.fadeDelay = f || 0;
        this.fadeSpeed = .003;
        this.active = !0
    }
}
function showAnimText(b, a, c, d, f, h, e) {
    var g = animTexts[animTextIndex];
    g.show(b, a, c, d, f, e);
    g.type = h;
    animTextIndex++;
    animTextIndex >= animTexts.length && (animTextIndex = 0)
}
function hideNotifByType(b) {
    for (var a = 0; a < animTexts.length; ++a)
        animTexts[a].type == b && (animTexts[a].active = !1)
}
function showNotification(b) {
    for (var a = 0; a < animTexts.length; ++a)
        "notif" == animTexts[a].type && (animTexts[a].active = !1);
    showAnimText(maxScreenWidth / 2, maxScreenHeight / 1.27, b, 42, 1500, "notif", .19)
}
function showBigNotification(b) {
    hideNotifByType("bNotif");
    showAnimText(maxScreenWidth / 2, screenHeight / 3, b, 130, 1E3, "bNotif", .26)
}
function showScoreNotif(b) {
    hideNotifByType("sNotif");
    lastScore += b;
    showAnimText(maxScreenWidth / 2, maxScreenHeight / 1.34, "+" + lastScore, 35, scoreDisplayTime, "sNotif", .16);
    scoreCountdown = scoreDisplayTime
}
var screenSkX = 0
  , screenShackeScale = 0
  , screenSkY = 0
  , screenSkRed = .5
  , screenSkDir = 0;
function screenShake(b, a) {
    screenShackeScale < b && (screenShackeScale = b,
    screenSkDir = a)
}
function updateScreenShake(b) {
    0 < screenShackeScale && (screenSkX = screenShackeScale * MathCOS(screenSkDir),
    screenSkY = screenShackeScale * MathSIN(screenSkDir),
    screenShackeScale *= screenSkRed,
    .1 >= screenShackeScale && (screenShackeScale = 0))
}
var kickReason = null;
function kickPlayer(b) {
    leaveGame();
    kickReason || (kickReason = b);
    showMainMenuText(kickReason);
    socket.close();
    history.pushState("", "Doblons.io", "/")
}
function updateOrPushUser(b) {
    var a = getPlayerIndex(b.sid);
    null != a ? users[a] = b : users.push(b)
}
function objectExists(b) {
    for (var a = 0; a < users.length; ++a)
        if (users[a].sid == b.sid)
            return !0;
    return !1
}
function getPlayerIndex(b) {
    for (var a = 0; a < users.length; ++a)
        if (users[a].sid == b)
            return a;
    return null
}
function getPlayerIndexById(b) {
    for (var a = 0; a < users.length; ++a)
        if (users[a].id == b)
            return a;
    return null
}
function showMainMenuText(b) {
    userInfoContainer.style.display = "none";
    loadingContainer.style.display = "block";
    loadingContainer.innerHTML = b
}
function hideMainMenuText() {
    userInfoContainer.style.display = "block";
    loadingContainer.style.display = "none"
}
function toggleGameUI(b){gameUiContainer.style.display=b?"block":"none"}
function toggleMenuUI(b) {
    b ? (menuContainer.style.display = "flex",
    darkener.style.display = "block",
    linksContainer.style.display = "block",
    target[2] = 0) : (menuContainer.style.display = "none",
    darkener.style.display = "none",
    linksContainer.style.display = "none")
}
window.addEventListener("resize", resize);
function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    var b = MathMAX(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight);
    mainCanvas.width = screenWidth;
    mainCanvas.height = screenHeight;
    mainCanvas.style.width = screenWidth + "px";
    mainCanvas.style.height = screenHeight + "px";
    mainContext.setTransform(b, 0, 0, b, (screenWidth - maxScreenWidth * b) / 2, (screenHeight - maxScreenHeight * b) / 2)
}
resize();
var then = performance.now();
window.requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(b, a) {
        window.setTimeout(b, 1E3 / targetFPS)
    }
}();
function callUpdate() {
    requestAnimFrame(callUpdate);
    currentTime = Date.now();
    var b = currentTime - then;
    then = currentTime;
    updateGameLoop(b);
}
callUpdate();
