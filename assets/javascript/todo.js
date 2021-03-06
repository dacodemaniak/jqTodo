/**
 * @name todo.js Gestionnaire de tâches
 */

 // Instancie un nouvel objet de la classe TodoList
var todoList = new TodoList();

 /**
  * Gestionnaire d'événement sur la zone de saisie : theTodo
  */
 $('#theTodo').on('keyup', function(event) {
    if ($(this).val().length >= 5 ) {
        $('#ajouter').removeAttr('disabled');
    } else {
        $('#ajouter').attr('disabled', 'disabled');
    }
 });

/**
 * Gestionnaire de validation du formulaire
 */
$('#todo').on('submit', function(event) {
    event.preventDefault(); // Interdire la soumission du formulaire
    // Instancier un objet en Javascript
    var todo = new Todo(todoList); // Création de l'instance de todo
    // Méthodes implicites get et set
    todo.todo = $('#theTodo').val(); // Méthode "set"
    console.log('L\'objet todo contient : ' + todo.todo); // Méthode "get"
    // Méthodes explicites
    //todo.setTodo($('#theTodo').val());
    //console.log('Explicitement, pareil : ' + todo.getTodo());
    console.log(todoList._todos.length);

    // Désactiver le bouton d'ajout
    $('#ajouter').attr('disabled', 'disabled');

    // Effacer la zone de saisie
    let content = $('#theTodo').val();
    $('#theTodo').val('');

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
});

/**
 * Gérer la suppression d'une ligne
 * Attention, l'élément .deleteBtn n'existe
 * pas a priori dans le DOM, on va donc
 * utiliser la délégation d'événement
 */
$('tbody').on('click', '.deleteBtn, .multiSelect, .inplace', function(event) {
    if ($(this).hasClass('deleteBtn')) {
        // Récupérer la valeur du second td de la ligne
        let todoColIndex = $(this).parents('tr').index();
        let todo = todoList.get(todoColIndex);
        todo.delete();

        console.log('Il reste : ' + todoList._todos.length + ' éléments');

        $(this).parents('tr').remove();
        // Là, aussi... un petit toast
        if ($('tbody tr').length == 0) {
            $.toast(
                { 
                    text : 'Tout est fini ! <br> Bravo, bonne journée', 
                    showHideTransition : 'slide',  // It can be plain, fade or slide
                    bgColor : 'blue',              // Background color for toast
                    textColor : '#eee',            // text color
                    allowToastClose : false,       // Show the close button or not
                    hideAfter : 3000,              // `false` to make it sticky or time in miliseconds to hide after
                    stack : 5,                     // `fakse` to show one stack at a time count showing the number of toasts that can be shown at once
                    textAlign : 'left',            // Alignment of text i.e. left, right, center
                    position : 'top-center'       // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values to position the toast on page
                }
            );
        }
    } else {
        if ($(this).hasClass('multiSelect')) {
            // Il s'agit donc d'une boîte à cocher
            if ($('input[type=checkbox]:checked').length > 0) {
                $('#btnMultiDelete').removeAttr('disabled');
            } else {
                $('#btnMultiDelete').attr('disabled', 'disabled');
            }

            // Petite cerise sur le gâteau
            if ($(this).is(':checked')) {
                $(this).parent('td').next('td').addClass('strikedOut');
            } else {
                $(this).parent('td').next('td').removeClass('strikedOut');
            }
        } else {
            if ($(this).hasClass('inplace')) {
                // Récupère le contenu de la colonne
                let content = $(this).html();
                $(this).html('');
                $(this).removeClass('inplace'); // Sinon, bug

                // Génère un champ de saisie
                let input = $('<input>');
                input.addClass('inplace-editing');
                input.val(content);
                input.attr('type', 'text');
                // Remplace le contenu courant par le champ
                input.appendTo($(this));
            }
        }
    }
});

/**
 * Gestionnaire d'événement pour la mise à jour d'un champ inplace
 */
$('tbody').on('keypress', 'tr td', function(event) {
    if (event.keyCode === 13) {


        // Touche entrée... on récupère la colonne concernée
        let currentCol = $(this);
        let input = currentCol.children('input').eq(0);
        let currentContent = input.val();
        console.log('Contenu : ' + currentContent);

        // Récupère l'identifiant de la ligne
        let TRIndex = currentCol.parent('tr').index();
        let todo = todoList.get(TRIndex);

        if (input.val().length > 5) {

            todo.update(currentContent);

            // On s'occupe de la colonne
            input.remove();
            currentCol.html(currentContent);
            currentCol.addClass('inplace');
        } else {
            // Petit toast pour dire à l'utilisateur que c'est pas ok
            input.remove();
            currentCol.html(todo.todo);
            currentCol.addClass('inplace');            
        }
    }
});

/**
 * Suppression multiple des lignes cochées
 */
$('#btnMultiDelete').on('click', function(event) {
    let indice = 0;
    let indices = [];

    $('tbody tr').each(function() {
        let TRIndex = $(this).index();

        let firstCol = $(this).children('td').eq(0);
        let checkbox = firstCol.children('input').eq(0);

        if (checkbox.is(':checked')) {
            console.log('On dégage la ligne : ' + indice);
            //indices.push(indice);
            $(this).remove();
            let todo = todoList.get(TRIndex);
            todo.delete();
        }
        indice++;
    });
    console.log(todoList._todos);
    
    console.log(todoList.toString());

    //todoList.reduce(indices);

    console.log('Il reste : ' + todoList._todos.length + ' éléments dans le tableau');
    // En fin de parcours, si plus aucune ligne... journée finie
    if ($('tbody tr').length == 0) {
        $.toast(
            { 
                text : 'Tout est fini ! <br> Bravo, bonne journée', 
                showHideTransition : 'slide',  // It can be plain, fade or slide
                bgColor : 'blue',              // Background color for toast
                textColor : '#eee',            // text color
                allowToastClose : false,       // Show the close button or not
                hideAfter : 3000,              // `false` to make it sticky or time in miliseconds to hide after
                stack : 5,                     // `fakse` to show one stack at a time count showing the number of toasts that can be shown at once
                textAlign : 'left',            // Alignment of text i.e. left, right, center
                position : 'top-center'       // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values to position the toast on page
            }
        );
    }
    $(this).attr('disabled', 'disabled');
});