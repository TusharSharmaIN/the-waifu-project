getTagsData();

let tagData = "";

function getTagsData() {
  const endPoint = "https://api.waifu.im/tags";
  fetch(endPoint)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Request failed with status code: " + response.status);
      }
    })
    .then((data) => {
      const types = Object.keys(data);
      tagData = data;
      loadTypes(types);
    })
    .catch(() => {});
}

function createType(type) {
  const option = document.createElement("option");
  option.value = type;
  option.innerHTML = type;
  const tagsType = document.querySelector("#tag-type");
  tagsType.appendChild(option);
}

function loadTypes(types) {
  types.forEach((type) => {
    createType(type);
  });
}

function creatCategory(category) {
  const option = document.createElement("option");
  option.value = category;
  option.innerHTML = category;
  const tagsCategory = document.querySelector("#tag-category");
  tagsCategory.appendChild(option);
}

function loadCategories(categories) {
  const tagsCategory = document.querySelector("#tag-category");
  tagsCategory.innerHTML = "";
  const option = document.createElement("option");
  option.value = "select a category";
  option.innerHTML = "select a category";
  tagsCategory.appendChild(option);

  categories.forEach((category) => {
    creatCategory(category);
  });
}

function getImagesData(tag, isNSFW) {
  const endPoint = "https://api.waifu.im/search";
  const params = {
    included_tags: tag,
    byte_size: "<=1000000",
    limit: 30,
    is_nsfw: isNSFW,
  };

  const queryParams = new URLSearchParams(params);
  const requestUrl = `${endPoint}?${queryParams}`;

  fetch(requestUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Request failed with status code: " + response.status);
      }
    })
    .then((data) => {
      const images = data["images"];
      let urls = [];
      images.forEach((image) => {
        urls.push(image.url);
      });

      loadGallery(urls);
    })
    .catch((error) => {
      console.error("An error occurred:", error.message);
    });
}

function loadImage(imgUrl) {
  const imageElement = document.createElement("img");
  imageElement.src = imgUrl;
  imageElement.classList.add("rounded-md");

  const wrapper = document.createElement("div");
  wrapper.classList.add("mb-4");
  wrapper.appendChild(imageElement);

  const gallery = document.querySelector("#image-gallery");
  gallery.appendChild(wrapper);
}

function loadGallery(urls) {
  urls.forEach((url) => {
    loadImage(url);
  });
}

function clearGallery() {
  const gallery = document.querySelector("#image-gallery");
  gallery.innerHTML = "";
}

let isNSFW = false;
let currentCategory = "";
const tagType = document.querySelector("#tag-type");
const tagCategory = document.querySelector("#tag-category");
const viewMore = document.querySelector("#view-more");

tagType.addEventListener("change", (e) => {
  const type = e.target.value;
  if (type) {
    loadCategories(tagData[type]);
  }

  isNSFW = type === "nsfw";
});

tagCategory.addEventListener("change", (e) => {
  currentCategory = e.target.value;

  if (currentCategory) {
    clearGallery();
    getImagesData(currentCategory, isNSFW);
    viewMore.classList.remove("hidden");
  }
});

viewMore.addEventListener("click", (e) => {
  if (currentCategory) {
    getImagesData(currentCategory, isNSFW);
  }
});
