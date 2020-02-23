class View {
    constructor(controller, mediator) {
        this.controller = controller;
        this.mediator = mediator;
        this.createListButton = document.querySelector('.header__create-list-btn');

        this.addList = this.addList.bind(this);
        this.drawList = this.drawList.bind(this);
        this.initDrawTask = this.initDrawTask.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.drawDescription = this.drawDescription.bind(this);
        this.getTextAreaValue = this.getTextAreaValue.bind(this);
        this.expandedGetAreaValue = this.expandedGetAreaValue.bind(this);

        this.mediator.addListener('drawTask', this.initDrawTask);
        this.mediator.addListener('createList', this.drawList);
        this.mediator.addListener('setDisabled', this.setDisabled);
        this.mediator.addListener('drawDescription', this.drawDescription);

        this.controller.preDraw()
        this.setListeners();

        this.getTextAreaValue = this.expandedGetAreaValue(this.getTextAreaValue);

        this.createListButton.addEventListener('click', () => {
            this.controller.addList({ title: '', id: 0, issues: [] });
            this.selectDropList(0);
            // this.setListeners();

            this.focusInput();
        });
        
        this.content = document.querySelector('.content__body');
    }

    setDisabled(data) {
        document.querySelectorAll('.board__add-card').forEach((button, index) => {
            if(index !== 0) {
                button.disabled = data[index - 1].issues.length === 0 ? true : false;
            }
        })
    }

    focusInput() {
        document.querySelectorAll('.board')[0].querySelector('.board__add-card').style.display = 'none';

        const textInput = document.querySelectorAll('.board')[0].querySelector('.input-text');
        textInput.focus();

        textInput.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();

                textInput.removeEventListener('focusout', this.addList);
                this.addList();
            }
        });
        textInput.addEventListener('focusout', this.addList);
    }

    addList() {
        const text = document.querySelector('.input-text').value;
        
        if (text) {
            this.mediator.removeListener('createList', this.drawList);
            this.controller.deleteList(0);
            this.mediator.addListener('createList', this.drawList);
            this.controller.addList({ title: text, id: null, issues: [] });
        }
        else {
            this.controller.deleteList(0);
        }

        this.setListeners();
    }

    showBoardInput(e) {
        if (!e.target.classList.contains('board__add-card')) return;

        const parent = e.currentTarget,
        textInput = parent.querySelector('.input-text'),
        boardScroll = parent.querySelector('.board__list-wrap');
        e.target.classList.toggle('send');
        // if (!e.target.classList.toggle('send')) {
        //     // this.iniText(textInput);
        // }
        this.selectDropList(parent.id);
        boardScroll.scrollTop = boardScroll.scrollHeight;
        textInput.focus();
    }

    iniText(textInput) {
        if (!textInput.value.trim()) return alert('you need to write something');

        // this.controller.addTask({ title: textInput.value, id: '1', desc: '' });
        this.controller.addTask(textInput.value);
        textInput.value = '';
    }

    showDropButton(e) {
        if (!e.target.classList.contains('board__add-card')) return;
        if (document.querySelector('.send')) document.querySelector('.send').classList.remove('send');
        
        const parent = e.currentTarget,
            list = parent.querySelector('.board__list'),
            dropList = parent.querySelector('.drop-list__list-wrap'),
            boardScroll = parent.querySelector('.board__list-wrap');

        this.selectDropList(parent.id);

        list.clientHeight > 370
            ? dropList.style.width = 246 + 'px'
            : dropList.style.width = 258 + 'px'

        boardScroll.scrollTop = boardScroll.scrollHeight;
    }

    showDropList() {
        const dropList = this.querySelector('.drop-list__list-wrap');
        dropList.classList.toggle('on');

        const board = this.parentNode.parentNode.parentNode,
            space = document.body.clientHeight - board.clientHeight - board.offsetTop - 216;

        if (space <= 100) {
            dropList.style.top = 'auto'
            dropList.style.bottom = '86px'
        } else {
            dropList.style.top = '100%'
            dropList.style.bottom = 'auto'
        }
    }

    hideDropList() {
        this.querySelector('.drop-list__list-wrap').classList.toggle('on');
    }

    selectDropList(id) {
        let classElem;

        document.querySelectorAll('.board').forEach((board, i) => {
            classElem = i === 0 ? 'board__input' : 'drop-list';

            if (board.querySelector(`.${classElem}`).classList.contains('on')) {
                board.querySelector(`.${classElem}`).classList.toggle('on');
            } else {
                board.querySelector(`.${classElem}`).classList.toggle('on', board.id == id); // ===
            }
        })
    }

    drawBoardTask(data) {
        return `
            <li class="board__item" id=${data.id}>
                <a class="board__link" href="#">${data.title}</a>
            </li>
        `
    }

    drawDropTask(data) {
        return `
            <li class="drop-list__item">
                <span class="drop-list__link" id=${data.id}>${data.title}</span>
            </li>
        `
    }

    switchBoard(e) {
        if (!e.target.classList.contains('drop-list__link')) return;

        document.querySelectorAll('.board').forEach((board, index) => {
            if (e.currentTarget.id === board.id) this.controller.switchBoard(index, e.target.id);
        })

        e.currentTarget.querySelector('.drop-list').classList.toggle('on');
    }

    drawList(data) {
        document.querySelector('.content__body').innerHTML = '';
        data.forEach((board, i) => {
            document.querySelector('.content__body').innerHTML += `
               <section class="board content__board" id=${board.id}>
                <header class="board__header">
                    <h2 class="board__title">${board.title}</h2>
                    <button class="board__setting">•••</button>
                </header>
                <div class="board__list-wrap">
                    <ul class="board__list">
                        ${board.issues.map(this.drawBoardTask).join('')}
                    </ul>
                    <footer class="board__footer">
                    ${
                        i === 0
                        ? ` <div class="board__input">
                                <input class="input-text" placeholder="enter your task">
                            </div>`
                        : ` <div class="drop-list">
                                <button class="drop-list__btn"></button>
                                <div class="drop-list__list-wrap">
                                    <ul class="drop-list__list">
                                       ${data[i - 1].issues.map(this.drawDropTask).join('')} 
                                    </ul>
                                </div>
                            </div>
                            `
                    }   
                        <button class="board__add-card">Add card</button>
                    </footer>
                </div>
            </section>
            `
        })
        //${data[i - 1].issues.map(this.drawDropTask).join('')}
    }

    deleteList(e) {
        this.controller.deleteList(e.target.parentNode.parentNode.id);
        this.setListeners();
    }

    initDrawTask(data) {
        const boards = document.querySelectorAll('.board');

        data.forEach((list, index) => {
            boards[index].querySelector('.board__list').innerHTML = '';
            list.issues.forEach(task => {
                boards[index].querySelector('.board__list').innerHTML += this.drawBoardTask(task);
            })
        })

        boards.forEach((board, i) => {
            if(i !== 0) {
                board.querySelector('.drop-list__list').innerHTML = '';
                board.querySelector('.drop-list__list').innerHTML += data[i - 1].issues.map(this.drawDropTask).join('');
            }
        })

    }

    drawDescription(data) {
        document.querySelector('.content__body').innerHTML = `
        <div class="description" id=${data.selectedList.id}>
            <header class="description__header">
                <h2 class="description__title">${data.title}</h2>
                <button class="description__delete-btn"></button>
            </header>
            <div class="description__content">
                <div class="description__text-wrap">
                    <p class="description__text" id=${data.id}> 
                        ${data.desc === ''
                        ? 'please take me on these courses <3'
                        : data.desc} 
                    </p>
                </div>
                <div class="description__textarea-wrap">
                    <textarea class="textarea"></textarea>
                </div>
            </div>
        </div>
        `
        document.querySelector('.textarea').addEventListener('input', this.getTextAreaValue);
        document.querySelector('.textarea').addEventListener('input', (e) => {
            document.querySelector('.description__text').innerHTML = e.target.value;
            document.querySelector('.textarea').style.height = 'auto';
            document.querySelector('.textarea').style.height = e.target.scrollHeight + 'px';
        });
    }

    getTextAreaValue() {
        return {
            idList: document.querySelector('.description').id,
            idBoard: document.querySelector('.description__text').id,
            text: [document.querySelector('.textarea').value]
        }
    }

    expandedGetAreaValue(func) {
        return function () {
            const index = setTimeout(() => {
                this.controller.addDescription(func())
            }, 3000);
            if (index > 1) clearTimeout(index - 1);
        }.bind(this);
    }

    openDescription(e) {
        if (!e.target.classList.contains('board__link')) return;

        this.controller.openDescription(e.currentTarget.id, e.target.parentNode.id);
    }

    setListeners() {
        document.querySelectorAll('.board').forEach((board, i)=> {
            board.querySelector('.board__setting').addEventListener('click', this.deleteList.bind(this));
            board.addEventListener('click', this.openDescription.bind(this));
            if (i !== 0) {
                board.addEventListener('click', this.showDropButton.bind(this));
                board.addEventListener('click', this.switchBoard.bind(this)); //bind
                board.querySelector('.drop-list').addEventListener('mouseover', this.showDropList);
                board.querySelector('.drop-list').addEventListener('mouseout', this.hideDropList);
            }else {
                board.addEventListener('keydown', (e) => {
                    if (e.keyCode !== 13) return;

                    this.iniText(e.currentTarget.querySelector('.input-text'));
                    e.currentTarget.querySelector('.board__add-card').classList.toggle('send');
                    this.selectDropList(0);
                })
                board.addEventListener('click', (e)=> {
                    if (!e.target.classList.contains('send')) return;
                    
                    this.iniText(e.currentTarget.querySelector('.input-text'));
                });
                board.addEventListener('click', this.showBoardInput.bind(this));
            }
        })
    }
}