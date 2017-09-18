  var currentnode = '/publicaciones/'+key
  , publicaciones = firebase.database().ref(currentnode)
  , datosdeapoyo = {}  
  , anim = helper.animation

  publicaciones.once('value').then(function(datos) {
    if(!datos.val()){
      $('.spinner').fadeOut(anim.transition.fadeOut, function(){
        $('.lista').delay(anim.transition.delay).fadeIn()
      })    
    }
  })

  firebase.database().ref('/datosdeapoyo').once('value').then(function(datos) {
    datosdeapoyo = datos.val()
  })


  $(document).on('submit','#firebase-form',function(e){
    e.preventDefault()
    
    var data = $(this).serializeObject()
    , updates = {}
    , key = data.tag 

    if(!data.tag){
      return swal("Se necesitan mas datos", "Ingresa etiqueta","warning")
    }

    delete data.tag 
      
    updates[currentnode +'/' + key] = data

    $('.spinner').fadeIn(anim.transition.fadeIn, function(){
      firebase.database().ref().update(updates, function(error){
        if(error){
          console.log(error)
        }else{
          $('#detail').fadeOut(anim.transition.fadeOut,function(){
            $('.lista').fadeIn(anim.transition.fadeIn,function(){
              //helper.resetScroll()
              $('.spinner').fadeOut(anim.transition.fadeOut*anim.transition.factor)
            })
          }) 
        }
      })
    })

    return false  
  })

  $(document).on('click','.add-publicacion',function(e){
    $('#detail').html($.templates('#form').render({key:null,data:{estado:""},aux:helper.aux.publicaciones,datosdeapoyo:datosdeapoyo},helper)).promise().done(function(){
      $('.lista').fadeOut(anim.transition.fadeOut,function(){
        $('#detail').delay(200).fadeIn(anim.transition.fadeOut*anim.transition.factor,function(){
          $('body,html').scrollTop(0)
        })
      })    
    })  
  })

  $(document).on('click','.action.ver',function(){
    var key = $(this).data('key')
    $('body').attr('key',key)
    helper.setScroll()
    $('.spinner').fadeIn(anim.transition.fadeIn*anim.transition.factor, function(){  
      firebase.database().ref(currentnode +'/'+key).once('value').then(function(publicacion) {
        console.log(publicacion.val())
        $('#detail').html($.templates('#form').render({key:publicacion.key,data:publicacion.val(),aux:helper.aux.publicaciones,datosdeapoyo:datosdeapoyo},helper)).promise().done(function(){
          $('.lista').fadeOut(anim.transition.fadeOut,function(){
            $('.spinner').fadeOut(anim.transition.fadeOut*anim.transition.factor,function(){                    
              $('#detail').delay(200).fadeIn(anim.transition.fadeOut*anim.transition.factor,function(){
                $('body,html').scrollTop(0)
              })
            })
          })
        })
      })
    })
  })

  $(document).on('click','.action.eliminar',function(){
    var key = $(this).data('key')
    swal({   
      title: "Borrar página",   
      text: "Seguro que querés eliminar esta página?",
      type: "warning",
      showCancelButton: true,   
      closeOnConfirm: false,   
      showLoaderOnConfirm: true,
    }, function(){    
      firebase.database().ref(currentnode + key).remove().then(function(){
        swal.close()
      })
    })
  })  

  $(document).on('click','.cerrar',function(){
    $('#detail').fadeOut(anim.transition.fadeOut,function(){
      $('.lista').delay(anim.transition.delay).fadeIn(anim.transition.fadeIn,function(){
        helper.resetScroll()
      })
    })
  })  

  // live fb handlers
  publicaciones.on('child_added', (data) => {
    $('#list').prepend($.templates('#item').render({key:data.key,data:data.val()}, helper.aux.publicaciones)).promise().done(function(){
      $('#list').find('#'+data.key).animateAdded()
    })  
    $('.spinner').fadeOut(anim.transition.fadeOut*anim.transition.factor, function(){
      $('.lista').delay(anim.transition.delay).fadeIn()
    })
  })

  publicaciones.on('child_changed', (data) => {
    var index = $('#'+data.key).index()
    $('#'+data.key).remove()
    $('#list').insertAt(index, $.templates('#item').render({key:data.key,data:data.val()}))
    $('#'+data.key).animateChanged()
  })

  publicaciones.on('child_removed', (data) => {
    $('#'+data.key).animateRemoved(function(){
      $(this).remove()  
    })    
  })