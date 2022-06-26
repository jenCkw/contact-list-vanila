const avatar = document.querySelector('.image-avatar');

document.querySelectorAll('.image-input').forEach(inputElement=>{
    const dropzoneElt = inputElement.closest('.image-preview');

    dropzoneElt.addEventListener("click", (e) => {
        inputElement.click();
    });

//evenement change style
    dropzoneElt.addEventListener('dragover', e=>{
        e.preventDefault()
        //ajout du style dragover à la classe drop-zone__over
        dropzoneElt.classList.add('drop-zone__over');
    })

//Deposer photo
    dropzoneElt.addEventListener('drop', e=>{
        e.preventDefault() //pour empecher le navigateur de s'actualiser par defaut
        if(e.dataTransfer.files.length){
            inputElement.files = e.dataTransfer.files;
            //pour changer la photos apres le glisser deposer
            updateThumbnail(dropzoneElt, e.dataTransfer.files[0]);
            dropzoneElt.classList.remove('drop-zone__over')
        }
    })
})

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropzoneElt //pour obtenir l'auto-compression du file et de drop elment
 * @param {File} file
 */


function updateThumbnail(dropElt, file){
    
    //pour effacer à chaque fois le texte "deposez ici" à l'appel de la photo
    if(dropElt.querySelector('.image-text')){
        dropElt.querySelector('.image-text').remove()
    }

    //pour mettre le chelin d"acces de l'imae glissé dans la src
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();
    
        reader.readAsDataURL(file);
        reader.onload = () => {
            avatar.style.display = "block"
            avatar.setAttribute("src", reader.result)
        };
      } else {
       avatar.attributes("src",null)
      }
}

//
const upload = new Upload({ apiKey: "free" }) //librairie qui stocke nos images
let imageurl
let contact_data = []
const prenom = document.getElementById('prenom');
const nom = document.getElementById('nom');
const phone = document.getElementById('phone');
const groupe = document.getElementById('group');
const email = document.getElementById('email');
const bio = document.getElementById('bio');
const buttonSubmit = document.getElementById('create');
const contact_items = document.getElementById('contact-items');

//Pour l'url qu'on a dans le cloud
const uploadFile = upload.createFileInputHandler({
    onUploaded: async ({ fileUrl, fileId }) => {
    //   alert(`File uploaded! ${fileUrl}`);
      imageurl = await fileUrl
    }
  });

function onSubmit(e){
    e.preventDefault()

    let contact_object = {
            surname: prenom.value,
            name: nom.value,
            telephone: phone.value,
            group: groupe.value,
            mail: email.value,
            bio: bio.value,
            imageuri: imageurl
        }
    contact_data.push(contact_object)
    contact_data.map((data, index)=>{
        contact_items.innerHTML += `
        <div class="contact-item" key=${index}>
        <img src=${data.imageuri} class="contact-img" alt="">
        <div class="card-body">
            <div class="card-header">
                <div class="name">
                    <span>${data.surname} ${data.name}</span> - <span>${data.group}</span>
                </div>
                <div class="icons">
                <img src="./images/icons/edit.png" alt=""> 
                <img src="./images/icons/delete.png" alt="">
                </div>
            </div>
        
            <span class="card-phone">${data.telephone}</span>
            <p class="card-bio">
            ${data.bio}
            </p>
        </div>
        `
    })

}

buttonSubmit.addEventListener('click', onSubmit)