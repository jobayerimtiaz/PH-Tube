
//calculating time

function setTime(time){
    const day = parseInt(time/86400);
    const hour = parseInt(time%3600)
    return `${day} days ${hour} hours ago`;
}

const removeActiveClass = () =>{
  const button = document.getElementsByClassName("category-btn")
  for (btn of button){
    btn.classList.remove("active")
  }
}

//loading all categories and creating dynamic button

const loadCategory = () => {
fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
.then( res => res.json())
.then ( data => displayCategories(data.categories))
.catch ( error => console.log(error));
}

//load details

const loadDetails = (videoId) => {
fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`)
.then( res => res.json())
.then ( data => displayDetails(data.video))
.catch ( error => console.log(error));
}


const displayDetails = (video) =>{
  console.log(video)
  const detailsContainer = document.getElementById("details-info")
  detailsContainer.innerHTML = `
  <img class = "w-full" src=${video.thumbnail} />
  <p class = "py-4">${video.description}</p>
  `
  document.getElementById("detailsModal").showModal();

}

const loadCategoryVideos = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then( res => res.json())
    .then ( data => {
        removeActiveClass();
    const activeBtn = document.getElementById(`btn-${id}`)
    activeBtn.classList.add("active");
    displayVideos(data.category);
})
.catch ( error => console.log(error));
}

const displayCategories = (categories) => {
  const buttonContainer = document.getElementById("button-container")

  categories.forEach (item => {
    console.log(item.category)
    const buttonHolder = document.createElement("div");
    buttonHolder.innerHTML = `
    <button id ="btn-${item.category_id}" class="btn category-btn" onclick="loadCategoryVideos(${item.category_id})">${item.category}</button>
    `;
    buttonContainer.append(buttonHolder);
  });
}

//loading videos

const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then( res => res.json())
    .then ( data => displayVideos(data.videos))
    .catch ( error => console.log(error));
    }

const displayVideos = (videos) =>{
   const videosContainer = document.getElementById("video-container") 
   videosContainer.innerHTML = ""

   if ( videos.length == 0){
    videosContainer.classList.remove('grid')
    videosContainer.innerHTML = `
    <div class ="flex flex-col justify-center items-center py-28">
    <img src="Assets/Icon.png" alt="">
    <h1 class ="text-2xl font-black py-8">Sorry, No contents here</h1>
    </div>
    `
    return;
   } else {
    videosContainer.classList.add('grid')
   }

   console.log(videos)
   videos.forEach ( video => {
    const div = document.createElement('div')
    div.classList = "card card-compact"
    div.innerHTML = `
    <figure class = "h-[200px] relative">
    <img
      src=${video.thumbnail}
      class = "w-full h-full object-cover rounded-xl" />
      ${video.others.posted_date?.length == 0 ? "" : `<span class = "absolute right-2 bottom-2 bg-black text-gray-200 text-xs rounded-sm p-1">${setTime(video.others.posted_date)}</span>`}
      
  </figure>
  <div class="card-body flex flex-row gap-3">
  <img
      src= ${video.authors[0].profile_picture} class = "w-8 h-8 object-cover rounded-full" />
      <div>
         <h4 class="text-base text-black font-bold">${video.title}</h4>
         <div class ="flex gap-2">
         <p class ="text-sm font-normal text-[#171717B3]">${video.authors[0].profile_name}</p>
         ${video.authors[0].verified == true ? `<img
          src="https://img.icons8.com/?size=100&id=D9RtvkuOe31p&format=png&color=000000"
          class = "w-5 h-5" />`: ""}        
          </div> 
          <p class ="text-sm font-normal text-[#171717B3] pb-2">${video.others.views} Views</p>
          <button class="btn btn-primary" onclick = "loadDetails('${video.video_id}')">Details</button>
      </div>           
  </div> 
  
    `
    videosContainer.append(div);

   })
}

document.getElementById("search-input").addEventListener("keyup", (e) => {
    loadVideos(e.target.value);
  });

loadCategory();
loadVideos();

// [
//     {
//         "category_id": "1001",
//         "category": "Music"
//     },
//     {
//         "category_id": "1003",
//         "category": "Comedy"
//     },
//     {
//         "category_id": "1005",
//         "category": "Drawing"
//     }
// ]

