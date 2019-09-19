// requires ../observable/observable.js
// requires ./fortuneService.js
// requires ../dataflow/dataflow.js

const TodoController = () => {

    const Todo = () => {                                // facade
        const textAttr = Observable("text");            // we current don't expose it as we don't use it elsewhere
        const doneAttr = Observable(false);
        return {
            getDone: doneAttr.getValue,
            setDone: doneAttr.setValue,
            onDoneChanged: doneAttr.onChange,
            setText: textAttr.setValue,
            getText: textAttr.getValue,
            onTextChanged: textAttr.onChange,
        }
    };

    const todoModel = ObservableList([]); // observable array of Todos, this state is private
    const scheduler = Scheduler();
    // todo: we need a scheduler

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        fireNotify("Neues Todo erstellt");
        return newTodo;
    };

    const addFortuneTodo = () => {

        const newTodo = Todo();
        fireNotify("Neuste Weisheiten vom König");

        todoModel.add(newTodo);
        newTodo.setText('...');

        scheduler.add(ok =>
            fortuneService(text => {        // todo: schedule the fortune service and proceed when done
                    newTodo.setText(text);
                    ok();
                }
            )
        );

    };

    return {
        numberOfTodos: todoModel.count,
        numberOfopenTasks: () => todoModel.countIf(todo => !todo.getDone()),
        addTodo: addTodo,
        addFortuneTodo: addFortuneTodo,
        removeTodo: todoModel.del,
        onTodoAdd: todoModel.onAdd,
        onTodoRemove: todoModel.onDel,
        removeTodoRemoveListener: todoModel.removeDeleteListener, // only for the test case, not used below
    }
};


const TodoItemsList = (todoController, rootElement) => {

    const render = todo => {

        function createElements() {
            const template = document.createElement('DIV'); // only for parsing
            const leftValue = (Math.floor(Math.random() * 90) + 10) + "%";
            template.innerHTML = `
                <li style="left: ${leftValue}"></li>       
            `;
            return template.children;
        }

        const [listElement] = createElements();


        todoController.onTodoRemove((removedTodo, removeMe) => {
            if (removedTodo !== todo) return;
            rootElement.removeChild(listElement);
            // removeMe();
        });

        todo.onTextChanged(() => {
            listElement.innerText = todo.getText();
        });

        todo.onDoneChanged(() => {
            listElement.style.color = (todo.getDone()) ? "green" : "red";
        });

        rootElement.appendChild(listElement);
    };

    todoController.onTodoAdd(render);
};


// View-specific parts

const TodoItemsView = (todoController, rootElement) => {

    const render = todo => {

        function createElements() {
            const template = document.createElement('DIV'); // only for parsing
            template.innerHTML = `
                <button class="delete">&times;</button>
                <input type="text" size="42">
                <input type="checkbox">            
            `;
            return template.children;
        }

        const [deleteButton, inputElement, checkboxElement] = createElements();

        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);

        deleteButton.onclick = _ => {
            fireNotify(`Todo wurde entfernt`);
            todoController.removeTodo(todo);
        };

        inputElement.oninput = _ => todoTextValidation(inputElement,  checkboxElement, todo, todoController);

        todoController.onTodoRemove((removedTodo, removeMe) => {
            if (removedTodo !== todo) return;
            rootElement.removeChild(inputElement);
            rootElement.removeChild(deleteButton);
            rootElement.removeChild(checkboxElement);
            removeMe();
        });

        todo.onTextChanged(() => {
            inputElement.value = todo.getText();
        });

        todo.onDoneChanged(() => {
            if (todoDoneValidation(inputElement, todo)) {
                inputElement.style.textDecoration = (todo.getDone()) ? "line-through" : "none";
                inputElement.style.color = (todo.getDone()) ? "darkseagreen" : "orangered";
            } else {
                todo.setDone(false);
                checkboxElement.checked = false;
            }
        });

        rootElement.appendChild(deleteButton);
        rootElement.appendChild(inputElement);
        rootElement.appendChild(checkboxElement);
    };

    // binding

    todoController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};


const todoDoneValidation = (textElement, todo) => {
    const text = textElement.value;
    const min = 3, max = 50;

    if (text.length < min) {
        fireNotify(`Text  muss min. ${min} Zeichen haben`);
        // textElement.value = todo.getText();
        return false;
    }

    return true;
};


// Text-Validation
const todoTextValidation = (textElement, checkbox, todo, todoController) => {
    const newText = textElement.value;
    const min = 3, max = 50;

    if (checkbox.checked) {
        fireNotify("Fertige Todos können nicht bearbeitet werden");
        textElement.value = todo.getText();

    } else {

        if (newText.length >= min && newText.length <= max) {
            todo.setText(newText);
            return true;
        } else {

            // message = "Text " + ((newText.length === 2) ? `muss min. ${min}` : `kann max. ${max}`) + " Zeichen haben";

            if (newText.length <= min) {
                if (newText.length === 0) {
                    fireNotify(`Text muss min. ${min} Zeichen haben`);
                }
            } else {
                fireNotify(`Text kann max. ${max} Zeichen haben`);
                textElement.value = todo.getText();
            }
        }
    }
    return false;
};

const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.innerText = "" + todoController.numberOfTodos();

    // binding

    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};

const TodoOpenView = (todoController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfopenTasks();

    // binding

    todoController.onTodoAdd(todo => {
        render();
        todo.onDoneChanged(render);
    });
    todoController.onTodoRemove(render);
};





