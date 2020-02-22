class Controller {
    constructor(model){
       this.model = model;
    }
    
    addList(obj) {
        this.model.addList(obj);
    }

    deleteList(id) {
        this.model.deleteList(id);
    }

    addTask(text) {
        this.model.addTask({
            title: text,
            id: null, 
            desc: ''
        });
    }

    switchBoard(index, boardId) {
        this.model.switchBoard(index, boardId);
    }

    preDraw() {
        this.model.sendLists()
    }
}
