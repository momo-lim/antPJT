var stompClient = null;
var stompClient2 = null;

// 알림 기능 테스트
function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
	// 서버의 설정된 endPoint값과 동일하게 설정
    var socket = new SockJS('/happy-ant-websocket');
    stompClient = Stomp.over(socket);
    console.log('stompClient : ', stompClient);
    // 접속 성공하면 2번째 매개값인 콜백함수 실행
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        // 서버측에서 메시지가 전달되면 콜백으로 구현
        stompClient.subscribe('/alert/' + $("#userId").val(), function (msg) {
        	console.log(msg)
        	// JSON.parse: json 문자열을 js객체로 리턴하는 메서드
            showGreeting(JSON.parse(msg.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendText() {
    stompClient.send("/app/alert/" + $("#userId").val(), {},
    				JSON.stringify({'userId': $("#userId").val(), 'content': $("#text").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

// 채팅 기능 테스트
function setConnected2(connected) {
    $("#connect2").prop("disabled", connected);
    $("#disconnect2").prop("disabled", !connected);
    if (connected) {
        $("#conversation2").show();
    }
    else {
        $("#conversation2").hide();
    }
    $("#chatting").html("");
}

function connect2() {
	// 서버의 설정된 endPoint값과 동일하게 설정
    var socket = new SockJS('/happy-ant-websocket');
    stompClient2 = Stomp.over(socket);
    console.log('stompClient2 : ', stompClient2);
    // 접속 성공하면 2번째 매개값인 콜백함수 실행
    stompClient2.connect({}, function (frame) {
        setConnected2(true);
        console.log('Connected: ' + frame);
        // 서버측에서 메시지가 전달되면 콜백으로 구현
        stompClient2.subscribe('/study/' + $("#studyId").val(), function (msg) {
        	console.log(msg)
        	// JSON.parse: json 문자열을 js객체로 리턴하는 메서드
            showChatting(JSON.parse(msg.body).content);
        });
    });
}

function disconnect2() {
    if (stompClient2 !== null) {
        stompClient2.disconnect();
    }
    setConnected2(false);
    console.log("Disconnected");
}

function sendChat() {
    stompClient2.send("/app/study/" + $("#studyId").val(), {},
    					JSON.stringify({'userId': $("#studyMemberId").val(), 'content': $("#chat").val()}));
}

function showChatting(message) {
    $("#chatting").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendText(); });
    $( "#connect2" ).click(function() { connect2(); });
    $( "#disconnect2" ).click(function() { disconnect2(); });
    $( "#send2" ).click(function() { sendChat(); });
});

