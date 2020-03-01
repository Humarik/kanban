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
        ];
    }

    addList(obj) {
        obj.id === null ? obj.id = this.getListId(this.dataMock) : obj.id = 0;
        this.dataMock.unshift(obj);
        localStorage.setItem('data', JSON.stringify(this.dataMock));
        this.mediator.publish('createList', this.dataMock);
        this.mediator.publish('setDisabled', this.dataMock);
        this.mediator.publish('counterTasks', this.dataMock);
    }

    deleteList(id) {
        this.dataMock = this.dataMock.filter((list, index) => list.id != id);
        localStorage.setItem('data', JSON.stringify(this.dataMock));
        this.mediator.publish('createList', this.dataMock);
        this.mediator.publish('setDisabled', this.dataMock);
        this.mediator.publish('counterTasks', this.dataMock);
    }

    deleteBoard(id) {
        this.dataMock.forEach(list => {
            if(list.issues.some(board => board.id === +id)) {
                list.issues = list.issues.filter(board => board.id !== +id);
                localStorage.setItem('data', JSON.stringify(this.dataMock));
                this.mediator.publish('drawTask', this.dataMock);
                this.mediator.publish('setDisabled', this.dataMock);
                this.mediator.publish('counterTasks', this.dataMock);
            }
        })
    }

    addTask(obj) {
        this.dataMock[0].issues.push(obj);
        localStorage.setItem('data', JSON.stringify(this.dataMock));
        this.mediator.publish('drawTask', this.dataMock);
        this.mediator.publish('setDisabled', this.dataMock);
        this.mediator.publish('counterTasks', this.dataMock);
    }

    switchBoard(index, boardId) {
        this.dataMock[index].issues.push(this.dataMock[index - 1].issues.find(task => task.id === +boardId));
        this.dataMock[index - 1].issues = this.dataMock[index - 1].issues.filter(board => board.id !== +boardId);

        localStorage.setItem('data', JSON.stringify(this.dataMock));
        this.mediator.publish('drawTask', this.dataMock);
        this.mediator.publish('setDisabled', this.dataMock);
        this.mediator.publish('counterTasks', this.dataMock);
    }

    openDescription(boardId) {
        this.dataMock.forEach(list => {
            if (list.issues.some(board => board.id === +boardId)) {
                this.mediator.publish('drawDescription', list.issues.find(board => board.id === +boardId));
            }
        })
    }

    addDescription({idBoard, text}) {
        this.dataMock.forEach(list => {
            if (list.issues.some(board => board.id === +idBoard)) {
                const selectedBoard = list.issues.find(board => board.id === +idBoard);
                selectedBoard.desc = text;
            }
        })

        localStorage.setItem('data', JSON.stringify(this.dataMock));
    }

    sendLists() {
        this.mediator.publish('createList', this.dataMock);
        this.mediator.publish('setDisabled', this.dataMock);
        this.mediator.publish('counterTasks', this.dataMock);
    }

    getListId(data){
        let id = 0;
        for(let i = 0; i < data.length; i++) {
            if (data[i].id > id) id = data[i].id;
        }
        return id + 1;
    }
}