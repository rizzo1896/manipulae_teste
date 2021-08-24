## Como acessar o webapp

- Eu tive problemas ao fazer requisições a API da deezer com o app no netlify, então estou tendo que utilizar esse recurso do "cors-anywhere" para visualizar todos os dados.

- Primeiro acesse esse link "https://cors-anywhere.herokuapp.com" e clique no botao "Request temporary access..."
![Screenshot](cors.png)

- Apos clicar irá aparecer essa mensagem, informando que o acesso está liberado
![Screenshot](cors-after-click.png)

- Agora é só entrar no link do webApp, aqui: https://manipulae-teste.netlify.app

- Sobre o design mobile apenas implementei o tamanho 425px de largura, pois não tive tempo suficiente.
- Usando a ferramenta de desenvolvedor e colocando em 425px de largura você verá o estado mobile.
- 
- Caso queira rodar o app a partir do codigo, baixe a extensão do chrome "Allow CORS: Access-Control-Allow-Origin" neste link "https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf" e ative clicando no icone da extensão e apos isso clique em "toggle ON|OFF", tambem deverá comentar uma função na linha 50 do arquivo "index" da pasta "MusicList".
