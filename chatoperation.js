const userOperation = {
    user: {},
    userList: [],

    searchClienttoChat(serachClientEmail, cb) {
        let serachuser = {}
        serachuser.email = serachClientEmail;
        var pr = fetch('http://localhost:3000/search', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(serachuser)
        });

        pr.then(response => response.text().then(data => {
            let clientdata = JSON.parse(data);
            if (typeof clientdata == "object") {
                if (clientdata.email == this.user.email) {
                    let msg = "please enter a valid email Id";
                    userAlert(msg);
                } else {
                    if (this.userList.length > 0) {
                        for (let i = 0; i < this.userList.length; i++) {
                            if (this.userList[i].email == clientdata.email) {
                                break;
                            } else if (this.userList.length == i + 1) {
                                this.userList.push(clientdata);
                                cb(this.userList);
                            }
                        }
                    } else {
                        this.userList.push(clientdata);
                        cb(this.userList);
                    }
                    console.log("user list is", this.userList);
                }
            } else {
                //send alert to controller.
                userAlert(clientdata);
            }

            // userResult.innerText = JSON.parse(data).userId
        }).catch(error => console.log(error))).catch(e => console.log(e));
    }
}

document.writeln(`<script src="../script/chat/config.js"></script>`);