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
        let _instance = this;

        $.ajax({
            url: 'http://127.0.0.1:3000/Todos',
            method: 'post',
            dataType: 'json',
            data: {title: todo._todo},
            success: function(datas) {
                let data = datas[0]; // Récupère la ligne de la base
                let todo = new Todo(_instance);
                todo._id = data.id;
                todo._todo = data.title;
                _instance._todos.push(todo);
            },
            error: function(error) {
                console.log('Erreur levée : ' + JSON.stringify(error));
            }
        });
    }

    /**
     * Met à jour le todo et sauvegarde l'ensemble
     * @param {Todo} todo 
     * @param {String} newContent 
     */
    update(todo, newContent) {
        console.log('Mise à jour du Todo dans le tableau : ' + todo.id);
        let index = this._todos.indexOf(todo);

        if (index !== 1) {
            todo.setTodo(newContent);
            this._todos[index] = todo;
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
     * Récupère la liste des todos à partir de l'API REST
     *  GET http://127.0.0.1:3000/Todos
     */
    _load(){
        // Méthode $.ajax de jQuery
        let _instance = this; // Pour passer l'objet courant dans la méthode success

        $.ajax({
            url: 'http://127.0.0.1:3000/Todos',
            method: 'get',
            dataType: 'json',
            success: function(datas) {
                // Okay, tu m'as retourné les données de la base
                for (let data of datas) { // Boucle sur toutes les lignes retournées
                    let todo = new Todo(_instance);
                    todo._id = data.id;
                    todo._todo = data.title;
                    _instance._todos.push(
                        todo
                    );
                }
                // On affiche le résultat...
                _instance._render();
            },
            error: function(error) {
                console.log('L\'appel ajax a échoué ' + error);
            }
        });
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