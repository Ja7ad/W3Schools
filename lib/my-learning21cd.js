/*
   MyLearning script
   Version: 1.0.9
*/

/* js-cookie v3.0.0-rc.1 | MIT */
!function (e, t) { "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self, function () { var n = e.Cookies, r = e.Cookies = t(); r.noConflict = function () { return e.Cookies = n, r } }()) }(this, function () { "use strict"; function e(e) { for (var t = 1; t < arguments.length; t++) { var n = arguments[t]; for (var r in n) e[r] = n[r] } return e } var t = { read: function (e) { return e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent) }, write: function (e) { return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent) } }; return function n(r, o) { function i(t, n, i) { if ("undefined" != typeof document) { "number" == typeof (i = e({}, o, i)).expires && (i.expires = new Date(Date.now() + 864e5 * i.expires)), i.expires && (i.expires = i.expires.toUTCString()), t = encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), n = r.write(n, t); var c = ""; for (var u in i) i[u] && (c += "; " + u, !0 !== i[u] && (c += "=" + i[u].split(";")[0])); return document.cookie = t + "=" + n + c } } return Object.create({ set: i, get: function (e) { if ("undefined" != typeof document && (!arguments.length || e)) { for (var n = document.cookie ? document.cookie.split("; ") : [], o = {}, i = 0; i < n.length; i++) { var c = n[i].split("="), u = c.slice(1).join("="); '"' === u[0] && (u = u.slice(1, -1)); try { var f = t.read(c[0]); if (o[f] = r.read(u, f), e === f) break } catch (e) { } } return e ? o[e] : o } }, remove: function (t, n) { i(t, "", e({}, n, { expires: -1 })) }, withAttributes: function (t) { return n(this.converter, e({}, this.attributes, t)) }, withConverter: function (t) { return n(e({}, this.converter, t), this.attributes) } }, { attributes: { value: Object.freeze(o) }, converter: { value: Object.freeze(r) } }) }(t, { path: "/" }) });

/* Base64Decode@base64.js | https://gist.github.com/chrisveness/e121cffb51481bd1c142 | MIT */
function Base64Decode(r) { if (!/^[a-z0-9+/]+={0,2}$/i.test(r) || r.length % 4 != 0) throw Error("Not base64 string"); for (var t, e, n, o, h, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", i = [], f = 0; f < r.length; f += 4)t = (h = a.indexOf(r.charAt(f)) << 18 | a.indexOf(r.charAt(f + 1)) << 12 | (n = a.indexOf(r.charAt(f + 2))) << 6 | (o = a.indexOf(r.charAt(f + 3)))) >>> 16 & 255, e = h >>> 8 & 255, h = 255 & h, i[f / 4] = String.fromCharCode(t, e, h), 64 == o && (i[f / 4] = String.fromCharCode(t, e)), 64 == n && (i[f / 4] = String.fromCharCode(t)); return r = i.join("") }

window.MyLearning = {};

MyLearning.pages_read_count = 0;
MyLearning.total_pages_count = 0;
MyLearning.user_progress_collected = false;

MyLearning._debug = null;

MyLearning._isDebugMode = function () {
   if (this._debug !== null) {
      return this._debug;
   }

   this._debug = Cookies.get('my_learning.debug')

   if (typeof this._debug === 'undefined' || this._debug === null) {
      this._debug = false;
   }

   return this._debug === true || this._debug === 'true';
}

MyLearning.log = function (message, data) {
   if (this._isDebugMode()) {
      if (typeof data === 'undefined') {
         console.log('MyLearning -> ' + message);
      } else {
         console.log('MyLearning -> ' + message, data);
      }
   }
}

MyLearning._version = null;

MyLearning._cacheVersion = function () {
   // return cached result
   if (this._version !== null) {
      this.log('version: ', this._version);
      return this._version;
   }

   this._version = Cookies.get('my_learning.version')

   // fallback to v2.1
   if (typeof this._version === 'undefined' || !this._version) {
      this._version = '2.1';
   }

   this.log('version: ', this._version);
   return this._version;
}

MyLearning._version_to_base_url_map = {
   '1': 'https://mypage.w3schools.com',
   '1.5': 'https://my-learning.w3schools.com',
   '1.5L': 'https://my-learning-legacy.w3schools.com',
   '2': 'https://myl-api.w3schools.com',
   '2.1': 'https://myl-api.w3schools.com'
}

MyLearning._version_and_name_to_rel_url_map = {
   '1': {
      'api.meta': '/mypage/beta.php',
      'api.meta_for_default': '/mypage/beta_for_default.php',
      'api.exercise.get': '/mypage/get_exercise_obj2.php',
      'api.exercise.set': '/mypage/set_exercise_obj.php',
      'api.quiz.set_score': '/mypage/set_quiz_score2.php'
   },
   '1.5': {
      'api.meta': '/api/meta/',
      'api.meta_for_default': '/api/meta-for-default/',
      'api.exercise.get': '/api/exercise/get/',
      'api.exercise.set': '/api/exercise/set/',
      'api.quiz.set_score': '/api/quiz/set-score/'
   },
   '1.5L': {
      'api.meta': '/api/meta/',
      'api.meta_for_default': '/api/meta-for-default/',
      'api.exercise.get': '/api/exercise/get/',
      'api.exercise.set': '/api/exercise/set/',
      'api.quiz.set_score': '/api/quiz/set-score/'
   },
   '2': {
      'api.meta': '/api/classic/get-set-topic-progress',
      // 'api.meta_for_default': '/api/meta-for-default/', // deprecated
      'api.exercise.get': '/api/classic/get-exercises-progress',
      'api.exercise.set': '/api/classic/set-exercises-progress',
      'api.quiz.set_score': '/api/classic/set-quiz-progress'
   },
   '2.1': {
      'api.meta': '/api/classic/get-set-topic-progress',
      'api.exercise.get': '/api/classic/get-exercises-progress',
      'api.exercise.set': '/api/classic/set-exercises-progress',
      'api.quiz.set_score': '/api/classic/set-quiz-progress'
   }
}

// usage:
// MyLearning.getUrl('api.quiz.set_score') -> https://mypage.w3schools.com/mypage/set_quiz_score2.php
MyLearning.getUrl = function (api_name, version) {
   this.log('getUrl: ', api_name);

   if (typeof version === 'undefined') {
      this._cacheVersion();

      version = this._version;
   }

   if (this._isDebugMode()) {
      if (typeof this._version_to_base_url_map[version] === 'undefined') {
         console.warn('MyLearning -> Version is not valid. version: ', version);

         return '/';
      }

      if (typeof this._version_and_name_to_rel_url_map[version][api_name] === 'undefined') {
         console.warn('MyLearning -> Api name is not valid. version, api_name: ', version, api_name);

         return '/';
      }
   }

   return this._version_to_base_url_map[version] + this._version_and_name_to_rel_url_map[version][api_name];
}

MyLearning.userAccessTokenIsPresentAndNotExpired = function () {
   // addapted to work in older browsers
   var access_token = Cookies.get('accessToken');

   if (typeof access_token !== 'undefined') {
      try {
         var access_token_payload_chunk = access_token.split('.')[1];
         var access_token_payload_chunk_b64decoded;

         if (typeof atob === 'function') {
            access_token_payload_chunk_b64decoded = atob(access_token_payload_chunk);
         } else {
            access_token_payload_chunk_b64decoded = Base64Decode(access_token_payload_chunk);
         }

         var access_token_payload = JSON.parse(access_token_payload_chunk_b64decoded);

         if (Date.now() < (access_token_payload.exp * 1000)) {
            return true;
         }
      } catch (exc) {
         if (this._isDebugMode()) {
            console.warn('MyLearning -> Failed parsing user`s "accessToken": ', exc);
         }

         return false;
      }
   }

   return false;
}

MyLearning._user_is_logged_in = null; // cache

MyLearning.userIsLoggedIn = function () {
   // Warning!
   // The access token may be present and not expired yet invalidated in Cognito / signed out
   if (this._user_is_logged_in === null) { // cache the bool value
      this._user_is_logged_in = this.userAccessTokenIsPresentAndNotExpired();
   }

   this.log('userIsLoggedIn: ', this._user_is_logged_in);

   return this._user_is_logged_in;
}

// << classic

// < common

MyLearning.makeLegacyPostRequest = function (url, data, callback) {
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = callback;
   xhttp.open('POST', url, true);
   xhttp.withCredentials = true;
   xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
   xhttp.send(data);
}

MyLearning.elmIsInViewport = function (x) {
   var rect = x.getBoundingClientRect();
   return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
   );
}

MyLearning.elmIsAboveViewport = function (x) {
   var rect = x.getBoundingClientRect();
   if (rect.top < 0) return true;
   return false;
}

MyLearning.getCircleMeta = function (xx, yy, r, aD) {
   var aR = (aD - 90) * Math.PI / 180.0;
   return {
      x: xx + (r * Math.cos(aR)),
      y: yy + (r * Math.sin(aR))
   };
}

MyLearning.getProfileIconCirclesRendered = function (x, y, r, sa, ea) {
   var s = this.getCircleMeta(x, y, r, ea);
   var e = this.getCircleMeta(x, y, r, sa);
   var f = ea - sa <= 180 ? "0" : "1";
   return ["M", s.x, s.y, "A", r, r, 0, f, 0, e.x, e.y].join(" ");
}

MyLearning.loadUser = function (context) {
   this.log('loadUser -> args: ', [context]);

   if (context === 'default') {
      this._loadUser();
   } else if (context === 'footer') {
      this._footerLoadUser();
   }
}

MyLearning.renderAnonymousUser = function () {
   this.log('renderAnonymousUser');

   var a = document.getElementById("mypagediv");
   var b = document.getElementById("w3loginbtn");
   if (a) a.style.display = "none";
   if (b) b.style.display = "inline";
}

MyLearning.getStrWithPrefixRemoved = function (str, subStr) {
   const extractedChunk = str.slice(0, subStr.length);

   if (extractedChunk === subStr) {
      return str.slice(subStr.length);
   }

   return str;
}
// > common

// < default
MyLearning._loadUser = function () {
   if (this.userIsLoggedIn()) {
      this.renderActiveUserLite("B", {});
   } else {
      this.renderAnonymousUser();
   }
}

MyLearning.renderActiveUserLite = function (cc, obj) {
   this.log('renderActiveUserLite -> args: ', [cc, obj]);

   var x, degrees = 0, txt = "", txt2 = "", color1 = "rgba(76, 175, 80, 0.1)", color2 = "rgba(76, 175, 80, 1)";
   var a = document.getElementById("w3loginbtn");
   var b = document.getElementById("mypagediv");
   if (a) a.style.display = "none";
   if (b) {
      //document.getElementById("loginactioncontainer").style.marginLeft =  "0";
      if (cc == "Q") {
         color1 = "rgba(44, 156, 202, 0.1)";
         color2 = "rgba(44, 156, 202, 1)";
      }
      b.style.display = "block";
      txt += "<a href='https://profile.w3schools.com/log-in?redirect_url=https%3A%2F%2Fmy-learning.w3schools.com%2F'>";
      //txt += "<a href='https://mypage.w3schools.com/mypage/default.php'>";
      txt += "<img src='/images/mypagelogo32x32.png' alt='MyLearning' style='position:absolute;top:18px;right:28px'>";
      txt += '<svg style="position:absolute;top:0;right:0;height:70px;width:70px">';
      txt += '<path id="mypage_circle1" fill="none" stroke="' + color1 + '" stroke-width="4"/>';
      txt += '<path id="mypage_circle2" fill="none" stroke="' + color2 + '" stroke-width="4"/>';
      txt += '</svg>';
      txt += '</a>';
      b.innerHTML = "&nbsp;" + txt;
      document.getElementById("mypage_circle1").setAttribute("d", this.getProfileIconCirclesRendered(26, 35, 24, 0, 359.99));
      document.getElementById("mypage_circle2").setAttribute("d", this.getProfileIconCirclesRendered(26, 35, 24, 0, degrees));
   }
}
// > default

// < footer
MyLearning._footerLoadUser = function () { // on lessons this is the first request, on quiz the only one
   this.log('_footerLoadUser');

   if (!this.userIsLoggedIn()) {
      this.renderAnonymousUser();
      return;
   }

   var urlPath = window.location.pathname,
      urlPathWlo = this.getStrWithPrefixRemoved(urlPath, '/'), // wlo - without leading slash
      isQuizPage = false;

   if (urlPathWlo.indexOf('quiztest/quiztest') === 0) {
      isQuizPage = true;

      var pathMetaStr = sessionStorage.getItem(urlPath);

      if (pathMetaStr !== null) {
         var pathMeta = JSON.parse(pathMetaStr);

         if (pathMeta.isQuizPage) {
            this.renderActiveUserWithProgress(pathMeta.reqRes.type, pathMeta.reqRes.raw);
            return;
         }
      }
   }

   // show the user active session first and update the progress when we have it on hands
   this.renderActiveUserWithProgress('T', 'T{"a":0,"b":0}'); // T - unused state, stands for "Temporary/Transitory"

   var x, y, pos, foldername, filename, typ, cc, pathname = window.location.pathname;
   if (pathname.substr(0, 1) == "/") { pathname = pathname.substr(1); }
   pos = pathname.indexOf("/");
   foldername = pathname.substr(0, pos);
   if (pathname.indexOf("pandas") > -1) { foldername = "python/pandas"; }
   if (pathname.indexOf("numpy") > -1) { foldername = "python/numpy"; }
   if (pathname.indexOf("scipy") > -1) { foldername = "python/scipy"; }
   filename = pathname.substr(pos + 1);
   typ = foldername;
   if (foldername == "quiztest") {
      cc = window.location.href;
      pos = cc.indexOf("qtest=");
      typ = cc.substr(pos + 6);
   }
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
         MyLearning.log('_footerLoadUser -> req_res: ', this);

         if (this.status == 200) {
            y = this.responseText;
            x = y.substr(0, 1);
            MyLearning.log('_footerLoadUser -> req_res -> x: ', x);

            if (x == "F" || x == "G" || x == "H" || x == "I" || x == "J" || x == "K" || x == "L" || x == "M" || x == "Q") {
               MyLearning.user_progress_collected = true;
               MyLearning.renderActiveUserWithProgress(x, y); // this one sets the scroll event

               if (isQuizPage) {
                  sessionStorage.setItem(urlPath, JSON.stringify({
                     'isQuizPage': true,
                     'reqRes': {
                        'type': x,
                        'raw': y
                     }
                  }));
               }
            }
         }
      }
   };
   xhttp.open("POST", this.getUrl('api.meta'), true);
   //xhttp.open("POST", "https://mypage.w3schools.com/mypage/beta.php", true);
   xhttp.withCredentials = true;
   xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   var reqData = "a=" + foldername + "&b=" + filename + "&c=" + typ + "&d=0&p=" + encodeURIComponent(window.location.pathname);
   xhttp.send(reqData);

   if (MyLearning._version === '2') { // send a copy to mylv1
      MyLearning.makeLegacyPostRequest(
         MyLearning.getUrl('api.meta', '1.5L'),
         reqData
      );
   }
}

MyLearning.checkIfGotToTheBottomOfThePage = function () {
   var a = document.getElementById("mypagediv2");
   var elm_in_or_above_viewport = MyLearning.elmIsInViewport(a) || MyLearning.elmIsAboveViewport(a);
   // this.log('checkIfGotToTheBottomOfThePage: ', elm_in_or_above_viewport);

   if (elm_in_or_above_viewport) {
      MyLearning.log('checkIfGotToTheBottomOfThePage: ', true);

      window.removeEventListener("scroll", MyLearning.checkIfGotToTheBottomOfThePage);
      MyLearning.finishedPage();
   }
}

MyLearning.renderActiveUserWithProgress = function (cc, obj) {
   this.log('renderActiveUserWithProgress -> args: ', [cc, obj]);

   var x, degrees = 0, txt = "", txt2 = "", color1 = "rgba(76, 175, 80, 0.1)", color2 = "rgba(76, 175, 80, 1)", jsonobj;
   var a = document.getElementById("w3loginbtn");
   var b = document.getElementById("mypagediv");
   var c = document.getElementById("mypagediv2");
   if (a) a.style.display = "none";
   if (b) {
      if (cc == "I" || cc == "J" || cc == "H" || cc == "G" || cc == "O" || cc == "Q") {
         jsonobj = JSON.parse(obj.substr(1));
         this.pages_read_count = jsonobj.b;
         this.total_pages_count = jsonobj.a;
         x = Math.round((this.pages_read_count / this.total_pages_count) * 100);
         degrees = x * 3.6;
         if (degrees > 359) degrees = 359.99;
      }
      if (cc == "Q") {
         color1 = "rgba(44, 156, 202, 0.1)";
         color2 = "rgba(44, 156, 202, 1)";
      }
      b.style.display = "block";
      txt += "<a href='https://profile.w3schools.com/log-in?redirect_url=https%3A%2F%2Fmy-learning.w3schools.com%2F'>";
      //  txt += "<a href='https://mypage.w3schools.com/mypage/default.php'>";
      txt2 = txt;
      txt += "<img src='/images/mypagelogo32x32.png' alt='MYPAGE' style='position:absolute;top:18px;right:28px'>";
      txt2 += "<img src='/images/mypagelogo32x32.png' alt='MYPAGE' style='position:absolute;top:18px;margin-left:10px;xright:28px'>";
      if (cc != "F") {
         txt += '<svg style="position:absolute;top:0;right:0;height:70px;width:70px">';
         txt += '<path id="mypage_circle1" fill="none" stroke="' + color1 + '" stroke-width="4"/>';
         txt += '<path id="mypage_circle2" fill="none" stroke="' + color2 + '" stroke-width="4"/>';
         txt += '</svg>';
         txt2 += '<svg style="position:absolute;xtop:0;xright:0;height:70px;width:70px">';
         txt2 += '<path id="mypage2_circle1" fill="none" stroke="' + color1 + '" stroke-width="4"/>';
         txt2 += '<path id="mypage2_circle2" fill="none" stroke="' + color2 + '" stroke-width="4"/>';
         txt2 += '</svg>';
      }
      if (cc == "J" || cc == "H" || cc == "G") {
         window.addEventListener("scroll", this.checkIfGotToTheBottomOfThePage);
         this.checkIfGotToTheBottomOfThePage();
      }
      if (cc == "Q") {
         if (degrees == 359.99) {
            txt += "<span id='usergetsstar'>&#x2605;</span>";
         }
      }
      txt += '</a>';
      txt2 += '</a>';
      b.innerHTML = "&nbsp;" + txt;
      c.innerHTML = "&nbsp;" + txt2;
      if (cc != "L" && cc != "F") {
         document.getElementById("mypage_circle1").setAttribute("d", this.getProfileIconCirclesRendered(26, 35, 24, 0, 359.99));
         document.getElementById("mypage_circle2").setAttribute("d", this.getProfileIconCirclesRendered(26, 35, 24, 0, degrees));
         document.getElementById("mypage2_circle1").setAttribute("d", this.getProfileIconCirclesRendered(26, 35, 24, 0, 359.99));
         document.getElementById("mypage2_circle2").setAttribute("d", this.getProfileIconCirclesRendered(26, 35, 24, 0, degrees));
      }
   }

   ga('send', 'event', 'user', 'login');
}

MyLearning.finishedPage = function () {
   this.log('finishedPage');

   if (!this.userIsLoggedIn() || !this.user_progress_collected) {
      this.log('finishedPage -> jumping out');
      return;
   }

   var x, y, pos, foldername, filename, typ, pathname = window.location.pathname;
   if (pathname.substr(0, 1) == "/") { pathname = pathname.substr(1); }
   pos = pathname.indexOf("/");
   foldername = pathname.substr(0, pos);
   if (pathname.indexOf("pandas") > -1) { foldername = "python/pandas"; }
   if (pathname.indexOf("numpy") > -1) { foldername = "python/numpy"; }
   if (pathname.indexOf("scipy") > -1) { foldername = "python/scipy"; }
   filename = pathname.substr(pos + 1);
   typ = foldername;
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
         MyLearning.log('finishedPage -> req_res: ', this);

         if (this.status == 200) {
            y = this.responseText;
            x = y.substr(0, 1);
            if (x == "O") {
               MyLearning.registerPointForFinishedPage(x);
            }
         }
      }
   };
   xhttp.open("POST", this.getUrl('api.meta'), true);
   //xhttp.open("POST", "https://mypage.w3schools.com/mypage/beta.php", true);
   xhttp.withCredentials = true;
   xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   var reqData = "a=" + foldername + "&b=" + filename + "&c=" + typ + "&d=1&p=" + encodeURIComponent(window.location.pathname);
   xhttp.send(reqData);

   if (MyLearning._version === '2') { // send a copy to mylv1
      MyLearning.makeLegacyPostRequest(
         MyLearning.getUrl('api.meta', '1.5L'),
         reqData
      );
   }
}

MyLearning.registerPointForFinishedPage = function (cc) {
   MyLearning.log('registerPointForFinishedPage -> args: ', [cc]);

   var x, degrees = 0, txt = "", txt2 = "", completed = 0, color1 = "rgba(76, 175, 80, 0.1)", color2 = "rgba(76, 175, 80, 1)";
   var a = document.getElementById("w3loginbtn");
   var b = document.getElementById("mypagediv");
   var c = document.getElementById("mypagediv2");
   if (c) {
      this.pages_read_count++;
      x = Math.round((this.pages_read_count / this.total_pages_count) * 100);
      degrees = x * 3.6;
      if (degrees > 359) degrees = 359.99;
      txt += "<span class='usergetspoint' id='usergetstutpoint'>+1</span>";
      if (degrees == 359.99) { completed = 1; }
      if (completed == 1) {
         txt += "<span id='usergetsstar'>&#x2605;</span>";
      }
      c.innerHTML += txt;
      document.getElementById("mypage_circle1").setAttribute("d", this.getProfileIconCirclesRendered(26, 35, 24, 0, 359.99));
      document.getElementById("mypage_circle2").setAttribute("d", this.getProfileIconCirclesRendered(26, 35, 24, 0, degrees));
      document.getElementById("mypage2_circle1").setAttribute("d", this.getProfileIconCirclesRendered(26, 35, 24, 0, 359.99));
      document.getElementById("mypage2_circle2").setAttribute("d", this.getProfileIconCirclesRendered(26, 35, 24, 0, degrees));
   }
}
// > footer
// >> classic