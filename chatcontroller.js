document.addEventListener('DOMContentLoaded', chatController);
let socket;

//get socket io path from config file.
function chatController() {
    const config = confgObject();
    console.log("config data in controller is", config);
    socket = io.connect(config.path);

    init();
    var chatSearchBar = document.getElementById('chatUserSearch');
    var serachClientEmail = document.getElementById('typedUser');
    var userResult = document.getElementById("userResult");

    function init() {
        createUserListSideBar(config.chatid);
        userData(config);
    }

    // serach client to start conversation.
    chatSearchBar.addEventListener('click', (e) => {
        e.preventDefault();
        userOperation.searchClienttoChat(serachClientEmail.value, (userList) => {
            if (userList.length > 0) {
                userResult.innerHTML = "";
                userList.forEach(user => appnedChatUser(user));
            }
        });
    });


    //send User data to server.
    function userData(config) {
        socket.emit("user-data", config.name, config.email);
        socket.on("response-user-data", userData => {
            userOperation.user = userData;
        });

        socket.emit("request-users-list", { email: config.email });
    }

    function userAlert(msg) {
        alert(msg);
    }


    //get chat users list. and print.
    socket.on("response-users-list", (listdata) => {
        if (listdata.length > 0) {
            listdata.forEach(obj => {
                if (obj) {
                    userOperation.userList.push(obj);
                    appnedChatUser(obj);
                }
            });
        }
    });

    // print clients in list.
    function appnedChatUser(clientdata) {
        let icon = '<div><i class="fa fa-user" aria-hidden="true"></i></div>';
        let maindiv = document.createElement('div');
        maindiv.className = "chat-flex";
        maindiv.setAttribute("data-toggle", "modal");
        maindiv.setAttribute("data-target", `#space${clientdata._id}`);
        maindiv.setAttribute("onclick", `chatUser('${clientdata.email}','${clientdata.name}','${clientdata.status}','${clientdata._id}')`);
        maindiv.setAttribute("id", `${clientdata._id}`);
        maindiv.innerHTML = icon;

        let hsix = document.createElement("h6");
        hsix.innerText = clientdata.name;

        let uid = document.createElement("small");
        uid.innerText = clientdata.email;
        userResult.append(maindiv);
        maindiv.append(hsix);
        maindiv.append(uid);
        createChatSpace(clientdata._id);
        chatSpaceInputs(clientdata);
    }





    // get types messages in function.
    function chatSpaceInputs(client) {
        let clientId = client._id;
        document.getElementById(`${clientId}-message-sent`).addEventListener("submit", e => {
            e.preventDefault();
            let msg = document.getElementById(`${clientId}-message`).value;
            if (msg) {
                appendSentMessages(clientId, msg);
                socket.emit('send-message', msg, client, userOperation.user, client._id);
                document.getElementById(`${clientId}-message`).value = "";
            }
        });
    }

    //print sent image.
    function appendUserImage(clientId, image) {
        let messageElement = document.createElement('div');
        messageElement.className = "message sent";

        var imageElement = document.createElement('img');
        imageElement.className = 'chat-images';
        imageElement.setAttribute('src', image);
        messageElement.appendChild(imageElement);
        document.getElementById(`${clientId}-message-container`).append(messageElement);
    }

    //print recive image.
    function appendReciveImage(clientId, image) {
        let messageElement = document.createElement('div');
        messageElement.className = "message received";

        var imageElement = document.createElement('img');
        imageElement.className = 'chat-images';
        imageElement.setAttribute('src', image);
        messageElement.appendChild(imageElement);
        document.getElementById(`${clientId}-message-container`).append(messageElement);
    }

    //get image by server.
    socket.on("image-recive", (body, image) => {
        isUserinList(body, image);
    })

    //print send messges.
    function appendSentMessages(clientId, message) {
        let messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.className = "message sent";
        document.getElementById(`${clientId}-message-container`).append(messageElement);
    }


    socket.on('message-recive', (sender, message) => {
        isUserinList(sender, message);
    });


    //print recive messages.
    function appendReciveMessages(clientId, message) {
        console.log("appendReciveMessages call", clientId, " and ", message);
        if (message) {
            console.log("message come in", message);
            let messageElement = document.createElement('div');
            messageElement.innerText = message;
            messageElement.className = "message received";
            document.getElementById(`${clientId}-message-container`).append(messageElement);
        }
    }

    // when first time sender comes to chat.
    socket.on('user-request', (clientdata) => {
        console.log("user request data *********", clientdata, "and message is");
        let message = "";
        isUserinList(clientdata, message);
    });


    //check is the user is exist in list if not then it will add in users list.
    socket.on("response-chat-history", userchatHistory => {
        let d = new Date();
        let currentDate = d.toLocaleDateString()
        let dateArray = currentDate.split("/");
        let toDay = dateArray[1];

        dateArray[1] = toDay - 1;
        let yesterday = dateArray[0] + "/" + dateArray[1] + "/" + dateArray[2];

        if (userchatHistory.length > 0) {
            console.log("userchatHistory", userchatHistory);
            let history = userchatHistory[0].chathistory;
            console.log("history", history);
            let clientId = userchatHistory[0].chatid;
            console.log("clientid", clientId);
            history.forEach(obj => {
                if (obj.date === currentDate) {
                    console.log("obj.day === Today", obj.date);
                    printChatHistory(obj, clientId);
                } else if (obj.date != currentDate && obj.date === yesterday) {
                    printChatHistory(obj, clientId);
                }

            })
        }
    });

    function printChatHistory(obj, clientId) {
        if (obj.msgtype === "send") {
            if (obj.message) {
                let imgdata = obj.message.split("/");
                if (imgdata[0] === "data:image") {
                    console.log("image data", obj.message);
                    appendUserImage(clientId, obj.message);
                } else {
                    console.log("message  data", obj.message);
                    appendSentMessages(clientId, obj.message);
                }
            }
        } else if (obj.msgtype === "recive") {
            if (obj.message) {
                let imgdata = obj.message.split("/");
                if (imgdata[0] === "data:image") {
                    appendReciveImage(clientId, obj.message);
                } else {
                    appendReciveMessages(clientId, obj.message);
                }
            }

        }
    }

    function isUserinList(clientdata, message) {
        // console.log("isUserinList function call...");
        if (userOperation.userList.length > 0) {
            // console.log("user request get", clientdata);
            for (let i = 0; i < userOperation.userList.length; i++) {
                if (userOperation.userList[i].email == clientdata.email) {
                    if (message) {
                        // console.log("message is", message);
                        let imgdata = message.message.split("/");
                        if (imgdata[0] === "data:image") {
                            appendReciveImage(userOperation.userList[i]._id, message.message);
                        } else {
                            appendReciveMessages(userOperation.userList[i]._id, message.message);
                        }
                    }
                    break;
                } else if (userOperation.userList.length == i + 1) {
                    userOperation.userList.push(clientdata);
                    appnedChatUser(clientdata);
                }
            }
        } else {
            userOperation.userList.push(clientdata);
            appnedChatUser(clientdata);
        }
    }

}


// send data of reciver to server from sender.
function startChat(cmail, cname, cstatus, objectid) {
    console.log("chat user function call...")
    document.getElementById(`${objectid}-clientname`).innerText = cname;
    document.getElementById(`${objectid}-clientstatus`).innerText = cstatus;
    socket.emit('create-user-in-list', cmail, userOperation.user);
    socket.emit("sent-user-request", cmail, userOperation.user);
    document.getElementById(`${objectid}-message-container`).innerHTML = "";
    socket.emit("request-chat-history", cmail, userOperation.user.email);
}