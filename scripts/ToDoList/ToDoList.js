import ToDoListConfig from "./ToDoListConfig.js";

/**
 * A single ToDo in our list of Todos.
 * @typedef {Object} ToDo
 * @property {string} id - A unique ID to identify this todo.
 * @property {string} label - The text of the todo.
 * @property {boolean} isDone - Marks whether the todo is done.
 * @property {string} userId - The user who owns this todo.
 */
/**
 * A class which holds some constants for todo-list
 */
export default class ToDoList {
    static ID = 'abf-utils';

    static FLAGS = {
        TODOS: 'todos'
    };

    static TEMPLATES = {
        TODOLIST: `modules/${this.ID}/templates/abf-utils.hbs`
    };

    static SETTINGS = {
        INJECT_BUTTON: 'inject-button'
    };

    /**
     * A small helper function which leverages developer mode flags to gate debug logs.
     *
     * @param {boolean} force - forces the log even if the debug flag is not on
     * @param  {...any} args - what to log
     */
    static log(force, ...args) {
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

        if (shouldLog) {
            console.log(this.ID, '|', ...args);
        }
    }

    static initialize() {
        this.toDoListConfig = new ToDoListConfig();

        game.settings.register(this.ID, this.SETTINGS.INJECT_BUTTON, {
            name: `TODO-LIST.settings.${this.SETTINGS.INJECT_BUTTON}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',
            config: true,
            hint: `TODO-LIST.settings.${this.SETTINGS.INJECT_BUTTON}.Hint`,
            onChange: () => ui.players.render()
        });
    }
}
