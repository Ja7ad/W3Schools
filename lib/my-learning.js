/*! js-cookie v3.0.0-rc.1 | MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,r=e.Cookies=t();r.noConflict=function(){return e.Cookies=n,r}}())}(this,function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)e[r]=n[r]}return e}var t={read:function(e){return e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};return function n(r,o){function i(t,n,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),n=r.write(n,t);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n+c}}return Object.create({set:i,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var n=document.cookie?document.cookie.split("; "):[],o={},i=0;i<n.length;i++){var c=n[i].split("="),u=c.slice(1).join("=");'"'===u[0]&&(u=u.slice(1,-1));try{var f=t.read(c[0]);if(o[f]=r.read(u,f),e===f)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){i(t,"",e({},n,{expires:-1}))},withAttributes:function(t){return n(this.converter,e({},this.attributes,t))},withConverter:function(t){return n(e({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(r)}})}(t,{path:"/"})});

window.MyLearning = {};

MyLearning._debug = true; // can be turned off after release
MyLearning._version = null;

MyLearning.cacheVersion = function () {
   // on release force v2
   this._version = '2';

   // return cached result
   if (this._version !== null) {
      return this._version;
   }

   this._version = Cookies.get('my_learning.version')

   // fallback to v1
   if (typeof this._version === 'undefined' || !this._version) {
      this._version = '1';
   }

   return this._version;
}

MyLearning._version_to_base_url_map = {
   '1': 'https://mypage.w3schools.com',
   '2': 'https://my-learning.w3schools.com'
}

MyLearning._version_and_name_to_rel_url_map = {
   '1': {
      'api.meta': '/mypage/beta.php',
      'api.meta_for_default': '/mypage/beta_for_default.php',
      'api.exercise.get': '/mypage/get_exercise_obj2.php',
      'api.exercise.set': '/mypage/set_exercise_obj.php',
      'api.quiz.set_score': '/mypage/set_quiz_score2.php'
   },
   '2': {
      'api.meta': '/api/meta/',
      'api.meta_for_default': '/api/meta-for-default/',
      'api.exercise.get': '/api/exercise/get/',
      'api.exercise.set': '/api/exercise/set/',
      'api.quiz.set_score': '/api/quiz/set-score/'   
   }
}

// usage:
// MyLearning.getUrl('api.quiz.set_score') -> https://mypage.w3schools.com/mypage/set_quiz_score2.php
MyLearning.getUrl = function (api_name) {
   this.cacheVersion();

   if (this._debug) {
      if (typeof this._version_to_base_url_map[this._version] === 'undefined') {
         console.warn('MyLearning version is not valid. this._version: ', this._version);

         return '/';
      }

      if (typeof this._version_and_name_to_rel_url_map[this._version][api_name] === 'undefined') {
         console.warn('MyLearning api name is not valid. this._version, api_name: ', this._version, api_name);

         return '/';
      }
   }

   return this._version_to_base_url_map[this._version] + this._version_and_name_to_rel_url_map[this._version][api_name];
}