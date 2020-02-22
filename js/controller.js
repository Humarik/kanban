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

    preDraw() {
        this.model.sendLists()
    }
}
