/**

MIT License

Copyright (c) 2021 Matthias de Clerk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

// some modifications made by Andy Chamberlain


const container = document.querySelector(".container");
let items = [...container.querySelectorAll(".item")];

let candidateItem = null;
let selectedItem = null;
let draggedItem = null;

let initialItemY = 0;
let initialClientY = 0;
let currentClientY = 0;

const getTranslateY = (item) =>
    parseFloat(item.style.transform.match(/-?\d+\.?\d*/)[0]);

const setTranslateY = (item, y) =>
(item.style.transform = `translateY(${y}px)`);

const sortItemsByY = () => {
    const calcReferenceY = (item) => {
        if (item === draggedItem) return currentClientY - container.offsetTop;
        return getTranslateY(item) + item.offsetHeight / 2;
    };
    items.sort((a, b) => calcReferenceY(a) - calcReferenceY(b));
}

const layoutItems = () => items.reduce((y, item) => {
    if (item !== draggedItem) setTranslateY(item, y);
    return y + item.offsetHeight;
}, 0);

const reorderStart = (item, clientY) => {
    candidateItem = item;
    initialItemY = getTranslateY(item);
    initialClientY = clientY + window.scrollY;
    updateColors();
}

const reorderMove = (clientY) => {
    if (candidateItem) { //start dragging
        draggedItem = candidateItem;
        draggedItem.classList.add("item-dragged");
        candidateItem = null;
    }
    if (draggedItem) { //dragging
        currentClientY = clientY + window.scrollY;
        const newY = initialItemY + (currentClientY - initialClientY);
        setTranslateY(draggedItem, newY);
        sortItemsByY();
        layoutItems();
    }
};

const reorderEnd = () => {
    if (candidateItem) { //click event
        if (selectedItem) selectedItem.classList.remove("item-selected");
        selectedItem = candidateItem;
        selectedItem.classList.add("item-selected");
        candidateItem = null;
    }
    if (draggedItem) { //stop dragging
        draggedItem.classList.remove("item-dragged");
        draggedItem = null;
        layoutItems();
    }
    updateColors();
};

////

document.addEventListener("DOMContentLoaded", () => {
    layoutItems();
});

for (let item of items) {
    item.onmousedown = (e) => {
        if(item === e.target){
            e.preventDefault();
            reorderStart(e.target, e.clientY);
        }
    };
}

document.onmousemove = (e) => reorderMove(e.clientY);

document.onmouseup = () => reorderEnd();

for (let item of items) {
    item.ontouchstart = (e) => {
        if(item === e.target){
            e.preventDefault();
            reorderStart(e.target, e.touches[0].clientY);
        }
    };
}

document.ontouchmove = (e) => reorderMove(e.touches[0].clientY);

document.ontouchend = () => reorderEnd();

////
  