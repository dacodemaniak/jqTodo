class Todo {
    /**
     * Constructeur de la classe Todo
     * @param TodoList todoList Liste des choses à faire
     */
    constructor(todoList){
        this._todoList = todoList;
    }

    get id() {
        return this._id;
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
        let _instance = this; // Parce qu'on doit l'utiliser dans la méthode success
        $.ajax({
                url: 'http://127.0.0.1:3000/Todos/' + _instance.id,
                method: 'delete',
                dataType: 'json',
                success: function() {
                    _instance._todoList.delete(_instance);
                },
                error: function(error) {
                    console.log('Erreur levée : ' + JSON.stringify(error));
                }
            }
        )
        
    }

    /**
     * Met à jour le todo courant dans la liste des todos
     */
    update(newContent) {
        let _instance = this;
        $.ajax({
            url: 'http://127.0.0.1:3000/Todos/' + this._id,
            method: 'put',
            data: {title: newContent},
            dataType: 'json',
            success: function(datas) {
                _instance._todoList.update(_instance, newContent);
            },
            error: function() {
                // NOOP
            }
        })
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