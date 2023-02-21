import ToDoList from "./ToDoList/ToDoList.js";

console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function () {
    console.log("This code runs once the Foundry VTT software begins its initialization workflow.");
    ToDoList.initialize();
});

Hooks.on("ready", function () {
	console.log("This code runs once core initialization is ready and game data is available.");
});


/**
 * Register our module's debug flag with developer mode's custom hook
 */
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    console.log("This code runs once DEV MODE is ready and game data is available.");
    registerPackageDebugFlag(ToDoList .ID);
});

Hooks.on('renderPlayerList', (playerList, html) => {
    // if the INJECT_BUTTON setting is false, return early
    if (!game.settings.get(ToDoList.ID, ToDoList.SETTINGS.INJECT_BUTTON)) {
        return;
    }

    // find the element which has our logged in user's id
    const loggedInUserListItem = html.find(`[data-user-id="${game.userId}"]`)

    // create localized tooltip
    const tooltip = game.i18n.localize('TODO-LIST.button-title');

    // insert a button at the end of this element
    loggedInUserListItem.append(
        `<button type='button' class='todo-list-icon-button flex0' title="${tooltip}">
      <i class='fas fa-tasks'></i>
    </button>`
    );

    // register an event listener for this button
    html.on('click', '.todo-list-icon-button', (event) => {
        const userId = $(event.currentTarget).parents('[data-user-id]')?.data()?.userId;

        ToDoList.toDoListConfig.render(true, { userId });
    });
});

