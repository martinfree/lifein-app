;var currentnode='/publicaciones/'+key,publicaciones=firebase.database().ref(currentnode),datosdeapoyo={},anim=LI.animation.transition;publicaciones.once('value').then(function(a){if(!a.val()){$('.spinner').fadeOut(anim.fadeOut,function(){$('.lista').delay(anim.delay).fadeIn()})}});firebase.database().ref('/datosdeapoyo').once('value').then(function(a){datosdeapoyo=a.val()});$(document).on('submit','#firebase-form',function(a){a.preventDefault();var e=$(this).serializeObject(),t={},i=$(this).attr('key');,comment=e.comment;delete e.comment;e.aprobado=e.aprobado?1:0;for(var n in e){t[currentnode+'/'+i+'/'+n]=e[n]};$('.spinner').fadeIn(anim.fadeIn,function(){firebase.database().ref(currentnode+'/'+i).once('value').then(function(a){var n=a.val(),i=n.aprobado;firebase.database().ref().update(t,function(a){if(a){console.log(a)}
else{LI.notify({status_ref:i||0,status:e.aprobado,type:'notificacion',user_id:n.usuario_id,title:'Publicación',text:comment});$('#detail').fadeOut(anim.fadeOut,function(){$('.lista').fadeIn(anim.fadeIn,function(){$('.spinner').fadeOut(anim.fadeOut*anim.factor)})})}})})});return!1});$(document).on('click','.add-publicacion',function(a){$('#detail').html($.templates('#form').render({key:null,data:{aprobado:''},aux:LI.aux,datosdeapoyo:datosdeapoyo},LI)).promise().done(function(){$('.lista').fadeOut(anim.fadeOut,function(){$('#detail').delay(200).fadeIn(anim.fadeOut*anim.factor,function(){$('body,html').scrollTop(0)})})})});$(document).on('click','.action.ver',function(){var a=$(this).data('key');$('body').attr('key',a);LI.setScroll();$('.spinner').fadeIn(anim.fadeIn*anim.factor,function(){firebase.database().ref(currentnode+'/'+a).once('value').then(function(a){$('#detail').html($.templates('#form').render({key:a.key,data:a.val(),aux:LI.aux,datosdeapoyo:datosdeapoyo},LI)).promise().done(function(){$('.lista').fadeOut(anim.fadeOut,function(){$('.spinner').fadeOut(anim.fadeOut*anim.factor,function(){$('#detail').delay(200).fadeIn(anim.fadeOut*anim.factor,function(){$('.slider').slick();$('body,html').scrollTop(0)})})})})})})});$(document).on('click','.action.eliminar',function(){var a=$(this).data('key');swal({title:'Borrar página',text:'Seguro que querés eliminar esta página?',type:'warning',showCancelButton:!0,closeOnConfirm:!1,showLoaderOnConfirm:!0,},function(){firebase.database().ref(currentnode+a).remove().then(function(){swal.close()})})});$(document).on('click','.cerrar',function(){$('#detail').fadeOut(anim.fadeOut,function(){$('.lista').delay(anim.delay).fadeIn(anim.fadeIn,function(){LI.resetScroll()})})});publicaciones.on('child_added',(data)=>{$('#list').prepend($.templates('#item').render({key:data.key,data:data.val()},LI.aux)).promise().done(function(){$('#list').find('#'+data.key).animateAdded()});$('.spinner').fadeOut(anim.fadeOut*anim.factor,function(){$('.lista').delay(anim.delay).fadeIn()})});publicaciones.on('child_changed',(data)=>{var index=$('#'+data.key).index();$('#'+data.key).remove();$('#list').insertAt(index,$.templates('#item').render({key:data.key,data:data.val()},LI.aux));$('#'+data.key).animateChanged()});publicaciones.on('child_removed',(data)=>{$('#'+data.key).animateRemoved(function(){$(this).remove()})});