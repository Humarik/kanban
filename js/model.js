class Model {
    constructor(mediator) {
        this.mediator = mediator;
        this.dataMock = JSON.parse(localStorage.getItem('data')) || [
            {
                title: 'Backlog',
                id: 4,
                issues: []
            },
            {
                title: 'ready',
                id: 3,
                issues: []
            },
            {
                title: 'In Progress',
                id: 2,
                issues: []
            },
            {
                title: 'Finished',
                id: 1,
                issues: []
            }
        ]
    }

    addList(obj) {
        obj.id === null ? obj.id = this.getListId(this.dataMock) : obj.id = 0;
        this.dataMock.unshift(obj);
        localStorage.setItem('data', JSON.stringify(this.dataMock));
        this.mediator.publish('createList', this.dataMock);
        this.mediator.publish('setDisabled', this.dataMock);
    }

    deleteList(id) {
        this.dataMock = this.dataMock.filter((list, index) => list.id != id);
        localStorage.setItem('data', JSON.stringify(this.dataMock));
        this.mediator.publish('createList', this.dataMock);
        this.mediator.publish('setDisabled', this.dataMock);
    }

    addTask(obj) {
        obj.id = this.getTaskId(this.dataMock[0].issues);
        this.dataMock[0].issues.push(obj);
        localStorage.setItem('data', JSON.stringify(this.dataMock));
        this.mediator.publish('drawTask', this.dataMock);
        this.mediator.publish('setDisabled', this.dataMock);

        // this.mediator.publish('drawTask', this.dataMock[0].issues);

        // this.mediator.publish('createList', this.dataMock);
    }

    switchBoard(index, boardId) {
        this.dataMock[index].issues.push(this.dataMock[index - 1].issues.find(task => task.id === +boardId));
        this.dataMock[index - 1].issues = this.dataMock[index - 1].issues.filter(board => board.id !== +boardId);

        localStorage.setItem('data', JSON.stringify(this.dataMock));
        this.mediator.publish('drawTask', this.dataMock);
        this.mediator.publish('setDisabled', this.dataMock);
    }

    openDescription(listId, boardId) {
        const selectedList = this.dataMock.find(list => list.id === +listId);
        const selectedBoard = selectedList.issues.find(board => board.id === +boardId)

        this.mediator.publish('drawDescription', { selectedList, ...selectedBoard });
    }

    addDescription({idList, idBoard, text}) {
        const selectedList = this.dataMock.find(list => list.id === +idList);
        const selectedBoard = selectedList.issues.find(board => board.id === +idBoard)
        selectedBoard.desc = text;

        localStorage.setItem('data', JSON.stringify(this.dataMock));
    }

    sendLists() {
        this.mediator.publish('createList', this.dataMock);
        this.mediator.publish('setDisabled', this.dataMock);
    }

    getListId(data){
        let id = 0;
        for(let i = 0; i < data.length; i++) {
            if (data[i].id > id) id = data[i].id;
        }
        return id + 1;
    }

    getTaskId(data) {
        const id = data.length === 0 ? 1 : data[data.length - 1].id + 1;
        return id;
    }
}