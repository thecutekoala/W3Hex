// 0. 獲取屬性
let section = document.querySelector("section");
let add = document.querySelector("form button");
let classAdd = 0;

// 開啟頁面時先執行
loadData();

function loadData() {
  // 8 開啟頁面時讀取 <-放進function
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    // 7-2 讀取原本已有的storage
    myListArray.forEach((item) => {
      let todo = document.createElement("div");
      todo.classList.add("todo");

      let checked = document.createElement("button");
      checked.classList.add("checked");
      checked.innerHTML = '<i class="fa-solid fa-check"></i>';

      checked.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });

      let deleted = document.createElement("button");
      deleted.classList.add("deleted");
      deleted.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleted.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", () => {
          // **同時把storage資料刪掉
          let text = todoItem.children[3].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });

          todoItem.remove();
        });
        todoItem.style.animation = "scaleDown .3s forwards";
      });

      todo.appendChild(checked);
      todo.appendChild(deleted);

      // 讀取並建立資料
      let text = document.createElement("p");
      text.innerText = item.todoText;
      let time = document.createElement("p");
      time.innerText = item.todoMonth + "/" + item.todoDate;

      if (classAdd == 0) {
        text.classList.add("todo-text1");
        time.classList.add("todo-time1");
        classAdd++;
      } else {
        text.classList.add("todo-text2");
        time.classList.add("todo-time2");
        classAdd--;
      }

      todo.appendChild(time);
      todo.appendChild(text);
      section.appendChild(todo);
    });
  }
}

// 綁定事件 - 提交按鈕
add.addEventListener("click", (e) => {
  // 1.阻止內容提交出去
  e.preventDefault();

  // 2.取得鍵入的資訊
  let form = e.target.parentElement;
  let todoMonth = form.children[0].value;
  let todoDate = form.children[1].value;
  let todoText = form.children[2].value;

  // *未輸入任何東西的時候停止事件
  if (todoText === "") {
    alert("寫點東西吧!");
    return;
  }

  // 3.在section中創造todoItem

  // 3-1 生成div
  let todo = document.createElement("div");
  // 3-1-1 加入class
  todo.classList.add("todo");

  // 5. 創造勾勾跟垃圾桶
  let checked = document.createElement("button");
  checked.classList.add("checked");
  // ***要小心引用的class會有雙引號
  checked.innerHTML = '<i class="fa-solid fa-check"></i>';
  // 5-1 加入勾勾的功能
  checked.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });

  let deleted = document.createElement("button");
  deleted.classList.add("deleted");
  deleted.innerHTML = '<i class="fa-solid fa-trash"></i>';

  //  5-2 加入垃圾桶功能
  deleted.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", () => {
      // 刪除storage資料
      let text = todoItem.children[3].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });

      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown .3s forwards";
  });

  todo.appendChild(checked);
  todo.appendChild(deleted);

  // 3-2 生成獲取輸入的文字
  let text = document.createElement("p");
  // 3-2-1 獲取輸入的文字放到生成的p
  text.innerText = todoText;

  // 3-3 生成獲取時間的文字
  let time = document.createElement("p");
  time.innerText = todoMonth + "/" + todoDate;

  // 3-4 設置class加入條件

  if (classAdd == 0) {
    text.classList.add("todo-text1");
    time.classList.add("todo-time1");
    classAdd++;
  } else {
    text.classList.add("todo-text2");
    time.classList.add("todo-time2");
    classAdd--;
  }
  // 4. 將輸入的文字及時間放到div裡
  todo.appendChild(time);
  todo.appendChild(text);

  todo.style.animation = "scaleUp .6s forwards";

  // 7.0 建立一個存放資料的obj
  let myTodo = {
    todoMonth: todoMonth,
    todoDate: todoDate,
    todoText: todoText,
  };

  // 7-1. 建立storage
  let myList = localStorage.getItem("list");
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }

  console.log(JSON.parse(localStorage.getItem("list")));

  // 將輸入欄位清空
  for (let i = 0; i < form.children.length - 1; i++) {
    form.children[i].value = "";
  }

  // 6.將生成的div放到section
  section.appendChild(todo);
});

// 依時間比較的函式
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

// 排序的函式
function mergeSort(arr) {
  if (arr.length === 0) {
    return [];
  } else if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    // 遞迴
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

// 給排序按鈕功能;
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // 資料排序
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  // 板面上資料全部刪除
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  // 讀取貯存資料
  loadData();
});
