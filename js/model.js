class Model {
    constructor(mediator) {
        this.mediator = mediator;
        this.dataMock = JSON.parse(localStorage.getItem('data')) || [
            {
                title: 'Backlog',
                id: 1,
                issues: []
            },
            {
                title: 'ready',
                id: 2,
                issues: []
            },
            {
                title: 'In Progress',
                id: 3,
                issues: []
            },
            {
                title: 'Finished',
                id: 4,
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
        // need to fix check id in new cuz when someone clicks on <a> he doesn't get id cuz <a> doesn't have id only <li>
        // i think I need to write id on <a> and make this tage on full space of li by css style
    }

    getTaskId(data) {
        const id = data.length === 0 ? 1 : data[data.length - 1].id + 1;
        return id;
    }
}