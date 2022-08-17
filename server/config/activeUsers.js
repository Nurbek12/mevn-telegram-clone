class ActiveUsers{
    constructor(){
        this.list = [];
    }
    all(){
        return this.list;
    }
    push(data){
        this.list.push(data)
    }
    remove(id){
        this.list = this.list.filter(u => u.socketId !== id)
    }
}

module.exports = ActiveUsers