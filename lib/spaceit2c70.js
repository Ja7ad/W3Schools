/*
  SpaceIt script
  Version: 1.0.3
*/


const spaceIt = (() => {
    
  let accessToken = "";
  
  let user = null;

  let spacesPagesURL = "w3spaces";

  let spacesApiUrl = "https://tryit-api.w3schools.com/tryit";

  const spacesUrl = "https://spaces.w3schools.com";
  const billingURL = "https://billing.w3schools.com";
  const profileURL = "https://profile.w3schools.com";
  const redirectURL = encodeURIComponent(`https://${location.host+location.pathname+location.search}`);

  const init = () => {
    let code = window.localStorage.getItem('spaceItCode');
    if(location.hash === "#login" && code && code.length){
      document.getElementById('textareaCode').value = window.localStorage.getItem('spaceItCode');
      window.editor.getDoc().setValue(window.localStorage.getItem('spaceItCode'));
      window.localStorage.removeItem('spaceItCode');
      showDialog();
    }
  }

  const userSessionIsPresent = () => {
    var cognitoCfg = getCognitoConfig();

    var userSessionVerificationRes = verifyUserSession(
      cognitoCfg,
      Cookies.get('userSession'),
      Cookies.get('accessToken'),
    );
    // console.log('userSessionIsPresent -> userSessionVerificationRes: ', userSessionVerificationRes);

    if (userSessionVerificationRes.error.code === '0') {
      accessToken = userSessionVerificationRes.data.rawStr;

      return true;
    }

    return false;
  }

  const createCallbackSelfExecutedWithDelay = (callback, delay) => {
    /*
      Origin/Inspiration: https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits#hitcallback
      Main purpose of this function is to return a callback function to be executed in some place .. and if the
      execution will not take place there for some reason/error -> still execute it with a delay
    */

    if (typeof delay === 'undefined') {
      delay = 1000; // defaults to 1 second
    }

    let called = false;

    function callbackWrapper() {
      if (!called) {
        called = true;
        callback();
      }
    }

    setTimeout(callbackWrapper, delay);
    
    return callbackWrapper;
  }

  const login = () => {
    // ga('send', 'event', 'spacesFromTryit', 'saveLogin', {
    //   hitCallback: createCallbackSelfExecutedWithDelay(() => {
    //     location.href = `${profileURL}/?redirect_url=${redirectURL}%23login`;
    //   })  
    // });
    location.href = `${profileURL}/?redirect_url=${redirectURL}%23login`;
  }

  const signup = () => {
    // ga('send', 'event', 'spacesFromTryit', 'saveSignup', {
    //   hitCallback: createCallbackSelfExecutedWithDelay(() => {
    //     location.href = `${profileURL}/sign-up?redirect_url=${redirectURL}%23login`;
    //   })  
    // });
    location.href = `${profileURL}/sign-up?redirect_url=${redirectURL}%23login`;
  }

  const fetchUser = async() => {
      user = await fetch(
        spacesApiUrl + "/user",
              {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${accessToken}`,
                  },
                  credentials: 'include'
              }
          )
          .then(response => response.json());
        //console.log(user);
  }

  const checkSpaceAvailability = async(id) => {
    let response = await fetch(
      spacesApiUrl + `/availability/space/${id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                credentials: 'include'
            }
        )
        .then(response => response.json());
    //console.log(response);
  }

  const getSpaceIdValidationError = id => {
    if (id.length < 4) {
        return "The name must be at least 4 characters."
    } else if (id.length > 20) {
        return "The name cannot be more than 20 characters."
    } else if (!/^[a-z]/.test(id)) {
        return "The name must start with a lower case letter."
    } else if (!/^[a-z\-0-9]*$/.test(id)) {
        return "The name can only contain lower case letters, numbers and dashes."
    }

    return undefined
}

  const registerSpace = async(id) => {
    let validation = getSpaceIdValidationError(id);
    if(validation) {
      document.getElementById("spaceit-modal-input-group--validation-error").innerHTML = validation;
      return;
    }

    try {
      showLoading("We are creating your space...");

      let response = await fetch(
        spacesApiUrl + `/register/space/${id}`,
              {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({}),
                credentials: 'include'
              }
          )
          .then(response => response.json());
      //console.log(response);
      
      if(response.error && response.error.code !== "0" && response.error.description) {
        showSpaceRegistration();
        document.getElementById("spaceItSpaceName").value = id;
        document.getElementById("spaceit-modal-input-group--validation-error").innerHTML = response.error.description;
      }
      
      
      
      else if(response.error.code === "0" && id) {
        user.data.spaces.push(id);
        showSaveCode();
        document.getElementById('spaceItSelectedFilename').value = `saved-from-Tryit-${(new Date().toJSON()).split("T")[0]}`;
      }
    } catch (error) {
      console.log(error.message);
      showSpaceRegistration();
      document.getElementById("spaceItSpaceName").value = id;
    }
  }

  const saveCode = async() => {

      if (window.editor) {
        window.editor.save();
      }

      let code = document.getElementById("textareaCode").value;

      let spaceId = document.getElementById('spaceItSelectedSpace').options[document.getElementById('spaceItSelectedSpace').selectedIndex].text;
      let filename = document.getElementById('spaceItSelectedFilename').value.replace(/\.[^/.]+$/, "");

      try {
        showLoading("We are saving your code...");
        const response = await fetch(
            spacesApiUrl + "/code",
              {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({
                  "space": spaceId,
                  "name": filename,
                  "format": "html",
                  "code": code
                  }),
                  credentials: 'include'
              }
          )
          .then(response => response.json());

          //console.log(response);

          if(response.error && response.error.code === "0" && response.data.file.rel_path) {
            showSaveSuccess(spaceId, response.data.file.rel_path);
          }
          else if(response.error.code && response.error.code !== "0") {
            throw new Error(response.error.description || "Something bad happened. Check your code.")
          }
      
      } catch (error) {
        console.log(error.message);
        showSaveCode();
        document.getElementById('spaceItSelectedFilename').value = filename;
        document.getElementById("spaceit-modal-input-group-error").innerHTML = error.message;
      }
      
    
    }

  const showLoading = (text) => {
    let modalContainer = document.getElementById('spaceItModalContainer');
    modalContainer.innerHTML = "";

    let html = `
      <div id="spaceItLoadingContainer">
        <h1 class="spaceit-loader-text">Please wait...</h1>
        <div id="spaceItLoader" class="spaceit-loader-container">
          <img class="spaceit-loader" src="/images/spinner.svg">
        </div>
        <p class="spaceit-loader-text">${text}</p>
      </div>
    `;

    modalContainer.insertAdjacentHTML("beforeend", html);

  }

  const showLogin = () => {
    let modalContainer = document.getElementById('spaceItModalContainer');
    modalContainer.innerHTML = "";

    let html = `
      <div id="spaceItLoginContainer">
        <div class="spaceit-modal-login-image-container">
          <img class="spaceit-modal-login-image" src="/images/illustration.png">
        </div>
        <div class="spaceit-modal-login-header">
          <img src="/images/new-label.svg">
          <h1>Save your code to<br class="w3-hide-large w3-hide-medium"> W3Schools Spaces</h1>
        </div>
        <div>
        <p>Log in or sign up for free to save your code now.</p>
        <p class="w3-hide-small">Spaces is a personal place where you can create your own web pages; save your code and share it with others.
        <div class="spaceit-modal-button-bar">
          <a href="javascript:void(0);" id="spaceItLoginButton" class="spaceit-modal-button-secondary" onclick="spaceIt.login()">Log in</a>  
          <a href="javascript:void(0);" id="spaceItSignButton" class="spaceit-modal-button-primary" onclick="spaceIt.signup()">Sign up for free</a>
        </div>
      </div>
    `;

    modalContainer.insertAdjacentHTML("beforeend", html);

  }

  const showSpaceRegistration = () => {
    let modalContainer = document.getElementById('spaceItModalContainer');
    modalContainer.innerHTML = "";

    let html = `
      <div id="spaceItRegisterContainer">
        <h1>Create a space</h1>
        <p>To save code snippets you need a space first. What do you want to call this space?</p>
        <div class="w3-margin-bottom">
          <br>
          <form>
            <div class="spaceit-modal-input-group w3-margin-bottom">
              <input id="spaceItSpaceName" class="spaceit-modal-input" required placeholder="Enter a name for your space" minlength="4" maxlength="20"> 
              <div class="spaceit-modal-input-group-append"><span class="spaceit-modal-input-group-text">.w3spaces.com</span></div>
            </div>
            <small class="spaceit-modal-input-validation-error"><div id="spaceit-modal-input-group--validation-error"></div></small>
          </form>
          <p>This will also be the public url for your space.</p>
        </div>
        <div class="spaceit-modal-button-bar">
          <a href="javascript:void(0);" id="spaceItCancelButton" class="spaceit-modal-button-secondary" onclick="spaceIt.closeDialog();">Cancel</a>
          <a href="javascript:void(0);" id="spaceItRegisterButton" class="spaceit-modal-button-primary" onclick="spaceIt.registerSpace(document.getElementById('spaceItSpaceName').value);">Create a space</a>
        </div>

      </div>
    `;

    modalContainer.insertAdjacentHTML("beforeend", html);

  }

  const checkFilename = () => {
    let filename = document.getElementById('spaceItSelectedFilename').value;
    if(filename.length >= 1) {
      document.getElementById('spaceItSaveButton').classList.remove("spaceit-modal-button-disabled");
    }
    else {
      document.getElementById('spaceItSaveButton').classList.add("spaceit-modal-button-disabled");
    }
  }

  const showSaveCode = () => {
    let modalContainer = document.getElementById('spaceItModalContainer');
    modalContainer.innerHTML = "";

    let html = `
      <div id="spaceItSaveContainer">
        <h1>${user.data.spaces.length<=1 ? "Save your code to W3Schools Spaces?" : "Save your code to W3Schools Spaces?"}</h1>
        <div class="spaceit-modal-margin-top w3-margin-bottom">
          Your space
          <select id="spaceItSelectedSpace" class="minimal w3-margin-bottom" style="margin-bottom: 10px;"></select>
          Name your file
          <br>
          <div class="spaceit-modal-input-group w3-margin-bottom">
            <input id="spaceItSelectedFilename" class="spaceit-modal-input" onkeyup="spaceIt.checkFilename()" required maxlength="40"> 
            <div class="spaceit-modal-input-group-append"><span class="spaceit-modal-input-group-text">.html</span></div>
          </div>
          <small class="spaceit-modal-input-validation-error"><div id="spaceit-modal-input-group-error"></div></small>
        </div>
        <div class="spaceit-modal-button-bar">
          <a href="javascript:void(0);" id="spaceItCancelButton" class="spaceit-modal-button-secondary" onclick="spaceIt.closeDialog();">Cancel</a>
          <a href="javascript:void(0);" id="spaceItSaveButton" class="spaceit-modal-button-primary" onclick="spaceIt.saveCode();">Save code snippet</a>
        </div>
      </div>
    `;

    
    modalContainer.insertAdjacentHTML("beforeend", html);

    //document.getElementById('spaceItSaveButton').classList.add("spaceit-modal-button-disabled");

    document.getElementById('spaceItSelectedSpace').innerText = null;

    user.data.spaces.sort((a, b) => a.localeCompare(b))

    for (let s of user.data.spaces) {
      let opt = document.createElement('option');
      opt.value = s;
      opt.innerHTML = s;
      document.getElementById('spaceItSelectedSpace').appendChild(opt);
    }


  }

  const showSaveSuccess = (spaceId, filename) => {
    let modalContainer = document.getElementById('spaceItModalContainer');
    modalContainer.innerHTML = "";

    let html = `
      <div id="spaceItSaveSuccessContainer">
        <div class="spaceit-modal-success-button">
          <img class="spaceit-modal-success-img" src="/images/spaceit_success.svg">
        </div>
        <h1 class="spaceit-modal-success-header">Code snippet saved!</h1>
        <p class="spaceit-modal-success-text" style="text-align:center">You will find this code snippet at<br><a style="color: #282A35" href="https://${spaceId}.${spacesPagesURL}.com/${filename}" target="_blank"><b>https://${spaceId}.${spacesPagesURL}.com/${filename}</b></a></p>
        <div class="spaceit-modal-success-button">
          <a href="${spacesUrl}/space/${spaceId}" target="_blank" id="spaceItViewButton" class="spaceit-modal-button-secondary">View file in Spaces<img class="spaceit-success-button-icon" src="/images/export.svg"></a>
        </div>
        <div class="tooltip spaceit-modal-success-button">
          <br>
        </div>
      </div>
    `;
    
    modalContainer.insertAdjacentHTML("beforeend", html);

  }

  const showOutOfQuota = () => {
    let modalContainer = document.getElementById('spaceItModalContainer');
    modalContainer.innerHTML = "";

    let html = `
      <div id="spaceItSaveSuccessContainer">
        <h1 class="spaceit-modal-success-header">You are out of quota!</h1>
        <p class="spaceit-modal-success-text">Your space got closed temporarily, since you already used this month's included quota. Your space will be opened again when your next subscription period starts.</p>
        <p class="spaceit-modal-success-text">Want more quota - and get your space opened right away? Then upgrade to a bigger plan that includes more quota.</p>
        <div class="spaceit-modal-success-button">
          <a href="${billingURL}" target="_blank" id="spaceItViewButton" class="spaceit-modal-button-secondary">Upgrade to a bigger plan</a>
        </div>
      </div>
    `;
    
    modalContainer.insertAdjacentHTML("beforeend", html);

  }

  const showError = () => {
    let modalContainer = document.getElementById('spaceItModalContainer');
    modalContainer.innerHTML = "";

    let html = `
      <div id="spaceItErrorContainer">
        <h1 class="spaceit-modal-success-header">Something bad happened!</h1>
        <p class="spaceit-modal-success-text">An error occured while processing your request.</p>
        <p class="spaceit-modal-success-text">If the problem persists please contact support.</p>
      </div>
    `;
    
    modalContainer.insertAdjacentHTML("beforeend", html);

  }

  const showDialog = async() => {
    // ga('send', 'event', 'spacesFromTryit', 'save');

    if (window.editor) {
      window.editor.save();
    }

    if(!document.getElementById('textareaCode').value.length) {
      return;
    }

    if(!document.getElementById('spaceItModal')) {
        let body = document.querySelector("body");

        let modal = `
          <div id="spaceItModal" class="w3-modal">
            <div id="spaceItModalParentContainer" class="w3-modal-content spaceit-modal">
              <div id="spaceItModalCloseButton" class="spaceit-modal-close-button">
                <a href="javascript:void(0);" onclick="spaceIt.closeDialog();"><img src="/images/close-icon-tryit.svg"></img></a>
              </div>
              <div id="spaceItModalContainer" class="spaceit-modal-container"></div>
            </div>
          </div>
        `;

        body.insertAdjacentHTML("beforeend", modal);

      }

      document.getElementById('spaceItModal').style.display = 'block';

      document.getElementById('spaceItModal').addEventListener("mousedown", clickDownOutsideModal);
      document.getElementById('spaceItModal').addEventListener("mouseup", clickUpOutsideModal);
      document.getElementById('spaceItModal').addEventListener("touchstart", clickDownOutsideModal);
      document.getElementById('spaceItModal').addEventListener("touchend", clickUpOutsideModal);

      var closeModalOK = false;
      function clickDownOutsideModal(event) {
        if (event.target.id == "spaceItModal") {
          closeModalOK = true;
        } else {
          closeModalOK = false;
        }
      }
      
      function clickUpOutsideModal(event) {
        if (event.target.id == "spaceItModal" && closeModalOK) {
          spaceIt.closeDialog();
        }
      }      
      
      if(userSessionIsPresent()) {
        
        showLoading("We are loading your information...");

        await fetchUser();
        
        if(user.error && user.error.code == "1") {
          showError();
          return;
        }

        if(user.data.spaces && user.data.spaces.length) {
          showSaveCode();
          document.getElementById('spaceItSelectedFilename').value = `saved-from-Tryit-${(new Date().toJSON()).split("T")[0]}`;
        }
        else {
          if(user.data.out_of_quota) {
            showOutOfQuota();
          }
          else {
            showSpaceRegistration();
          }
        }

      }
      else {
        
        if (window.editor) {
          window.editor.save();
        }

        if(document.getElementById('textareaCode').value.length) {
          window.localStorage.setItem("spaceItCode", document.getElementById('textareaCode').value);
        }

       showLogin();
        
      }

    }

    const closeDialog = () => {
      document.getElementById('spaceItModal').style.setProperty('display', 'none', 'important');
    }

    return {
      init,
      showDialog,
      closeDialog,
      login,
      signup,
      registerSpace,
      saveCode,
      checkFilename
    }

  })();

window.onhashchange = spaceIt.init;

spaceIt.init();