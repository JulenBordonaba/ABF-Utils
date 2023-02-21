import ToDoListData from "./ToDoListData.js";
import ToDoList from "./ToDoList.js";

export default class ToDoListConfig extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            closeOnSubmit: false,
            height: 'auto',
            id: 'abf-utils',
            submitOnChange: true,
            template: ToDoList.TEMPLATES.TODOLIST,
            title: 'To Do List',
            userId: game.userId,
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

        return mergedOptions;
    }

    async _handleButtonClick(event) {
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;
        const toDoId = clickedElement.parents('[data-todo-id]')?.data()?.todoId;

        ToDoList.log(false, 'Button Clicked!', { this: this, action, toDoId });

        switch (action) {
            case 'create': {
                await ToDoListData.createToDo(this.options.userId);
                this.render();
                break;
            }

            case 'delete': {
                const confirmed = await Dialog.confirm({
                    title: game.i18n.localize("TODO-LIST.confirms.deleteConfirm.Title"),
                    content: game.i18n.localize("TODO-LIST.confirms.deleteConfirm.Content")
                });

                if (confirmed) {
                    await ToDoListData.deleteToDo(toDoId);
                    this.render();
                }

                break;
            }

            default:
                ToDoList.log(false, 'Invalid action detected', action);
        }
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }

    getData(options) {
        return {
            todos: ToDoListData.getToDosForUser(options.userId)
        };
    }

    async _updateObject(event, formData) {
        const expandedData = foundry.utils.expandObject(formData);

        await ToDoListData.updateUserToDos(this.options.userId, expandedData);
    }
}
