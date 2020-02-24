let chatSideBar = document.getElementById("chatBody");
var config;

//get user Data from frontend.
function userConfigration(name, email) {
    const configration = new Configration(name, email, 'http://localhost:3000', chatSideBar);
    config = configration;
}

function confgObject() {
    // console.log("configration", config);
    return config;

}

function chatUser(cmail, cname, cstatus, objectid) {
    startChat(cmail, cname, cstatus, objectid);
}

document.writeln(`<script src="../script/chat/chatcontroller.js"></script>`);