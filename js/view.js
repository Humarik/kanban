class View {
    constructor(controller, mediator) {
        this.controller = controller;
        this.mediator = mediator;
        this.createListButton = document.querySelector('.header__create-list-btn');

        this.board;
        this.idList;
        this.idBoard;

        this.addList = this.addList.bind(this);
        this.drawList = this.drawList.bind(this);
        this.initDrawTask = this.initDrawTask.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.drawDescription = this.drawDescription.bind(this);
        this.onChange = this.onChange.bind(this);
        this.counterTasks = this.counterTasks.bind(this);

        this.mediator.addListener('drawTask', this.initDrawTask);
        this.mediator.addListener('createList', this.drawList);
        this.mediator.addListener('setDisabled', this.setDisabled);
        this.mediator.addListener('drawDescription', this.drawDescription);
        this.mediator.addListener('counterTasks', this.counterTasks);

        window.onload = () => {
            this.onChange();
        }

        window.addEventListener('hashchange', this.onChange);

        this.createListButton.addEventListener('click', () => {
            this.controller.addList({ title: '', id: 0, issues: [] });
            this.selectDropList(0);
            this.focusInput();
        });
        
        this.content = document.querySelector('.content__body');
    }

    onChange() {
        if (!window.location.hash) {
            document.title = 'Awesome kanban board';
            document.querySelector('.header__create-list-btn').disabled = false;
            this.controller.preDraw();
            this.setListeners();
        } else {
            document.querySelector('.header__create-list-btn').disabled = true;
            this.controller.openDescription(window.location.hash.slice(1));
        }
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
        this.selectDropList(parent.id);
        boardScroll.scrollTop = boardScroll.scrollHeight;
        textInput.focus();
    }

    iniText(textInput) {
        if (!textInput.value.trim()) return alert('you need to write something');

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
            <li class="board__item" id=${data.id} draggable='true'>
                <a class="board__link" href="#${data.id}">${data.title}</a>
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
        if (!data.length) document.querySelector('.content__body').innerHTML = '<p class="message">You should use Create new list button<p>'
        data.forEach((board, i) => {
            document.querySelector('.content__body').innerHTML += `
               <section class="board content__board" id=${board.id}>
                <header class="board__header">
                    <h2 class="board__title">${board.title}</h2>
                    <div class='setting board__setting'>
                        <button class="setting-btn">•••</button>
                        <div class="setting__list-wrap">
                            <ul class="setting__list">
                                <li class="setting__item">
                                    <button class="setting__btn-delete">delete</button>
                                </li>
                            <ul>
                        </div>
                    <div>
                </header>
                <div class="board__list-wrap">
                    <ul class="board__list">
                        ${board.issues.map(this.drawBoardTask).join('')}
                    </ul>
                    <footer class="board__footer">
                    ${
                        i === 0
                        ? ` <div class="board__input">
                                <input class="input-text" placeholder="enter your task" maxlength="50">
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
    }

    deleteList(e) {
        if (!e.target.classList.contains('setting__btn-delete')) return;

        this.controller.deleteList(e.currentTarget.id);
        this.setListeners();
    }

    initDrawTask(data) {
        const boards = document.querySelectorAll('.board');

        data.forEach((list, index) => {
            boards[index].querySelector('.board__list').innerHTML = '';
            boards[index].querySelector('.board__list').innerHTML += list.issues.map(this.drawBoardTask).join('');
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
        <div class="description">
            <header class="description__header">
                <h2 class="description__title">${data.title}</h2>
                <button class="description__delete-btn"></button>
            </header>
            <div class="description__content">
                <div class="description__text-wrap" title="Edit">
                    <p class="description__text" id=${data.id}> 
                        ${data.desc == false
                        ? 'please take me on these courses <3'
                        : data.desc} 
                    </p>
                </div>
                ${data.desc == false
                ?   `<div class="description__textarea-wrap">
                        <textarea class="textarea" placeholder="enter your description" maxlength="400"></textarea>
                    </div>`
                :   `<div class="description__textarea-wrap">
                        <textarea class="textarea hide" placeholder="enter your description" maxlength="400"></textarea>
                    </div>`}
            </div>
        </div>
        `
        this.setDescListeners(data);
    }

    setDescListeners(data) {
        let text;
        const textArea = document.querySelector('.textarea');
        document.title = data.title;

        document.querySelector('.description__delete-btn').addEventListener('click', () => {
            if (text === undefined) return window.location.hash = '';

            this.controller.addDescription({
                idBoard: document.querySelector('.description__text').id,
                text: [text]
            })

            window.location.hash = '';
        });

        textArea.addEventListener('input', (e) => {
            document.querySelector('.description__text').innerHTML = e.target.value.trim();
            text = e.target.value.trim();
            textArea.style.height = 'auto';
            textArea.style.height = e.target.scrollHeight + 'px';
        });

        if (!textArea.classList.contains('hide')) {
            document.querySelector('.description__text-wrap').setAttribute('disabled', true);
            document.querySelector('.description__text-wrap').setAttribute('title', '');
            return;
        }

        document.querySelector('.description__text').addEventListener('click', (e) => {
            textArea.classList.toggle('hide');
            textArea.value = e.target.innerText;
            textArea.focus();
        })
    }

    counterTasks(data) {
        document.querySelector('.active').innerHTML = 'Active tasks: ' + (data.length === 0 ? 0 : data[0].issues.length);

        data.length <= 1
        ? document.querySelector('.finished').innerHTML = 'Finished tasks: 0'
        : document.querySelector('.finished').innerHTML = 'Finished tasks: ' + (data.length === 0 ? 0 : data[data.length - 1].issues.length);
    }

    dragStart(e) {
        if (!e.target.classList.contains('board__item')) return;

        document.querySelectorAll('.board').forEach((board, index) => {
            if (e.currentTarget.id === board.id) {
                this.idList = index + 1;
                this.idBoard = e.target.id;
                this.board = e.target;
            }
        })

        setTimeout(() => {
            e.target.classList.add('hide');
        }, 0);
    }

    dragEnd(e) {
        if (!e.target.classList.contains('board__item')) return;

        e.target.classList.remove('hide');
    }

    dragOver(e) {
        e.preventDefault();
    }

    dragDrop(e) {
        let indexList;
        document.querySelectorAll('.board').forEach((board, index) => {
            if (e.currentTarget.id === board.id) indexList = index;
        })
        
        if (this.idList === indexList) {
            e.currentTarget.querySelector('.drop-list').classList.remove('on');
            this.controller.switchBoard(indexList, this.board.id);
        }
    }

    setListeners() {
        document.querySelectorAll('.board').forEach((board, i)=> {
            board.addEventListener('click', this.deleteList.bind(this));

            board.addEventListener('dragstart', this.dragStart.bind(this));
            board.addEventListener('dragend', this.dragEnd.bind(this));
            board.addEventListener('dragover', this.dragOver.bind(this));
            board.addEventListener('drop', this.dragDrop.bind(this));

            if (i !== 0) {
                board.addEventListener('click', this.showDropButton.bind(this));
                board.addEventListener('click', this.switchBoard.bind(this));
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