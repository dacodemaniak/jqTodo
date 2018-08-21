/**
 * @name todo.js Gestionnaire de tâches
 */

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
$('tbody').on('click', '.deleteBtn, .multiSelect', function(event) {
    if ($(this).hasClass('deleteBtn')) {
        $(this).parents('tr').remove();
    } else {
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
    }
});