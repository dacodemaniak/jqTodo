class TodoList {
    /**
     * Constructeur de la classe TodoList
     * Initialise le tableau des todos
     */
    constructor() {
        this._todos = [];
    }

    /**
     * Retourne le todo à l'index défini
     * @param {int} index 
     */
    get(index) {
        return this._todos[index];
    }

    /**
     * Ajoute un todo à la pile des todos
     * @param {Todo} todo Objet todo qui sera passé en paramètre
     */
    add(todo) {
        this._todos.push(todo);
    }

    update() {}

    /**
     * Supprime un todo de la liste
     * @param {Todo} todo 
     */
    delete(todo) {
        let index = this._todos.indexOf(todo);
        if (index !== -1) {
            this._todos.splice(index, 1);
        }
    }

    /**
     * Réduit le tableau aux éléments à conserver
     * @param {Array} indices 
     */
    reduce(indices) {
        let newArray = [];

        for (let index = 0; index < this._todos.length; index++) {
            if (indices.indexOf(index) === -1) {
                // Conserver la valeur
                newArray.push(this._todos[index]);
            }
        }
        // Remplace le tableau par le nouveau
        this._todos = newArray;
    }

    _persist() {}

    _load(){}

    toString() {
        let message = '';
        // Pour contrôle
        for(let ctrl=0; ctrl < this._todos.length; ctrl++) {
            message += this._todos[ctrl]._todo + '\n';
        }

        return message;
    }
}