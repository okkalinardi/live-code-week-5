const mainUrl = 'http://localhost:3000'

$( document ).ready(function() {
    if(localStorage.getItem('token')) {
        $('#loginForm').hide()
        $('#registerForm').hide()
        $('#main-part').show()
        $('#btn-logout').show()
        getComics()
    } else {
        $('#registerForm').hide()
        $('#main-part').hide()
        $('#btn-logout').hide()
    }

    $('#alert').hide()
    $('#updateForm').hide()
    
})

$(document).on('click', '#btn-logout', function(e) {
    $('#alert').hide()
    e.preventDefault()
    localStorage.clear()
    $('#loginForm').show()
    $('#registerForm').hide()
    $('#main-part').hide()
    $('#btn-logout').hide()
    $('#comic-part').html('')
    $('#email').val('')
    $('#password').val('')
    $('#title').val('')
    $('#author').val('')
    $('#imageUrl').val('')
    $('#edit-id').val('')
    $('#updateForm').hide()

})

$(document).on('click', '#registerButton', function(e) {
    e.preventDefault()
    $('#loginForm').hide()
    $('#registerForm').show()
})

$(document).on('click', '#loginButton', function(e) {
    e.preventDefault()
    $('#loginForm').show()
    $('#registerForm').hide()
})

$(document).on('click', '#submitLogin', function(e) {
    e.preventDefault()
    let data = {
        email: $('#email').val(),
        password: $('#password').val()
    }
    login(data)
})

function login(data) {
    $.ajax({
        url: mainUrl + '/login',
        method: 'post',
        data: data,
        success: function(token) {
            $('#alert').hide()
            localStorage.setItem('token', token)
            $('#email').val('')
            $('#password').val('')
            $('#loginForm').hide()
            $('#main-part').show()
            $('#btn-logout').show()
            getComics()
        },
        error: function(err) {
            notification(err.responseText)
        }
    })
}

function getComics() {
    $.ajax({
        url: mainUrl + '/comics',
        method: 'get',
        headers: {
            token: localStorage.getItem('token')
        },
        success: function(comicDatas) {
            $('#alert').hide()
            $('#comic-part').html('')
            comicDatas.forEach(element => {
                $('#comic-part').append(`
                <div class="col-4 mb-4">
            <div class="card text-center">
              <img
                src="${element.imageUrl}"
                class="card-img-top">
              <div class="card-body">
                <h5 class="card-title">${element.title}</h5>
                <p class="card-text">Author: ${element.author}</p>
                <button class="btn btn-primary" id="edit-${element.id}">Edit</button>
              </div>
            </div>
          </div>
        </div>
            `)

            $(document).on('click', `#edit-${element.id}`, function(e) {
                e.preventDefault()
                $('#title').val(element.title)
                $('#author').val(element.author)
                $('#imageUrl').val(element.imageUrl)
                $('#edit-id').val(element.id)
                $('#updateForm').show()
            })
            })
            
        },
        error: function(err) {
            notification(err.responseText)
        }
    })
}

$(document).on('click', '#btn-update', function(e) {
    e.preventDefault()
    let updateData = {
        title: $('#title').val(),
        author: $('#author').val(),
        imageUrl: $('#imageUrl').val() 
    }
    editComic($('#edit-id').val(), updateData)
})

function editComic(id, data) {
    $.ajax({
        url: mainUrl + '/comics/' + id,
        method: 'put',
        headers: {
            token: localStorage.getItem('token')
        },
        data: data,
        success: function(updatedComic) {
            $('#alert').hide()
            getComics()
            $('#updateForm').hide()
        },
        error: function(err) {
            notification(err.responseText)
        }
    })
}

$(document).on('click', '#registerSubmit', function(e) {
    e.preventDefault()
    let data = {
        name: $('#registName').val(),
        email: $('#registEmail').val(),
        password: $('#registPassword').val()
    }
    register(data)
})

function register(data) {
    $.ajax({
        url: mainUrl + '/register',
        method: 'post',
        data: data,
        success: function(token){
            localStorage.setItem('token', token)
            $('#alert').hide()
            $('#registName').val('')
            $('#registEmail').val('')
            $('#registPassword').val('')
            $('#loginForm').hide()
            $('#main-part').show()
            $('#btn-logout').show()
            $('#registerForm').hide()
            getComics()
        },
        error: function(err) {
            if(err.responseText == `"Validation error: [object SequelizeInstance:User]"`) {
                notification('Email has already been used before')
            } else {
                notification(err.responseText)
            }
        }
    })
}

$(document).on('click', '#randomUserButton', function(e) {
    e.preventDefault()
    randomUser()
})

function randomUser() {
    $.ajax({
        url: 'https://randomuser.me/api/',
        method: 'get',
        success: function(data) {
            // console.log(data)
            $('#registName').val(`${data.results[0].name.first} ${data.results[0].name.last}`)
            $('#registEmail').val(`${data.results[0].email}`)
            $('#registPassword').val(`${data.results[0].login.password}`)
        },
        error: function(err) {
            notification(err.responseText)
        }
      });
}

function notification(msg){
    $('#alert').html(`${msg}`)
    $('#alert').show()
    setTimeout(function(){ $('#alert').hide(); $('#alert').html('');}, 5000)
}