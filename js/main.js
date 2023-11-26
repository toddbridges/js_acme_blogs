
// function 1
function createElemWithText(elemName = "p", content = "", clsName) {
    const answer =  document.createElement(elemName);
    if (content) {answer.textContent = content;}
    if (clsName) {answer.className = clsName;}
    return answer;
}

// function 2
function createSelectOptions(theData) {
    if (!theData) return;

    const theArr = [];
    theData.forEach( user => {
        let temp = document.createElement("OPTION");
        temp.value = user.id;
        temp.textContent = user.name;
        theArr.push(temp);
    });
    return theArr;
}


// function 3
function toggleCommentSection(postId) {
    if(!postId) return;
    const theSection = document.querySelector(`section[data-post-id='${postId}']`);
    if(!theSection) return null;
    theSection.classList.toggle("hide");
    return theSection;

}

// function 4
function toggleCommentButton(postId) {
    if(!postId) return;
    const theButton = document.querySelector(`button[data-post-id='${postId}']`);
    if(!theButton) return null;
    if(theButton.textContent === 'Show Comments') {
        theButton.textContent = 'Hide Comments';
    } else {
        theButton.textContent = 'Show Comments'
    }
    return theButton;
}

// function 5
function deleteChildElements(parentElement) {
    if(!(parentElement instanceof HTMLElement)) return;
    let theChild = parentElement.lastElementChild;
    while (theChild) {
        parentElement.removeChild(theChild);
        theChild = parentElement.lastElementChild;
    };
    
    return parentElement;
}

// function 6 
function addButtonListeners() {
    const theMain = document.querySelector("main");
    const allButtons = theMain.querySelectorAll("button");
    if(!allButtons) return;

    for(let i = 0; i < allButtons.length; i++) {
        const thePostId = allButtons[i].dataset.postId;   
        if(thePostId) {
            allButtons[i].addEventListener("click", function (e) {toggleComments(e, thePostId)}, false);
        }
    }

    return allButtons;
}

// function 7
function removeButtonListeners() {
    const theMain = document.querySelector("main");
    const allButtons = theMain.querySelectorAll("button");
    if(!allButtons) return;

    for(let i = 0; i < allButtons.length; i++) {
        const thePostId = allButtons[i].dataset.id;
        if(thePostId) {
            allButtons[i].removeEventListener("click", function (e) {toggleComments(e, postId)}, false);
        }
    }
    return allButtons;
}

//function 8
function createComments(jsonComments) {
    if(!jsonComments) return;
    
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < jsonComments.length; i++) {
        const art = document.createElement("article");
        const h3 = createElemWithText('h3', jsonComments[i].name);
        const para = createElemWithText('p', jsonComments[i].body);
        const paraElem = createElemWithText('p', `From: ${jsonComments[i].email}`);
        
        art.append(h3, para, paraElem);
        fragment.append(art);
    }
    return fragment;
}

// function 9 
function populateSelectMenu(jsonData) {
    if(!jsonData) return;
    const theSelectMenuElem = document.getElementById("selectMenu");
    const somethingArray = createSelectOptions(jsonData);
    somethingArray.forEach((thing) => {
        theSelectMenuElem.append(thing);
    });

    return theSelectMenuElem;
}

// function 10

const getUsers = async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const jResponse = await response.json();
        return jResponse;
    } catch (error) {
        console.error(error);
    }
}

// function 11
const getUserPosts = async (theUserId) => {
    if(!theUserId) return;
    try {
        const resp = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${theUserId}`);
        const jresp = await resp.json();
        return jresp;
    } catch (error) {
        console.error(error);
    }
}

// function 12
const getUser = async (theUserId) => {
    if(!theUserId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${theUserId}`);
        const jresponse = await response.json();
        return jresponse;
    } catch (error) {
        console.error(error);
    }
}

// function 13
const getPostComments = async (postId) => {
    if(!postId) return;
    try {
        const comments = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const jComments = await comments.json();
        return jComments;
        
    } catch (error) {
        console.error(error);
    }
}

// function 14
const displayComments = async (postID) => {
    if(!postID) return;
    const theSection = document.createElement("section");
    theSection.dataset.postId = postID;
    theSection.classList.add('hide');
    theSection.classList.add('comments');
    const comments = await getPostComments(postID);
    const fragment = createComments(comments);
    theSection.append(fragment);
    return theSection;
}


// function 15
const createPosts = async (posts) => {
    if(!posts) return;
    let frag = document.createDocumentFragment();
    
        for(let i = 0; i < posts.length; i++) {
        let obj = posts[i];
        
        let theArticle = document.createElement("ARTICLE");
        const h2 = document.createElement('h2');
        h2.textContent = obj.title;
        const theP = document.createElement('p')
        theP.textContent = obj.body;
        const theP2 = document.createElement('p');
        theP2.textContent = `Post ID: ${obj.id}`; 
        
        const authorfunction = async () => {
            const author = await (getUser(obj.userId));
            return author;
        } 
        
        const secondFunction = async () => {
            let theAuth = await authorfunction();
            let p7 = `Author: ${theAuth.name} with ${theAuth.company.name}`;
            return p7;
        }
        const p8 = document.createElement('p');
        p8.textContent = await secondFunction();
        
        const thirdFunction = async () => {
            let theAuth = await authorfunction();
            let p9 = theAuth.company.catchPhrase;
            return p9;
        }
        const p10 = document.createElement('p');
        p10.textContent = await thirdFunction();
        
        const aButton = document.createElement("BUTTON");
        aButton.textContent = "Show Comments";
        aButton.dataset.postId = obj.id;
        theArticle.append(h2, theP, theP2, p8, p10, aButton);
        const theSection = await displayComments(obj.id);
        theArticle.append(theSection);
        frag.append(theArticle);
        
     };
     return frag;


}

// function 16
const displayPosts = async (posts) => {

    let theMain = document.querySelector('main');
    if(posts) {

        const element = (await createPosts(posts));
        theMain.append(element);
        return element;
    } else if(!posts) {
        let aPara = document.createElement('p');
        aPara.classList.add('default-text');
        aPara.textContent = "Select an Employee to display their posts.";
        theMain.append(aPara);
        return aPara;
    }    
}

//function 17
function toggleComments(event, postId) {   // the event is the click listener?
    if(!event || !postId) return;
    
    event.target.listener = true;

    let secElem = document.createElement('SECTION');
    secElem = toggleCommentSection(postId);

    let aButton = document.createElement('BUTTON');
    aButton = toggleCommentButton(postId);

    let anArray = [];
    anArray.push(secElem);
    anArray.push(aButton);
    return anArray;
}

const refreshPosts = async (posts) => {
    if(!posts) return;
    const newButtons = removeButtonListeners();

    const theMain = document.querySelector('main');
    const dce = deleteChildElements(theMain);
    
    let frag2 = document.createDocumentFragment();

    const theFrag3 = async () => {
        const response = await displayPosts(posts);
        return response;
    }
    frag2.append(await theFrag3());

    const buttonsToAdd = addButtonListeners();
    const theArr = [];
    theArr.push(newButtons);
    theArr.push(dce);
    theArr.push(frag2);
    theArr.push(buttonsToAdd);
    return theArr;
}

// function 19
const selectMenuChangeEventHandler = async (event) => {
    if(!event) return;
    const sel = document.getElementById('selectMenu');
    sel.disabled = true;
    const userId = event?.target?.value || 1;
    const jsonPosts = await getUserPosts(userId);
    const refreshArray = await refreshPosts(jsonPosts);
    console.log(refreshArray);
    sel.disabled = false;
    const arr = [];
    arr.push(userId);
    arr.push(jsonPosts)
    arr.push(refreshArray);
    return arr;

}

// function 20
const initPage = async () => {
    const userJsonData = await getUsers();
    const selectElement = populateSelectMenu(userJsonData);
    
    const anArray = [];
    anArray.push(userJsonData);
    anArray.push(selectElement);
    return anArray;
}

// function 21
const initApp = () => {
    initPage();
    const selMenu = document.getElementById("selectMenu");
    selMenu.addEventListener("change", (event) => {
        selectMenuChangeEventHandler(event);
        
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    initApp();
});
