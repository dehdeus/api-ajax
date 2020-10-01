window.onload = () => {

    const $ = selection => {
        return document.querySelectorAll(selection).length === 1
        ? document.querySelector(selection)
        : document.querySelectorAll(selection)
    }

    const addContentAsHTML = (selector, content) => $(selector).innerHTML += content;

    const clearAllDinamicContent = () => {
        let dinamicContent = [githubEmojisContent, userContent, reposContent];
        for (item of dinamicContent) {
            $(item).innerHTML = '';
        }
    }

    let githubEmojisContainer = '<section id="githubEmojisContainer" class="my-3"><div id="githubEmojisContent"></div></section>';

    addContentAsHTML('main', githubEmojisContainer);
    let githubEmojisContent = '#githubEmojisContent';

    let userContainer = '<section id="userContainer" class="my-3"><div id="userContent" class="d-flex flex-column flex-md-row flex-nowrap-md-wrap justify-content-between align-items-start"></div></section>';

    addContentAsHTML('main', userContainer);
    let userContent = '#userContent';

    let reposContainer = '<section id="userContainer" class="my-3"><div id="userContent" class="d-flex flex-column flex-md-row flex-nowrap-md-wrap justify-content-between align-items-start"></div></section>';

    addContentAsHTML('main', reposContainer);
    let reposContent = '#reposContent';

    const makeRequest = () => {
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
          request = new XMLHttpRequest()
        } else if (window.ActiveXObject) { // IE
          try {
            request = new ActiveXObject('Msxml2.XMLHTTP')
          } catch (e) {
            try {
              request = new ActiveXObject('Microsoft.XMLHTTP')
            } catch (e) {
              console.error(e);
              alert('Por favor, acesse esse site de um navegador mais recente');
              return;
            }
          }
        }
        return request
      }

    getEmojis = () => {
        xhr = makeRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                clearAllDinamicContent();
                emojis = JSON.parse(this.responseText);
                //console.log(emojis);
                let content = `
                <style>
                    .emoji-title{
                        text-overflow: ellipsis;
                        -webkit-line-clamp: 1;
                        overflow: hidden;
                        max-width:100%;
                    }
                </style>
                <article class="emojis">
                    <h2>emojis</h2>
                    <ul type="none" class="row col-12 px-0 py-3 mx-0">
                `;
            for (let prop in emojis) {
                //console.log(emojis[prop]);
                content += `
                        <li id="${prop}" class="col-6 col-sm-4 col-md-3 col-lg-2 my-3">
                            <div class"d-flex flex-column flex-nowrap justify-content-center align-items-center p-3 bg-light border rounded-lg">
                                <img src="${emojis[prop]}" width="50" height="50"/>
                                <small class="text-center mt-3 text-black-50 font-weight-bold emoji-title>${prop}</small>
                            </div>
                        </li>
                `;
            }
                content += `
                    </ul>
                </article>
                `;
                addContentAsHTML(githubEmojisContent, content)
            }
        }
        xhr.open('GET', `https://api.github.com/emojis`, true);
        xhr.send();
    }

    getUserInfos = username => {
       xhr = makeRequest();
       xhr.onreadystatechange = function() {
           if(this.readyState === 4 &&  this.status === 200) {
               clearAllDinamicContent();
               infos = JSON.parse(this.responseText);
               let createdAt = new Date(infos.created_at).toLocaleDateString(),
               updateAt = new Date(infos.update_at).toLocaleDateString(),
               nome = infos.login.replace(/-/g, ' '),
               bio = infos.bio,
               avatar = infos.avatar_url;
            let content = `
                <img src="${avatar} alt="Imagem de perfil do user ${nome}" height="120'width="120" class="rounded-cicle mx-auto ml-md-0 mr-md-2 border-primary">
                <div class="col-12 col-md-10 mt-5 mt-md-3 ml-md-auto px-0>
                    <h2>${nome}</h2>
                    <small>desde: ${createdAt} | Última Atualização ${updateAt}</small>
                </div>
                <div class="col-12 my-3 px-0 d-flex flex-column">
            `;
            if(bio !== null) {
                content += `
                <p class="col-12 px-0 my-2 order-0 order-md-2">${bio}</p>
                `;
            }
            content += `
                </div>
            `;

            addContentAsHTML(userContent, content)

           } else if (this.readyState === 4 &&  this.status !== 200) {
               clearAllDinamicContent();
               let content = `
               <article>
               <h2>O usuário ${username.replace('-', ' ')} não existe!</h2>
               </article>
               `;
               addContentAsHTML(userContent, content)
           }
        };
        xhr.open('GET', `https://api.github.com/users/${username}`, true);
        xhr.send();
    }

    gerUserRepos = (username, page = 1, type = 'public', sort = 'updated', direction = 'desc', per_page = 10) => {
        xhr = makeRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState === 4 && this.status === 200) {
                repos = JSON.parse(this.responseText);
                if (page ===1) {
                    clearAllDinamicContent();
                }
                let content = '';
                content += `
                <article class="repos">
                    <h2>Repositórios de ${username.replace(/-/g, ' ')}</h2>
                    <ul class="col-12 px-0 py-3 mx-0 my-3" type="none" id="repoList">
                `;
                for (repo of repos) {
                    let createdAt = new Date(repo.created_at).toLocaleDateString(),
                        updateAt = new Date(repo.update_at).toLocaleDateString(),
                        name = repo.name.replace(/-/g, ' ');
                
                    content += `
                    <li>
                        <div class="repo-item">
                            <h2>${name}</h2>
                    `;
                    if(repo.language !== null) {
                        content += `
                            <span class="badge badge-pill badge-dark mt-o mb-2 mr-2 py-1 px-2>
                            ${repo.language}
                            </span>
                            <br/>
                        `;
                    }
                    content += `
                            <span class="badge badge-pill badge-light my-2 mr-2 py-1 px-2>
                            Criado em ${createdAt}
                            </span>
                            <span class="badge badge-pill badge-light my-2 mr-2 py-1 px-2>
                            Modificado em ${updatedAt}
                            </span>
                        `;
                        if(repo.description !== null) {
                            content += `<p>${repo.description}</p>`;
                        }
                    content += `
                        </div>
                    </li>
                    `;
                }
                content += `
                    </ul>
                    </article>
                `;
                addContentAsHTML(reposContent, content)
            }
        }
        xhr.open('GET', `https://api.github.com/users/${username}/repos?type=${type}&sort=${sort}&direction=${direction}&per_page=${per_page}&page=${page}`, true);
        xhr.send()
    }
} 

