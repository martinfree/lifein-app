;var currentnode='/implementaciones',implementaciones=firebase.database().ref(currentnode),datosdeapoyo={},anim=LI.animation.transition;implementaciones.once('value').then(function(e){if(!e.val()){$('.spinner').fadeOut(anim.fadeOut,function(){$('.lista').delay(anim.delay).fadeIn()})}});firebase.database().ref('/datosdeapoyo').once('value').then(function(e){datosdeapoyo=e.val()});$(document).on('submit','#firebase-form',function(e){e.preventDefault();var a=$(this).serializeObject(),t=$(this).attr('key'),r=$(this).attr('administrador-key'),d=$(this).attr('seguridad-key'),s=null,i=null,o=null,n={implementacion:{aprobado:(a.implementacion_aprobado?1:0),email:$.trim(a.implementacion_email).toLowerCase(),direccion:$.trim(a.implementacion_direccion),geo:{lat:$('#implementacion_direccion').attr('lat')||0,lng:$('#implementacion_direccion').attr('lng')||0},sitioweb:$.trim(a.implementacion_web),telefono:$.trim(a.implementacion_telefono),titulo:$.trim(a.implementacion_titulo),modificado:moment().format('X')},administrador:{aprobado:(a.administrador_aprobado?1:0),email:$.trim(a.administrador_email).toLowerCase(),nombre:$.trim(a.administrador_nombre),apellido:$.trim(a.administrador_apellido),telefono:$.trim(a.administrador_telefono),modificado:moment().format('X'),administrador:1},seguridad:{aprobado:(a.seguridad_aprobado?1:0),email:$.trim(a.seguridad_email).toLowerCase(),nombre:$.trim(a.seguridad_nombre),apellido:$.trim(a.seguridad_apellido),telefono:$.trim(a.seguridad_telefono),modificado:moment().format('X'),seguridad:1}};if(!t){t=implementaciones.push().key};$('.spinner').fadeIn(anim.fadeIn,function(){return new Promise(function(e,a){return firebase.database().ref('/cuentas/'+t).once('value',function(a){var n={};a.forEach(function(e){n['/cuentas/'+t+'/'+e.key+'/administrador']=0;n['/cuentas/'+t+'/'+e.key+'/seguridad']=0});return firebase.database().ref().update(n,function(a){e()})})}).then(function(){return firebase.database().ref('/cuentas/'+t).orderByChild('email').equalTo(n.administrador.email).once('value',function(e){var r=e.val();if(r){var o=Object.keys(r)[0],a=r[o];for(var d in n.administrador){a[d]=n.administrador[d]}}
else{var a=n.administrador;o=firebase.database().ref('/cuentas/'+t).push().key;i=!0};return firebase.database().ref('/cuentas/'+t+'/'+o).set(a).then(function(){return!0})})}).then(function(){return new Promise(function(e,a){if(i){var t=n.administrador;t.implementacion=n.implementacion.titulo;t.password=LI.randomString(12);return LI.createAccount('email_admin',t).then(function(a){e()})}
else{e()}})}).then(function(){return firebase.database().ref('/cuentas/'+t).orderByChild('email').equalTo(n.seguridad.email).once('value',function(e){var r=e.val();if(r){var i=Object.keys(r)[0],a=r[i];for(var d in n.seguridad){a[d]=n.seguridad[d]}}
else{var a=n.seguridad;i=firebase.database().ref('/cuentas/'+t).push().key;o=null};return firebase.database().ref('/cuentas/'+t+'/'+i).set(a).then(function(){return!0})})}).then(function(){return new Promise(function(e,a){if(o){var t=n.seguridad;t.implementacion=n.implementacion.titulo;t.password=LI.randomString(12);return LI.createAccount('email_seguridad',t).then(function(){e()})}
else{e()}})}).then(function(){return firebase.database().ref(currentnode+'/'+t).update(n.implementacion,function(e){if(e){swal('Error',e,'error')}
else{$('.spinner').fadeOut(anim.fadeOut*anim.factor,function(){$('#detail').fadeOut(anim.fadeOut,function(){$('.lista').fadeIn(anim.fadeIn,function(){LI.resetScroll();if(i||o){swal({title:'Implementaciones',text:'La implementación ha sido actualizada. '+(i?'<br>Se ha enviado una notificación de bienvenida con los datos de ingreso al administrador.':'')+(o?'<br>Se ha enviado una notificación de bienvenida con los datos de ingreso al seguridad.':''),type:'success',html:!0})}})})})}})})});return!1});$(document).on('click','.users-close',function(e){$('.list-users-backdrop').fadeOut()});$(document).on('keyup','.users-filter',function(e){var a=$(this).val();$('.list-users div').each(function(){if($(this).text().indexOf(a)>-1){$(this).fadeIn(100)}
else{$(this).fadeOut(100)}})});$(document).on('click','.custom-list-user',function(e){$(this).siblings().removeClass('selected');$(this).addClass('selected');var a=$(this).parent().parent().parent().parent().find('.select-user').data('target'),n=$(this).data('prop');$('.'+a).find('.nombre').val(n.nombre);$('.'+a).find('.apellido').val(n.apellido);$('.'+a).find('.email').val(n.email);$('.'+a).find('.telefono').val(n.telefono);$('.list-users-backdrop').fadeOut()});$(document).on('click','.select-user',function(e){var a=this,n=$('#firebase-form').attr('key');firebase.database().ref('/cuentas/'+n).once('value',function(e){$(a).next().find('.list-users').html($.templates('#list_users').render({data:e.val(),selected:$('#firebase-form').attr($(a).data('target')+'-key')},LI.aux)).promise().done(function(){$(a).next().fadeIn()})})});$(document).on('click','.add-item',function(e){$('#detail').html($.templates('#form').render({key:null,datosdeapoyo:datosdeapoyo},LI)).promise().done(function(){$('.lista').fadeOut(anim.fadeOut,function(){$('#detail').delay(200).fadeIn(anim.fadeOut*anim.factor,function(){$('body,html').scrollTop(0);LI.initAutocomplete('implementacion_direccion')})})})});$(document).on('click','.action.editar',function(){var e=$(this).data('key');$('body').attr('key',e);LI.setScroll();$('.spinner').fadeIn(anim.fadeIn*anim.factor,function(){return new Promise(function(a,n){return firebase.database().ref(currentnode+'/'+e).once('value').then(function(n){var t=n.val();return firebase.database().ref('/cuentas/'+e).once('value',function(e){var o=e.val(),i={key:n.key,implementacion:t,admin:null,seguridad:null,datosdeapoyo:datosdeapoyo};if(o){e.forEach(function(e){var a=e.val();if(a.administrador){i.admin=a;i.admin.key=e.key}
else if(a.seguridad){i.seguridad=a;i.seguridad.key=e.key}});a(i)}
else{a(i)}})})}).then(function(e){$('#detail').html($.templates('#form').render(e,LI)).promise().done(function(){$('.lista').fadeOut(anim.fadeOut,function(){$('.spinner').fadeOut(anim.fadeOut*anim.factor,function(){$('#detail').delay(200).fadeIn(anim.fadeOut*anim.factor,function(){$('body,html').scrollTop(0);LI.initAutocomplete('implementacion_direccion');if(e.implementacion.geo){$('#implementacion_direccion').attr('lat',e.implementacion.geo.lat).attr('lng',e.implementacion.geo.lng)}})})})})})})});$(document).on('click','.action.eliminar',function(){var e=$(this).data('key');swal({title:'Atención',text:'Se eliminará esta implementación y sus administradores de forma permanente. ¿Desea continuar?',type:'warning',showCancelButton:!0,closeOnConfirm:!1,showLoaderOnConfirm:!0,},function(){firebase.database().ref('implementaciones/'+e).remove().then(function(){swal.close()})})});$(document).on('click','.cerrar',function(){$('#detail').fadeOut(anim.fadeOut,function(){$('.lista').delay(anim.delay).fadeIn(anim.fadeIn,function(){LI.resetScroll()})})});implementaciones.on('child_added',(data)=>{$('#list').prepend($.templates('#item').render({key:data.key,data:data.val()},LI.aux)).promise().done(function(){$('#list').find('#'+data.key).animateAdded()});$('.spinner').fadeOut(anim.fadeOut*anim.factor,function(){$('.lista').delay(anim.delay).fadeIn()})});implementaciones.on('child_changed',(data)=>{var index=$('#'+data.key).index();$('#'+data.key).remove();$('#list').insertAt(index,$.templates('#item').render({key:data.key,data:data.val()},LI.aux));$('#'+data.key).animateChanged()});implementaciones.on('child_removed',(data)=>{$('#'+data.key).animateRemoved(function(){$(this).remove()})})