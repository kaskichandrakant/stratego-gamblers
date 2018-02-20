const doXhr = function(url, method, reqListener, data, onFailed) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onreadystatechange = function() {
    if (this.status == 200 && this.readyState == 4) {
      reqListener.call(this);
    } else {
      onFailed();
    }
  };
  if (method == 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  data ? xhr.send(data) : xhr.send();
};

const generateCell = (id) => {
  let cell = document.createElement("td");
  if (id < 10) {
    id = `0_${id}`;
  }
  cell.id = id;
  return cell;
};

const generateRow = (initialID, numberOfCols) => {
  let row = document.createElement("tr");
  for (let cols = 0; cols < numberOfCols; cols++) {
    let id = initialID.toString().split("").join("_");
    let cell = generateCell(id);
    row.appendChild(cell);
    initialID++;
  }
  return row;
};

const drawGrid = (containerId, numOfRows, numOfCols, initialID, idGrowth)=>{
  let grid = document.getElementById(containerId);
  for (let rows = 0; rows < numOfRows; rows++) {
    let row = generateRow(initialID, numOfCols);
    initialID += idGrowth;
    grid.appendChild(row);
  }
};

const setImageAttributes = (img, src, id, height, width) => {
  img.src = src;
  img.id = id;
  img.height = height;
  img.width = width;
  return img;
};

const appendImage = (baseCell, id, imgSrcDirectory) => {
  let basePosition = document.getElementById(baseCell.id);
  let image = document.createElement("img");
  let src = `img/${imgSrcDirectory}/${id}.png`;
  let height = "50";
  let width = "50";
  let img = setImageAttributes(image, src, id, height, width);
  basePosition.appendChild(img);
};

const showBattlefield = (battlefield,imgSrcDirectory) => {
  let locations = Object.keys(battlefield);
  locations.forEach(function(location) {
    let cell = document.getElementById(location);
    appendImage(cell,battlefield[location],imgSrcDirectory);
  });
};

const updateBattleField = function(imgSrcDirectory) {
  let reqListener = function() {
    let battlefield = JSON.parse(this.responseText);
    showBattlefield(battlefield,imgSrcDirectory);
  };
  doXhr('/battlefield', 'GET', reqListener, '', () => {
    console.log("fail");
  });
};