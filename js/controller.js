class Controller {
    constructor(model){
        this.model = model;
        this.id = JSON.parse(localStorage.getItem('id')) || 0;
    }
    
    getId() {
        this.id++
        localStorage.setItem('id', JSON.stringify(this.id));
        return this.id;
    }

    addList(obj) {
        this.model.addList(obj);
    }

    deleteList(id) {
        this.model.deleteList(id);
    }

    deleteBoard(id) {
        this.model.deleteBoard(id);
    }

    addTask(text) {
        this.model.addTask({
            title: text,
            id: this.getId(),
            desc: ''
        });
    }

    switchBoard(index, boardId) {
        this.model.switchBoard(index, boardId);
    }

    openDescription(boardId) {
        this.model.openDescription(boardId);
    }

    addDescription(objDescription) {
        this.model.addDescription(objDescription);
    }

    preDraw() {
        this.model.sendLists()
    }
}
