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