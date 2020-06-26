class Gallery {
  constructor() {
    this.fetchedData = null;
    this.page = 1;
    this.addListeners();
    this.getImages();
  }
  getImages() {
    axios
      .get(`https://api.unsplash.com/photos`, {
        params: {
          page: this.page,
          per_page: 24,
          client_id: "jcBijB1l7yYZ8Aobu34GRUbFVmIIiGHkCADJFHBKpWw",
        },
        timeout: 7000,
      })
      .then((response) => {
        this.fetchedData = response.data;
        this.appendImages();
      })
      .catch(function (error) {
        console.log(error);
        alert("Что-то сломалось");
      });
  }
  appendImages() {
    const imgsContainer = document.querySelector(".gallery-imgsContainer");
    const loadingScreen = document.querySelector(".gallery-loadingScreen");
    loadingScreen.style.display = "flex";
    imgsContainer.style.display = "none";
    imgsContainer.innerHTML = "";
    let counter = this.fetchedData.length; //осталось загрузить картинок
    this.fetchedData.map(function (x, index) {
      let div = document.createElement("div");
      let bgImg = new Image();
      bgImg.src = x.urls.small;
      bgImg.onload = function () {
        div.style.backgroundImage = `url("${x.urls.small}")`;
        counter--;
        //все загружены
        if (counter === 0) {
          loadingScreen.style.display = "none";
          imgsContainer.style.display = "grid";
        }
      };
      div.name = index;
      div.className = "gallery-img";
      imgsContainer.appendChild(div);
    });
  }
  changePage(x) {
    switch (x) {
      case "next":
        this.page++;
        this.getImages();
        break;
      case "prev":
        if (this.page === 0) return;
        this.page--;
        this.getImages();
      default:
        break;
    }
  }
  openModal(index) {
    //сохранять лайки и комментарий не нужно, поэтому при открытии все криво обнуляется
    document.querySelector(".lightbox-comment").innerHTML = "";
    document.querySelector(".lightbox-textarea").value = "";
    document.querySelector(".likeBtn--active, .likeBtn--inactive").className =
      "lightbox-icon likeBtn--inactive";
    document.querySelector(".lightbox").classList.add("lightbox--isVisible");
    document.querySelector(
      ".lightbox-img"
    ).style.backgroundImage = `url(${this.fetchedData[index].urls.regular})`;
  }
  addListeners() {
    let imgsContainer, prevBtn, nextBtn, likeBtn, closeBtn, changeBtn;
    imgsContainer = document.querySelector(".gallery-imgsContainer");
    prevBtn = document.querySelector(".prevBtn");
    nextBtn = document.querySelector(".nextBtn");
    likeBtn = document.querySelector(".likeBtn--inactive, .likeBtn--active");
    closeBtn = document.querySelector(".lightbox-closeBtn");
    changeBtn = document.querySelector(".lightbox-changeBtn");
    imgsContainer.onclick = (e) => this.openModal(e.target.name);
    likeBtn.onclick = function () {
      likeBtn.classList.toggle("likeBtn--active");
      likeBtn.classList.toggle("likeBtn--inactive");
    };
    prevBtn.onclick = () => this.changePage("prev");
    nextBtn.onclick = () => this.changePage("next");
    closeBtn.onclick = () =>
      document
        .querySelector(".lightbox")
        .classList.remove("lightbox--isVisible");
    changeBtn.onclick = function () {
      let commentTxt, inputValue;
      commentTxt = document.querySelector(".lightbox-comment");
      inputValue = document.querySelector(".lightbox-textarea").value;
      commentTxt.innerHTML = inputValue;
    };
  }
}
const gallery = new Gallery();
