document.addEventListener("keydown", key => {

    if (key.keyCode === 13) { // enter

        todoController.addTodo();

        const inputNodes = tabIndex();
        inputNodes[inputNodes.length - 2].focus()
    }


    if (key.keyCode === 9) { // tab

        const inputNodes = tabIndex();
        const activeElement = document.activeElement;

        if (activeElement.type !== "text") {
            if (inputNodes[0]) {
                inputNodes[0].focus();
            }
        }
    }

});

const tabIndex = () => {

    const allNodes = document.getElementById('todoContainer').childNodes;
    let tabIndex = 1;

    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].type === "text") {
            allNodes[i].setAttribute("tabindex", tabIndex.toString());
            tabIndex++;
        }
    }

    return allNodes;
};