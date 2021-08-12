import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, notice, info, success, error, defaultModules } from '@pnotify/core';

import { debounce } from 'lodash';



const inputRef = document.getElementById('searchbar');
const outputRef = document.getElementById('output');
inputRef.addEventListener('input', debounce(onInput, 500));

function onInput() {
outputRef.innerHTML = ''; // очистка блока вывода информации

  fetch(`https://restcountries.eu/rest/v2/name/${inputRef.value}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP status " + response.status); //если статус ответа сервера  не в диапазоне 200-299, генерируем ошибку и передаем управление в catch
    
      }
      return response.json(); //если ошибки нет, возвращается тело ответа в формате json, и обрабатівается в следующем .then 
    })
    .then(data => { // если страна только одна, генерируем разметку с  данными и флагом
      if (data.length === 1) {
        return outputRef.insertAdjacentHTML(
          'beforeend',
          data.map(
            ({
              name,
              capital,
              population,
              languages,
              flag,
            }) => `<h2 class='country-name'>${name}</h2> <div class='wrapper'><ul class = 'markers-off-list left-part'><li> Capital: ${capital}</li>
         <li> Population: ${population}</li> <li>Languages: <ul class='markers-on-list'> ${languages
              .map(el => `<li>${el.name}</li>`)
              .join('')}</li></ul></ul>
          <div class=right-part><img class= 'flag-img' src='${flag}'></div> </div>`,
          ),
        );
      }
      if (data.length > 1 && data.length <= 10) {  // если стран до 10 - генерируем список из 10 стран 
        return outputRef.insertAdjacentHTML(
          'beforeend',
          `<ul class='markers-on-list'>${data
            .map(({ name }) => `<li>${name}</li>`)
            .join('')} </ul>`,
        );
      }
      return error({ text: 'Too many matches found. Please, enter a more specific query' }); //если сопадений много  
    })
    .catch(err=>error({ text: err})); // выводим сообщение об ошибке
}

