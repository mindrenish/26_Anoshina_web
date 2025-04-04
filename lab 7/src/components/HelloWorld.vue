<template>
  <div class="editor-container">
    <header>
      <nav id="navMenu">
        <div class="menuButton" @click="fetchData('GET')">GET</div>
        <div class="menuButton" @click="fetchData('POST')">POST</div>
      </nav>

      <div class="popup">
        <span class="popuptext" :class="{ show: popupVisible }">{{ popupText }}</span>
      </div>

      <button v-if="!editMode" id="editButton" @click="enterEditMode">✎ Редактировать</button>

      <div v-else id="editorButtons">
        <div class="editorPanel">
          <button v-for="type in blockTypes" 
                  :key="type" 
                  class="add-button"
                  @click="addBlock(type)">
            {{ typeLabels[type] }}
          </button>
        </div>
        <button id="applyButton" @click="applyChanges">✓ Применить</button>
      </div>
    </header>

    <main>
      <div v-if="!editMode" id="content">
        <template v-for="(block, index) in renderedBlocks" :key="index">
          <h1 v-if="block.type === 'title'">{{ block.content }}</h1>
          <img v-else-if="block.type === 'image'" :src="block.content" width="200" alt="Image" />
          <h3 v-else-if="block.type === 'bold'">{{ block.content }}</h3>
          <p v-else-if="block.type === 'text'">{{ block.content }}</p>
        </template>
      </div>

      <div v-else id="contentEditMode">
        <div v-for="(block, index) in editBlocks" :key="index" class="editFields">
          <b>{{ block.type }}</b>
          <input v-model="block.content" />
          <button class="remove-btn" @click="removeBlock(index)">⨯</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    // Состояние компонента
    const editMode = ref(false);
    const popupVisible = ref(false);
    const popupText = ref('');
    const storedBlocks = ref([]);

    // Типы блоков и их метки
    const blockTypes = ['title', 'image', 'bold', 'text'];
    const typeLabels = {
      title: 'Заголовок',
      image: 'Картинка',
      bold: 'Подзаголовок',
      text: 'Текст'
    };

    // Загружаем данные из localStorage при инициализации
    onMounted(() => {
      const savedBlocks = localStorage.getItem("pageBlocks");
      if (!savedBlocks || savedBlocks === '[]') {
        const defaultBlocks = [
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
        localStorage.setItem("pageBlocks", JSON.stringify(defaultBlocks));
        storedBlocks.value = defaultBlocks;
      } else {
        storedBlocks.value = JSON.parse(savedBlocks);
      }
    });

    // Блоки для редактирования
    const editBlocks = computed(() => {
      return storedBlocks.value.map(block => ({
        type: block[0],
        content: block[1]
      }));
    });

    // Рендер блоков
    const renderedBlocks = computed(() => {
      return storedBlocks.value.map(block => ({
        type: block[0],
        content: block[1]
      }));
    });

    // Методы компонента
    const enterEditMode = () => {
      editMode.value = true;
    };

    const applyChanges = () => {
      const newBlocks = editBlocks.value.map(block => [block.type, block.content]);
      localStorage.setItem("pageBlocks", JSON.stringify(newBlocks));
      storedBlocks.value = newBlocks;
      editMode.value = false;
    };

    const addBlock = (type) => {
      editBlocks.value.push({
        type,
        content: type === 'image' ? 'https://via.placeholder.com/200' : 'Новый текст'
      });
    };

    const removeBlock = (index) => {
      editBlocks.value.splice(index, 1);
    };

    const showPopup = (text) => {
      popupText.value = text;
      popupVisible.value = true;
      setTimeout(() => {
        popupVisible.value = false;
      }, 3000);
    };

    const fetchData = async (method) => {
      try {
        let response;
        if (method === 'GET') {
          response = await fetch("https://catfact.ninja/fact", { method: "GET" });
        } else if (method === 'POST') {
          response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify({
              title: 'foo',
              body: 'bar',
              userId: 1,
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          });
        }

        if (!response.ok) {
          throw new Error('Error: ' + response.status);
        }

        const json = await response.json();
        showPopup(method === 'GET' ? json.fact : 'POST успешно выполнен');
      } catch (error) {
        console.error(error.message);
        showPopup('Ошибка: ' + error.message);
      }
    };

    return {
      editMode,
      popupVisible,
      popupText,
      blockTypes,
      typeLabels,
      editBlocks,
      renderedBlocks,
      enterEditMode,
      applyChanges,
      addBlock,
      removeBlock,
      fetchData
    };
  }
};
</script>

<style scoped>
/* Стили остаются без изменений */
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

.editor-container {
  font-family: Arial, sans-serif;
  width: 500px;
  margin: 20px auto; /* Автоматические отступы по бокам для центрирования */
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1); /* Необязательно: добавляет тень для лучшего визуального восприятия */
}

h1, h3 {
  color: #333;
}

p {
  color: #555;
  margin: 10px 0;
  line-height: 1.5;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px 0;
}

#editButton, #applyButton, .add-button, .remove-btn {
  text-align: center;
  cursor: pointer;
  user-select: none;
  font-size: 24px;
  height: auto;
  color: ivory;
  border-radius: 5px;
  border: none;
  padding: 5px 10px;
  margin: 5px 0;
}

#editButton {
  display: block;
  background: rgb(115, 94, 127);
  width: 250px;
}

#applyButton {
  background: rgb(94, 127, 99);
  width: 250px;
}

.add-button {
  background: darkgrey;
  margin: 3px;
  padding: 3px;
}

.remove-btn {
  background: rgb(221, 160, 160);
  width: 30px !important;
}

#editorButtons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.editFields {
  display: flex;
  justify-content: space-between;
  padding: 5px;
  align-items: center;
  margin: 5px 0;
}

.editorPanel {
  display: flex;
  flex-wrap: wrap;
}

#navMenu {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.menuButton {
  background: rgb(34, 34, 34);
  color: white;
  width: 60px;
  height: auto;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
}

/* Pop-ups */
.popup {
  position: absolute;
  display: block;
  cursor: pointer;
  user-select: none;
}

.popup .popuptext {
  visibility: hidden;
  width: 320px;
  margin: 10px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 200%;
  margin-left: -80px;
}

.popup .show {
  visibility: visible;
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>