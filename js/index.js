const mediator = new Mediator();
const model = new Model(mediator);
const controller = new Controller(model);
const view = new View(controller, mediator);