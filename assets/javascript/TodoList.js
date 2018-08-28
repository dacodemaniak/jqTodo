class TodoList {
    /**
     * Constructeur de la classe TodoList
     * Initialise le tableau des todos
     */
    constructor() {
        this._todos = [];

        // Charger les todos existants
        this._load();
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
        // Appeler la méthode persistence des données
        this._persist();
    }

    /**
     * Met à jour le todo et sauvegarde l'ensemble
     * @param {Todo} todo 
     * @param {String} newContent 
     */
    update(todo, newContent) {
        let index = this._todos.indexOf(todo);

        if (index !== 1) {
            todo.setTodo(newContent);
            this._todos[index] = todo;

            this._persist();
        }
    }

    /**
     * Supprime un todo de la liste
     * @param {Todo} todo 
     */
    delete(todo) {
        let index = this._todos.indexOf(todo);
        if (index !== -1) {
            this._todos.splice(index, 1);
        }
        // Appeler la méthode persistence des données
        this._persist();
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

    /**
     * Fait persister les données dans localStorage
     */
    _persist() {
        let datas = [];
        
        for(let index = 0; index < this._todos.length; index++) {
            datas.push(this._todos[index]._todo);
        }

        localStorage.setItem('todos', JSON.stringify(datas));
    }

    /**
     * Charge la liste des todos du localStorage
     */
    _load(){
        let todos = localStorage.getItem('todos');

        if (todos) {
            let jsonTodos = JSON.parse(todos);

            for(let index=0; index < jsonTodos.length; index++) {
                let todo = new Todo(this);
                todo._todo = jsonTodos[index];
                // Et on ajoute à la liste
                this._todos.push(todo);
            }
            console.log('Mes todos : ' + this.toString());

            // Envoyer les todos dans le tableau HTML
            this._render();
        }
    }

    _render() {
        for (let index = 0; index < this._todos.length; index++) {
            let content = this._todos[index]._todo;

            // Et c'est parti pour la reconstruction des lignes
            // Création de la ligne dans le tableau HTML
            let ligne = $('<tr>');

            // Création de la première colonne : boîte à cocher
            let checkboxCol = $('<td>');
            
            // Création d'une boîte à cocher
            let checkbox = $('<input>');
            checkbox.attr('type', 'checkbox')
                .attr('checked', false)
                .addClass('multiSelect');
            
            // Ajoute la boîte à cocher à la colonne
            checkbox.appendTo(checkboxCol);

            // Ajouter la colonne à la ligne en mémoire
            checkboxCol.appendTo(ligne);

            // Création de la deuxième colonne : le texte saisi
            let contentCol = $('<td>');
            contentCol.addClass('inplace');
            contentCol.html(content);
            // Ajouter la colonne à la ligne courante
            contentCol.appendTo(ligne);

            // Création de la troisième colonne : le bouton de suppression
            let deleteCol = $('<td>');

            // Création du bouton de sélection
            let deleteButton = $('<button>');
            deleteButton
                .addClass('deleteBtn')
                .addClass('btn')
                .addClass('btn-outline-danger')
                .attr('type', 'button');

            // Création de l'icône de suppression
            let deleteIcon = $('<span>');
            deleteIcon
                .addClass('icon-bin2');

            // Ajoute l'icône au bouton
            deleteIcon.appendTo(deleteButton);

            // Ajoute le bouton à la colonne
            deleteButton.appendTo(deleteCol);

            // Ajoute la colonne à la ligne
            deleteCol.appendTo(ligne);

            // Ajoute la ligne complète à l'élément tbody
            ligne.appendTo($('tbody'));            
        }
    }

    toString() {
        let message = '';
        // Pour contrôle
        for(let ctrl=0; ctrl < this._todos.length; ctrl++) {
            message += this._todos[ctrl]._todo + '\n';
        }

        return message;
    }
}