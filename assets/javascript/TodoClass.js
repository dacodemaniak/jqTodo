class Todo {
    /**
     * Constructeur de la classe Todo
     * @param TodoList todoList Liste des choses à faire
     */
    constructor(todoList){
        this._todoList = todoList;
    }

    /**
     * Retourne la valeur du todo de l'objet courant
     * @return string
     */
    get todo() {
        return this._todo;
    }

    /**
     * Définit la valeur du todo de l'objet courant
     * @param string value
     * @return Todo
     */
    set todo(value) {
        this._todo = value;

        // Ajoute le todo à la liste des todos
        this._todoList.add(this);
    }

    /**
     * Supprime le todo courant de la liste des todos
     */
    delete() {
        this._todoList.delete(this);
    }
    /**
     * getter explicite pour accéder à l'attribut _todo
     * @return string
     */
    getTodo() {
        return this._todo;
    }

    /**
     * Méthode explicite pour définir la valeur de l'attribut _todo
     * @param {*} value Chaine saisie par l'utilisateur
     * @return Todo
     */
    setTodo(value) {
        this._todo = value;
        return this;
    }
}