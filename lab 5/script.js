class Block {
    toHtml() {
        return '';
    }
}

class TitleBlock extends Block {
    constructor(title) {
        super();
        this.title = title;
    }

    toHtml() {
        return `<h1>${this.title}</h1>`;
    }
}

class BoldBlock extends Block {
    constructor(text) {
        super();
        this.text = text;
    }

    toHtml() {
        return `<h3>${this.text}</h3>`;
    }
}

class TextBlock extends Block {
    constructor(text) {
        super();
        this.text = text;
    }

    toHtml() {
        return `<p>${this.text}</p>`;
    }
}

class ImageBlock extends Block {
    constructor(imageUrl) {
        super();
        this.imageUrl = imageUrl;
    }

    toHtml() {
        return `<img src="${this.imageUrl}" width="200" alt="Image" />`;
    }
}

class EditorBlock extends Block {
    constructor(text, type) {
        super();
        this.text = text;
        this.type = type;
    }

    toHtml() {
        return `<div class="editFields"><b>${this.type}</b><input value="${this.text}"></input></div>`;
    }
}

function generatePage(blocks) {
    return blocks.map(block => block.toHtml()).join('');
}

var edit = false;

function storeData(){
    const inputData = document.querySelectorAll(".editFields");
    var storeData = []
    inputData.forEach((x)=>{
        storeData.push([x.querySelector('b').textContent, x.querySelector('input').value])
    })
    localStorage.setItem("pageBlocks",JSON.stringify(storeData));
}

function toggleEditMode() {
    const x = document.getElementById("contentEditMode");
    const y = document.getElementById("content");
    const editBtn = document.getElementById("editButton");
    const editorButtons = document.getElementById("editorButtons");
    if (edit) {
        addRemoveButtons();
        x.style.display = editorButtons.style.display = "block";
        y.style.display = editBtn.style.display = "none";
    } else {
        storeData();
        loadBlocks();
        x.style.display = editorButtons.style.display = "none";
        y.style.display = editBtn.style.display = "block";
    }
  }

function addElement(type){
    parsedEditorBlocks.push(new EditorBlock('', type))
    document.getElementById('contentEditMode').innerHTML = generatePage(parsedEditorBlocks);
}

const blocks = [
    ["title", "Векс, мрачнистка"],
    ["image", "https://w0.peakpx.com/wallpaper/651/759/HD-wallpaper-video-game-league-of-legends-vex-league-of-legends.jpg"],
    ["text", "В темном сердце Сумрачных островов, где клубится призрачный туман, бродит одинокий йордл. Хмарь и безысходность ее вполне устраивают. Пользуясь неисчерпаемыми запасами подросткового уныния и поддержкой могущественной тени, Векс создала собственный мрачный мирок и старается держаться подальше от безудержного веселья, которым лучатся окружающие ее цивилы. И пусть в жизни ее мало что интересует, она не упускает возможности приглушить яркие краски, а тех, кто захочет ей помешать, ждет знакомство с магией уныния."],
    ["title", "Способности"],
    ["bold", "Физиология йордлов"],
    ["text", "Векс - йордл, существо, пришедшее из царства духов, и обладает рядом способностей, присущих ее виду."],
    ["bold", "Бессмертие"],
    ["text", "Будучи духовными существами, йордлы не стареют так же, как обычные люди, и не могут умереть."],
    ["bold", "Магия йордлов"],
    ["text", "Как и любой йордл, Векс способна к йордльской магии, которую она использует в сочетании со своими навыками работы с тенями и тьмой."],
    ["bold", "Манипуляция тенью"],
    ["text", "Тень Векс разумна и может помогать ей произносить заклинания."],
];

function loadBlocks(){

    var storedBlocks = JSON.parse(localStorage.getItem("pageBlocks"))
    var parsedBlocks = [];
    storedBlocks.forEach((x) => {
        switch (x[0]){
            case "title": parsedBlocks.push(new TitleBlock(x[1])); break;
            case "image": parsedBlocks.push(new ImageBlock(x[1])); break;
            case "bold": parsedBlocks.push(new BoldBlock(x[1])); break;
            case "text": parsedBlocks.push(new TextBlock(x[1])); break;
        }
    })
    var parsedEditorBlocks = [];
    storedBlocks.forEach((x) => {
        parsedEditorBlocks.push(new EditorBlock(x[1], x[0]));
    })
    document.getElementById('content').innerHTML = generatePage(parsedBlocks);
    document.getElementById('contentEditMode').innerHTML = generatePage(parsedEditorBlocks);

}

if (!localStorage.getItem("pageBlocks") || localStorage.getItem("pageBlocks") == '[]'){
    localStorage.setItem("pageBlocks",JSON.stringify(blocks));
}

var storedBlocks = JSON.parse(localStorage.getItem("pageBlocks"))

var parsedBlocks = [];
storedBlocks.forEach((x) => {
    switch (x[0]){
        case "title": parsedBlocks.push(new TitleBlock(x[1])); break;
        case "image": parsedBlocks.push(new ImageBlock(x[1])); break;
        case "bold": parsedBlocks.push(new BoldBlock(x[1])); break;
        case "text": parsedBlocks.push(new TextBlock(x[1])); break;
    }
})
var parsedEditorBlocks = [];
storedBlocks.forEach((x) => {
    parsedEditorBlocks.push(new EditorBlock(x[1], x[0]));
})
document.getElementById('content').innerHTML = generatePage(parsedBlocks);
document.getElementById('contentEditMode').innerHTML = generatePage(parsedEditorBlocks);

document.addEventListener('DOMContentLoaded', function() {
  // Add buttons to existing elements
  
  // Event delegation for dynamically added elements
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-btn')) {
      e.target.closest('.editFields').remove();
    }
  });
});

function addRemoveButtons() {
  document.querySelectorAll('.editFields').forEach(container => {
    if (!container.querySelector('.remove-btn')) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '⨯';
      container.appendChild(removeBtn);
    }
  });
}