function createUserListSideBar(chatSideBar) {
    chatSideBar.innerHTML = `<nav class="Toggle-navbar scrollbar" id="style-2">
    <div class="Chat-Header">
           <div id="Close-chat">
               <h5>X</h5>
           </div>
   <div class="flex">        
           <div class="input-group searchBox">
             <input type="text" class="borderR23" placeholder="Search Chat Email" aria-label="Search for...">
             
           </div>
           <span id="chatAddUser"><i class="fa fa-plus" aria-hidden="true"></i></span>
    </div>
    <div>
      <input type="text" class="borderR23" placeholder="Search Chat Email" aria-label="Search for..." id="typedUser" >
      <button id="chatUserSearch">Search</button>
      <div id="userResult"></div>
    </div>
    </div>                                                            
    </div>
 </nav>
 <div class="chat-space"></div>`;
}

function createChatSpace(clientId) {

    let chatSpacePart = document.createElement('div');
    chatSpacePart.className = "modal fade modal-bg-color";
    chatSpacePart.setAttribute("tabindex", "-1");
    chatSpacePart.setAttribute("role", "dialog");
    chatSpacePart.setAttribute("aria-labelledby", "exampleModalLongTitle")
    chatSpacePart.setAttribute("aria-hidden", "true");
    chatSpacePart.setAttribute("id", `space${clientId}`);
    chatSpacePart.innerHTML = `<div class="modal-dialog chat-dialog" role="document">
    <div class="modal-content chat-content">         
      <div class="modal-body chat-body"> 
        <div class="pagers">
          <div class="marvel-device nexus5">
            <div class="screen">
              <div class="screen-container">
                <div class="chat">
                  <div class="chat-container">
                    <div class="user-bar">
                      <div class="back">
                        <i class="zmdi zmdi-arrow-left"></i>
                      </div>
                      <div class="avatar">
                        <img src="https://avatars2.githubusercontent.com/u/398893?s=128" alt="Avatar" id='${clientId}-profile'>
                      </div>
                      <div class="name">
                        <span id='${clientId}-clientname' >Zeno Rocha</span>
                        <span class="status" id='${clientId}-clientstatus'>online</span>
                      </div>
                      <div class="actions more">
                        <h5 data-dismiss="modal" aria-label="Close">X</h5>
                      </div>
                      
                    </div>
                    <div class="conversation">
                      <div class="conversation-container" id='${clientId}-message-container'>
                      </div>
                      <div class="select-docs">
                      <form action="http://localhost:3000/upload" method="post" enctype="multipart/form-data" id="sent-file">
                      <input type="file" name="file" id="select-file">
                      </form>
                            <!--<input type="file" name="image" id="select-image">-->
                      <form class="conversation-compose" id='${clientId}-message-sent'>
                        <input class="input-msg" name="input" placeholder="Type a message" id='${clientId}-message' autocomplete="off" autofocus></input>
                        <div class="photo">
                          <i class="fas fa-paperclip"></i>
                        </div>
                        <button class="send">
                            <div class="circle">
                              <i class="fas fa-paper-plane"></i>
                            </div>
                          </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>             
      </div> 
    </div>
  </div>`;
    document.querySelector(".chat-space").appendChild(chatSpacePart);
}

document.writeln(`<script src="../script/chat/chatoperation.js"></script>`);