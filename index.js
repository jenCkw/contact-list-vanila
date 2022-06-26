const avatar = document.querySelector('.image-avatar');
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
const hidenInpt = document.querySelector('#hidenInpt');
const btnReset = document.querySelector('.btn-reint');

// va servir de compteur aux elts sera incrementé de 1 à chaque nouvel elt
var counter = 0;



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
        let fileReader = new FileReader();

        fileReader.addEventListener('load',()=>{
            console.log(fileReader.result)
        })
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


//Pour l'url qu'on a dans le cloud
const uploadFile = upload.createFileInputHandler({
    onUploaded: async ({ fileUrl, fileId }) => {
    //   alert(`File uploaded! ${fileUrl}`);
      imageurl = await fileUrl
    }
  });

/**
 * écoute l'event submit du formulaire
 * @param {Event} e 
 */
function onSubmit(e){
    e.preventDefault()

    let data = {
            surname: prenom.value,
            name: nom.value,
            telephone: phone.value,
            group: groupe.value,
            mail: email.value,
            bio: bio.value,
            imageuri: imageurl
        }
        // console.log(hidenInpt)
        // si la valeur de l'input caché est -1 on suppose qu'on fait l'enregistrement sinon on modifie
        if (hidenInpt.value == '-1') {
            // contact_data.push(contact_object);
            // j'ai supprimé la boucle ici elle ne servait plus à rien, l'index des contacts provient de la variable counter
            // contact_data.map((data, index)=>{

            let contactTemplate = getTemplate(counter,data.imageuri,data.surname,data.name,data.group,data.telephone,data.bio);
            contact_items.innerHTML += contactTemplate;

            // vide le formulaire après l'ajout du contact
            clearForm();
            // écoutes l'evenement clique des boutons edit
            listenEditBtnEvent();
            // écoutes l'event à la suppression
            listenDeleteBtnEvent();
            // })
            counter++;
        } else {
            // on récupère l'index de l'elt à modifier

            let index = hidenInpt.value;

            let snameElt = document.querySelector(`#contact_elt_sname_${index}`);
            let nameEt = document.querySelector(`#contact_elt_name_${index}`);
            let BioELt = document.querySelector(`#contact_elt_bio_${index}`);
            let phoneElt = document.querySelector(`#contact_elt_phone_${index}`);

            snameElt.innerHTML = data.surname;
            nameEt.innerHTML = data.name;
            BioELt.innerHTML = data.bio;
            phoneElt.innerHTML = data.bio
            clearForm();
        }
}

/**
 * gènère le template d'un contact sous format string
 * elle est dans une fontion pour pouvour être réutiliser ailleurs
 * @param {*} index 
 * @param {*} imageuri 
 * @param {*} surname 
 * @param {*} name 
 * @param {*} group 
 * @param {*} telephone 
 * @param {*} bio 
 * @returns 
 */
function getTemplate(index,imageuri,surname,name,group,telephone,bio){
    return `
    <div class="contact-item" key=${index} id="contact_elt_${index}">
    <img src=${imageuri} class="contact-img" alt="">
    <div class="card-body">
        <div class="card-header">
            <div class="name">
                <span id="contact_elt_sname_${index}">${surname}</span> <span id="contact_elt_name_${index}">${name}</span> - <span id="contact_elt_grpe_${index}">${group}</span>
            </div>
            <div class="icons">
                <img class="btn_edit" src="./images/icons/edit.png" alt="" data-id="${index}"> 
                <img class="btn_delete" src="./images/icons/delete.png" alt="" data-id="${index}">
            </div>
        </div>
    
        <span class="card-phone" id="contact_elt_phone_${index}">${telephone}</span>
        <p class="card-bio" id="contact_elt_bio_${index}">
            ${bio}
        </p>
    </div>
    `
}

/**
 * Sera appelé après l'insertion d'un nouveau contact pour pouvoir enregistrer son event
 */
function listenEditBtnEvent(){
    let btn_edits = document.querySelectorAll('.btn_edit');
    btn_edits.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            let index = e.target.dataset.id;
            // console.log(index);
            let sname = document.querySelector(`#contact_elt_sname_${index}`).textContent;
            let name = document.querySelector(`#contact_elt_name_${index}`).textContent;
            let bio = document.querySelector(`#contact_elt_bio_${index}`).textContent;
            let grpe = document.querySelector(`#contact_elt_grpe_${index}`).textContent;
            let phone = document.querySelector(`#contact_elt_phone_${index}`).textContent;
            // remplis le form
            fillForm(sname,name,phone,grpe,bio,'',index);
        })
    })
}

/**
 * Sera appelé après l'insertion d'un nouveau contact pour pouvoir enregistrer son event
 */
function listenDeleteBtnEvent() {
    let btnDeletes = document.querySelectorAll('.btn_delete');
    btnDeletes.forEach(btn=>{
        btn.addEventListener('click',e=>{
            let index = e.target.dataset.id;
            let parent = document.querySelector('#contact-items');
            let EltToDelete = document.querySelector(`#contact_elt_${index}`);
            parent.removeChild(EltToDelete);
        })
    })
}


/**
 * vide le formualaire
 */
function clearForm(){
    let form = document.querySelector('form');
    form.reset();
    avatar.src = '';
    hidenInpt.value = '-1';
}

function fillForm(pnom,nm,phne,grp,eml,bioV,index){
    prenom.value = pnom
    nom.value = nm
    phone.value = phne
    groupe.value = grp
    email.value = eml
    bio.value = bioV
    hidenInpt.value = index
}

buttonSubmit.addEventListener('click', onSubmit)
btnReset.addEventListener('click',(e)=>{
    clearForm();
})