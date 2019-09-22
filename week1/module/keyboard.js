document.addEventListener("keydown", key => {

    // Entey-Key
    if (key.keyCode === 13) {

        todoController.addTodo();

        const inputNodes = tabIndex();
        inputNodes[inputNodes.length - 2].focus() // focus the last Input-Element
    }

    // TAB-Key
    if (key.keyCode === 9) {

        const inputNodes = tabIndex();

        const activeElement = document.activeElement;

        if (activeElement.type !== "text" || activeElement.tabIndex === (inputNodes.length / 3)) {
            if (inputNodes[0]) {
                inputNodes[0].focus(); // focus the first Input-Element
            }
        }
    }

});


//append the tabindex to the input-elements
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