const autoBind = require('auto-bind');
const moment = require('moment-jalaali');
class chatController {

    constructor() {
        autoBind(this);
        this.users = [];
    }

    async chatForm(req, res, next) {
        res.render('admin/chat/chat')

    }

    async chatRoom(req, res, next) {
        res.render('admin/chat/chat-room')
    }

    connectToSocket(io) {
        io.on('connection', (socket) => {

            socket.on('join', (query, cb) => {
                if (query.room === '' || !query.room) {
                    cb('همچیم صفحه ای وجود ندارد')
                } else {
                    socket.join(query.room);
                    this.UserRemove(socket.id);
                    this.UserJoin(socket.id, query.user, query.room)
                    io.to(query.room).emit('userList', this.UserList(query.room));
                    socket.emit('userAdd', this.generateMessage('به انجمن خوش آمدید', 'مدیر سایت'));
                    socket.broadcast.to(query.room).emit('userAdd', this.generateMessage(`کاربری با نام ${query.user} وارد انجمن شد.`, 'مدیر سایت'));
                    cb();
                }
            });

            socket.on('chat message', (msg) => {
                let userInfo = this.GetUser(socket.id);
                if (userInfo) {
                    io.to(userInfo.room).emit('chat message', this.generateMessage(msg.message, msg.sender));
                }
            });

            socket.on('disconnect', () => {
                let user = this.UserRemove(socket.id)
                if (user) {
                    io.to(user.room).emit('userList', this.UserList(user.room));
                    io.to(user.room).emit('chat message', this.generateMessage(`کاربری با نام ${user.name} از انجمن خارج شد.`, 'مدیر سایت'));
                }

            });
        });

    }

    UserJoin(id, name, room) {
        let user = { id, name, room };
        this.users.push(user);
    }

    // UserRemove(id) {
    //     let user = this.GetUser(id);
    //     if (user) {
    //         this.users.filter(user => user.id !== id);
    //     }
    //     return user;
    // }
    UserRemove(id) {
        let userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            let user = this.users[userIndex];
            this.users.splice(userIndex, 1);
            return user;
        }
        return null;
    }

    GetUser(id) {
        let user = this.users.filter(user => user.id == id)[0];
        return user;
    }

    UserList(room) {
        let users = this.users.filter(user => user.room == room);
        let username = users.map(user => user.name);
        return username;
    }

    generateMessage(message, sender) {
        return {
            message,
            sender,
            createdAt : moment().format('HH:mm')
        }
    }

}



module.exports = new chatController();