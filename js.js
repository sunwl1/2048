  //보드를 담을 배열
  let border = [];
  //아이템과 아이템 데이터를 담을 배열
  let box = [];
  //보드의 갯수
  const borderLength = 4;

  let keyCon = false;

  //보드 초기화
  init();

  function init() {
    //보드를 담을 배열을 이중배열로 세팅
    for (let i = 0; i < borderLength; i++) {
      border.push([]);
      for (let j = 0; j < borderLength; j++) {
        border[i].push(0);
      }
    }
    //아이템 초기화
    boxInit();
    //초기 아이템 2개 생성
    createItem();
    createItem();
  }

  function boxInit() {
    // 배열의 X축
    let arrIndexX = 0;
    // 배열의 Y축
    let arrIndexY = 0;
    //각각 X포지션 Y포지션 배열
    let _posX = [0, 125, 250, 375];
    let _posY = [0, 125, 250, 375];

    //보드의 박스들을 변수에 담아줌
    let borderBox = document.querySelectorAll('.border-box');

    //아이템을 이중배열로 담아줌
    for (let i = 0; i < borderLength; i++) {
      box.push([]);
      for (let j = 0; j < borderLength; j++) {
        box[i].push([]);
      }
    }

    //보드의 박스들 만큼 forEach문
    borderBox.forEach((el, index) => {
      // 각각 객체 초기 데이터 세팅
      let date = { posX: 0, posY: 0, on: false, index: index, el : el, item:null,add:false };
      //인덱스가 4마다 Y축 인덱스 증가 X축은 초기로 초기화
      if (index % 4 == 0) {
        arrIndexY++;
        arrIndexX = 0;
      }
      //X포지션과 Y포지션 데이터 세팅
      date.posX = _posX[arrIndexX];
      date.posY = _posY[arrIndexY - 1];
      //세팅한 포지션으로 아이템 박스 이동
      date.el.style.left = _posX[arrIndexX] + "px";
      date.el.style.top = _posY[arrIndexY - 1] + "px";
      //아이템에 이중 배열에 데이터 전달
      box[arrIndexY - 1][arrIndexX] = date;
      //X 포지션 계속 증가
      arrIndexX++;
    });
  }

  //아이템 생성
  function createItem() {
    //아이템 생성을 랜덤으로 X축 Y축 세팅
    let posX = parseInt(Math.random() * borderLength);
    let posY = parseInt(Math.random() * borderLength);
    //생성되는 곳에 아이템이 있는지 확인 변수
    let reSelect = true;
    //div를 생성해 아이템 초기 세팅
    let item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = 2;
    //빈공간을 찾아 무한 반복
    while (reSelect) {
      //현제 랜덤 세팅에서 0 빈공간이 탐색되면 아이템 생성 밑 세팅(애니메이션)
      if (border[posX][posY] == 0) {
        border[posX][posY] = 2;
        item.style.left = box[posX][posY].posX + "px";
        item.style.top = box[posX][posY].posY + "px";
        box[posX][posY].item = item;
        document.querySelector('.border').append(item);
        TweenMax.from( box[posX][posY].item, 1, {scale:0.2} );
        reSelect = false;
      }
      else {
        //빈공간이 아닐 경우 다시 랜덤 세팅
        posX = parseInt(Math.random() * borderLength);
        posY = parseInt(Math.random() * borderLength);
      }
      //혹시 아이템이 모두있으면 게임오버이므로 아이템을 채크하고 모두있으면 while문 종료
      if(itemCheck() >= 16)
      {
        break;
      }
    }
  }
  

  function boxAddReset() {
    for (let i = 0; i < borderLength; i++) {
      for (let j = 0; j < borderLength; j++) {
        box[i][j].add = false;
      }
    }
  }

  //아이템 채크
  function itemCheck() {
    //아이템 갯수 변수
    let count = 0;
    //아이템의 빈공간의 갯수를 샘
    for (let i = 0; i < borderLength; i++) {
      for (let j = 0; j < borderLength; j++) {
        if (border[i][j] != 0)
        count++;
      }
    }
    //return값으로 빈공간 갯수 반환
    return count;
  }

  //게임 성공한지 탐색
  function successCheck() {
    //보드를 탐색하며 2048의 숫자가 있는지 검사 있으면 게임 성공
    for (let i = 0; i < borderLength; i++) {
      for (let j = 0; j < borderLength; j++) {
        if (border[i][j] == 2048)
        document.querySelector('.border').className = 'border success';
      }
    }
  }

  //방향키 키입력시 아이템 이동밑 게임오버, 게임성공 확인
  window.addEventListener('keydown', function (e) {
    if(keyCon == true) return;
    keyCon = true;
    setTimeout(() => {
      keyCon = false;
    }, 300);
    if(itemCheck() >= 16)
    {
      //게임 오버
      document.querySelector('.border').className = 'border end';
    }
    else{
      //아이템 이동
      itemMove(e.keyCode);
      boxAddReset();
    }
    //게임 성공
    successCheck();
  });

  //아이템 이동
  function itemMove(keyCode)
  {
    let move = false;
    switch (keyCode) {
      case 37:
        //보드의 갯수만큼 반복문
        for (let x = 0; x < borderLength; x++) {
          for (let y = 0; y < borderLength; y++) {
            //현제 탐색중인 아이템이 빈공간이 아닐때
            if(border[x][y] != 0)
            {
              //현제와 다음의 인덱스 변수
              let next = 1;
              let now = 0;
              let removeItem = null;
              //배열의 끝자락이 아닐때 까지 탐색
              while(border[x][y - next] != undefined)
              {
                //옆이 빈공간이면 그냥 이동
                if(border[x][y - next] == 0)
                {
                  border[x][y - next] = border[x][y - now];
                  border[x][y - now] = 0;
                  box[x][y - next].item = box[x][y - now].item;
                  box[x][y - now].item = null;
                  box[x][y - next].item.style.left = box[x][y - next].posX + "px";
                  box[x][y - next].item.style.top = box[x][y - next].posY + "px";
                  if(move == false) move = true;
                }
                //옆이 자신과 동일한 숫자면 결합후 이동한 아이템 삭제
                else if(border[x][y - next] == border[x][y - now] && (box[x][y - next].add == false && box[x][y - now].add == false))
                {
                  border[x][y - next] += border[x][y - now];
                  border[x][y - now] = 0;
                  box[x][y - next].item.style.left = box[x][y - next].posX + "px";
                  box[x][y - next].item.style.top = box[x][y - next].posY + "px";
                  box[x][y - next].item.innerHTML = border[x][y - next];
                  itemColor(border[x][y - next],box[x][y - next].item); 
                  TweenMax.from(box[x][y - next].item,0.1,{scale:2});
                  removeItem = box[x][y - now].item;
                  box[x][y - next].add = true;
                  if(move == false) move = true;
                }
                setTimeout(() => {
                  if(removeItem != null)
                  $(removeItem).remove();
                }, 100);
                next++;
                now++;
              }
            }
          }
        }
        // 이동후 아이템 생성
        if(move == true) 
        createItem();
        break;
      case 38:
        for (let x = 0; x < borderLength; x++) {
          for (let y = 0; y < borderLength; y++) {
            if(border[y][x] != 0 && y != 0)
            {
              let next = 1;
              let now = 0;
              let removeItem = null;
              while(border[y - next][x] != undefined)
              {
                if(border[y - next][x] == 0)
                {
                  border[y - next][x] = border[y - now][x];
                  border[y - now][x] = 0;
                  box[y - next][x].item = box[y - now][x].item;
                  box[y - now][x].item = null;
                  box[y - next][x].item.style.left = box[y - next][x].posX + "px";
                  box[y - next][x].item.style.top = box[y - next][x].posY + "px";
                  if(move == false) move = true;
                }
                else if(border[y - next][x] == border[y - now][x] && (box[y - next][x].add == false && box[y - now][x].add == false))
                {
                  border[y - next][x] += border[y - now][x];
                  border[y - now][x] = 0;
                  box[y - next][x].item.style.left = box[y - next][x].posX + "px";
                  box[y - next][x].item.style.top = box[y - next][x].posY + "px";
                  box[y - next][x].item.innerHTML = border[y - next][x];
                  itemColor(border[y - next][x],box[y - next][x].item);
                  TweenMax.from(box[y - next][x].item,0.1,{scale:2});
                  removeItem = box[y - now][x].item;
                  box[y - next][x].add = true;
                  if(move == false) move = true;
                }
                setTimeout(() => {
                  if(removeItem != null)
                  $(removeItem).remove();
                }, 100);
                if((y - next)>0)
                {
                  next++;
                  now++;
                }
                else{
                  break;
                }
              }
            }
          }
        }
        if(move == true)
        createItem();
        break;
      case 39:
        for (let x = 0; x < borderLength; x++) {
          for (let y = borderLength - 1; y >= 0; y--) {
            if(border[x][y] != 0)
            {
              let next = 1;
              let now = 0;
              let removeItem = null;
              while(border[x][y + next] != undefined)
              {
                if(border[x][y + next] == 0)
                {
                  border[x][y + next] = border[x][y + now];
                  border[x][y + now] = 0;
                  box[x][y + next].item = box[x][y + now].item;
                  box[x][y + now].item = null;
                  box[x][y + next].item.style.left = box[x][y + next].posX + "px";
                  box[x][y + next].item.style.top = box[x][y + next].posY + "px";
                  if(move == false) move = true;
                }
                else if(border[x][y + next] == border[x][y + now] && (box[x][y + next].add == false &&  box[x][y + now].add == false))
                {
                  border[x][y + next] += border[x][y + now];
                  border[x][y + now] = 0;
                  box[x][y + next].item.style.left = box[x][y + next].posX + "px";
                  box[x][y + next].item.style.top = box[x][y + next].posY + "px";
                  box[x][y + next].item.innerHTML = border[x][y + next];
                  itemColor(border[x][y + next],box[x][y + next].item);
                  TweenMax.from(box[x][y + next].item,0.1,{scale:2});
                  removeItem = box[x][y + now].item;
                  box[x][y + next].add = true;
                  if(move == false) move = true;
                }
                setTimeout(() => {
                  if(removeItem != null)
                  $(removeItem).remove();
                }, 100);
                next++;
                now++;
              }
            }
          }
        }
        if(move == true)
        createItem();
      break;
      case 40:
        for (let x = 0; x < borderLength; x++) {
          for (let y = borderLength - 1; y >= 0; y--) {
            if(border[y][x] != 0 && y < borderLength - 1)
            {
              let next = 1;
              let now = 0;
              let removeItem = null;
              while(border[y + next][x] != undefined)
              {
                if(border[y + next][x] == 0)
                {
                  border[y + next][x] = border[y + now][x];
                  border[y + now][x] = 0;
                  box[y + next][x].item = box[y + now][x].item;
                  box[y + now][x].item = null;
                  box[y + next][x].item.style.left = box[y + next][x].posX + "px";
                  box[y + next][x].item.style.top = box[y + next][x].posY + "px";
                  if(move == false) move = true;
                }
                else if(border[y + next][x] == border[y + now][x] && (box[y + next][x].add == false && box[y + now][x].add == false))
                {
                  border[y + next][x] += border[y + now][x];
                  border[y + now][x] = 0;
                  box[y + next][x].item.style.left = box[y + next][x].posX + "px";
                  box[y + next][x].item.style.top = box[y + next][x].posY + "px";
                  box[y + next][x].item.innerHTML = border[y + next][x];
                  itemColor(border[y + next][x], box[y + next][x].item);
                  TweenMax.from(box[y + next][x].item,0.1,{scale:2});
                  removeItem = box[y + now][x].item;
                  box[y + next][x].add = true;
                  if(move == false) move = true;
                }
                setTimeout(() => {
                  if(removeItem != null)
                  $(removeItem).remove();
                }, 100);
                if((y + next) < (borderLength - 1))
                {
                  next++;
                  now++;
                }
                else{
                  break;
                }
              }
            }
          }
        }
        if(move == true)
        createItem();
        break;
      default:
        break;
    }
  }

  function itemColor(num,el)
  {
    switch (num) {
      case 4:
        el.className = 'item';
        el.className += ' one';
        break;
      case 8:
        el.className = 'item';
        el.className += ' two';
        break;
      case 16:
        el.className = 'item';
        el.className += ' three';
        break;
      case 32:
        el.className = 'item';
        el.className += ' four';
        break;
      case 64:
        el.className = 'item';
        el.className += ' five';
        break;
      case 128:
        el.className = 'item';
        el.className += ' fix';
        break;
      case 256:
        el.className = 'item';
        el.className += ' seven';
        break;
      default:
        break;
    }
  }

  restart.addEventListener('click',function(){
    border = [];
    box = [];
    //보드 초기화
    $(document.querySelectorAll('.item')).remove();
    init();
  });