;var currentnode='/propuestas/'+key,reservas=firebase.database().ref(currentnode),datosdeapoyo={},anim=LI.animation.transition;reservas.once('value').then(function(e){if(!e.val()){$('.spinner').fadeOut(anim.fadeOut,function(){$('.lista').delay(anim.delay).fadeIn()})}});firebase.database().ref('/datosdeapoyo').once('value').then(function(e){datosdeapoyo=e.val()});$(document).on('submit','#firebase-form',function(e){e.preventDefault();var a=$(this).serializeObject(),t={},o=$(this).attr('key');,comment=a.comment;delete a.comment;a.aprobado=a.aprobado?1:0;for(var n in a){t[currentnode+'/'+o+'/'+n]=a[n]};$('.spinner').fadeIn(anim.fadeIn,function(){firebase.database().ref(currentnode+'/'+o).once('value').then(function(e){var n=e.val(),o=n.aprobado;firebase.database().ref().update(t,function(e){if(e){console.log(e)}
else{LI.notify({status_ref:o||0,status:a.aprobado,type:'alerta',user_id:'all',title:'Propuesta',text:comment});$('#detail').fadeOut(anim.fadeOut,function(){$('.lista').fadeIn(anim.fadeIn,function(){$('.spinner').fadeOut(anim.fadeOut*anim.factor)})})}})})});return!1});$(document).on('click','.add-item',function(e){$('#detail').html($.templates('#form').render({key:null,data:{aprobado:''},aux:LI.aux,datosdeapoyo:datosdeapoyo},LI)).promise().done(function(){$('.lista').fadeOut(anim.fadeOut,function(){$('#detail').delay(200).fadeIn(anim.fadeOut*anim.factor,function(){$('body,html').scrollTop(0)})})})});$(document).on('click','.action.ver',function(){var e=$(this).data('key');$('body').attr('key',e);LI.setScroll();$('.spinner').fadeIn(anim.fadeIn*anim.factor,function(){firebase.database().ref(currentnode+'/'+e).once('value').then(function(e){$('#detail').html($.templates('#form').render({key:e.key,data:e.val(),aux:LI.aux,datosdeapoyo:datosdeapoyo},LI)).promise().done(function(){$('.lista').fadeOut(anim.fadeOut,function(){$('.spinner').fadeOut(anim.fadeOut*anim.factor,function(){$('#detail').delay(200).fadeIn(anim.fadeOut*anim.factor,function(){$('body,html').scrollTop(0)})})})})})})});$(document).on('click','.action.eliminar',function(){var e=$(this).data('key');swal({title:'Borrar reserva',text:'Seguro que querés eliminar esta reserva?',type:'warning',showCancelButton:!0,closeOnConfirm:!1,showLoaderOnConfirm:!0,},function(){firebase.database().ref(currentnode+e).remove().then(function(){swal.close()})})});$(document).on('click','.cerrar',function(){$('#detail').fadeOut(anim.fadeOut,function(){$('.lista').delay(anim.delay).fadeIn(anim.fadeIn,function(){LI.resetScroll()})})});reservas.on('child_added',(data)=>{$('#list').prepend($.templates('#item').render({key:data.key,data:data.val()},LI.aux)).promise().done(function(){$('#list').find('#'+data.key).animateAdded()});$('.spinner').fadeOut(anim.fadeOut*anim.factor,function(){$('.lista').delay(anim.delay).fadeIn()})});reservas.on('child_changed',(data)=>{var index=$('#'+data.key).index();$('#'+data.key).remove();$('#list').insertAt(index,$.templates('#item').render({key:data.key,data:data.val()}));$('#'+data.key).animateChanged()});reservas.on('child_removed',(data)=>{$('#'+data.key).animateRemoved(function(){$(this).remove()})})