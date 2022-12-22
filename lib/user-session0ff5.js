/*
  User session script
  Version: 1.0.2
*/

function getCognitoConfig() {
  return {
    region: 'us-east-1',
    userPoolId: 'us-east-1_uG9SGX7Wd',
  };
};

function getCognitoIssuerUrl(cognitoCfg) {
  return 'https://cognito-idp.' + cognitoCfg.region + '.amazonaws.com/' + cognitoCfg.userPoolId;
};

function verifyUserSession(
  cognitoCfg,
  userSession, // cookie
  accessToken, // cookie
) {
  var output = {
    error: {
      code: '0',
    },
    data: {},
  };

  if (
    typeof accessToken === 'undefined'
    || !accessToken
  ) {
    // cookie access token will vanish after expiration .. the presence of "userSession" is an indicator that there was a session before
    if (
      typeof userSession !== 'undefined'
      && userSession
    ) {
      if (userSession === '-1') {
        output.error = {
          code: 'USSBR',
          description: 'User session should be refreshed'
        };

        return output;
      }

      output.error = {
        code: 'USHE',
        description: 'User session has expired'
      };

      return output;
    }

    output.error = {
      code: 'USNF', // previously called ATINS
      description: 'User session not found'
    };

    return output;
  } else if (accessToken === '-1') { // legacy fallback
    output.error = {
      code: 'LUSSBR',
      description: 'User session should be refreshed'
    };

    return output;
  }

  var accessTokenMeta = parseAccessToken(accessToken);

  if (accessTokenMeta.error.code !== '0') {
    output.error = accessTokenMeta.error;

    return output;
  }

  output.data = accessTokenMeta.data;

  var claim = accessTokenMeta.data.payload;

  var issuer = getCognitoIssuerUrl(cognitoCfg);

  if (claim.iss !== issuer) {
    output.error = {
      code: 'ATINVCIDNM',
      description: 'Access token is not valid. Claim issuer does not match',
      meta: {
        accessToken: accessToken,
        issuer: issuer,
        claim: claim,
      }
    };

    return output;
  }

  if (claim.token_use !== 'access') {
    output.error = {
      code: 'ATINVCUINA',
      description: 'Access token is not valid. Claim use is not access',
      meta: {
        accessToken: accessToken,
        claim: claim,
      }
    };

    return output;
  }

  return output;
};

function decodeBase64UrlEncodedJwtSection(encodedStr) {
  // https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  var output = {
    error: {
      code: '0'
    },
    data: '',
  };

  try {
    encodedStr = encodedStr
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    output.data = decodeURIComponent(atob(encodedStr)
      .split('')
      .map(function (char) {
        return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''));
  } catch (exc) {
    output.error = getMetaPreparedFromException(exc);
  }

  return output;
};

function parseAccessToken(
  accessToken,
  parseHeader,
) {
  var output = {
    error: {
      code: '0'
    },
    data: {},
  };

  if (
    typeof accessToken === 'undefined'
    || !accessToken
  ) {
    output.error = {
      code: 'USNF', // previously called ATINS
      description: 'User session not found'
    };

    return output;
  } else if (accessToken === '-1') { // legacy fallback
    output.error = {
      code: 'USSBR',
      description: 'User session should be refreshed'
    };

    return output;
  }

  try {
    var accessTokenSections = accessToken.split('.');

    if (accessTokenSections.length < 3) { // maybe in future we may have more than 3 chunks
      output.error = {
        code: 'ATINVWNOTS',
        description: 'Access token is not valid. Wrong number of token sections',
        meta: {
          accessToken: accessToken,
          accessTokenSections: accessTokenSections,
        }
      };

      return output;
    }

    var accessTokenHeader = undefined;

    if (typeof parseHeader !== 'undefined' && parseHeader) {
      var accessTokenHeaderEncodedStr = accessTokenSections[0];

      var accessTokenHeaderDecodedStrRes = decodeBase64UrlEncodedJwtSection(accessTokenHeaderEncodedStr);

      if (accessTokenHeaderDecodedStrRes.error.code !== '0') {
        output.error = {
          code: 'ATINVFDTTH',
          description: 'Access token is not valid. Failed decoding the token header',
          meta: {
            accessToken: accessToken,
            accessTokenHeaderEncodedStr: accessTokenHeaderEncodedStr,
            decodingError: accessTokenHeaderDecodedStrRes.error
          }
        };

        return output;
      }

      var accessTokenHeaderParseRes = parseJson(
        accessTokenHeaderDecodedStrRes.data, // jsonStr
        ['kid', 'alg'], // requiredFields
      );

      if (accessTokenHeaderParseRes.error.code !== '0') {
        output.error = {
          code: 'ATINVFPTH',
          description: 'Access token is not valid. Failed parsing token header',
          meta: {
            accessToken: accessToken,
            accessTokenHeaderEncodedStr: accessTokenHeaderEncodedStr,
            accessTokenHeaderDecodedStr: accessTokenHeaderDecodedStrRes.data,
            parseError: accessTokenHeaderParseRes.error
          }
        };

        return output;
      }

      accessTokenHeader = accessTokenHeaderParseRes.data;
    }

    var accessTokenPayloadEncodedStr = accessTokenSections[1];

    var accessTokenPayloadDecodedStrRes = decodeBase64UrlEncodedJwtSection(accessTokenPayloadEncodedStr);

    if (accessTokenPayloadDecodedStrRes.error.code !== '0') {
      output.error = {
        code: 'ATINVFDTTP',
        description: 'Access token is not valid. Failed decoding the token payload',
        meta: {
          accessToken: accessToken,
          accessTokenPayloadEncodedStr: accessTokenPayloadEncodedStr,
          decodingError: accessTokenPayloadDecodedStrRes.error
        }
      };

      return output;
    }

    var accessTokenPayloadParseRes = parseJson(
      accessTokenPayloadDecodedStrRes.data, // jsonStr
      [
        'sub',
        'event_id',
        'token_use',
        'scope',
        'auth_time',
        'iss',
        'exp',
        'iat',
        'jti',
        'client_id',
        'username',
      ], // requiredFields
    );

    if (accessTokenPayloadParseRes.error.code !== '0') {
      output.error = {
        code: 'ATINVFPTP',
        description: 'Access token is not valid. Failed parsing token payload',
        meta: {
          accessToken: accessToken,
          accessTokenPayloadEncodedStr: accessTokenPayloadEncodedStr,
          accessTokenPayloadDecodedStr: accessTokenPayloadDecodedStrRes.data,
          parseError: accessTokenPayloadParseRes.error
        }
      };

      return output;
    }

    var accessTokenPayload = accessTokenPayloadParseRes.data;

    var accessTokenExpiryUts = parseInt(accessTokenPayload.exp);

    var accessTokenExpiryDto = new Date(accessTokenExpiryUts * 1000);

    output.data = {
      rawStr: accessToken,
      header: accessTokenHeader,
      payload: accessTokenPayload,
      expiryDto: accessTokenExpiryDto,
      expiryUts: accessTokenExpiryUts,
      // expired: getCurrentUts() >= accessTokenExpiryUts,
    };
  } catch (exc) {
    output.error = getMetaPreparedFromException(exc);
  }

  return output;
};

function refreshUserSessionViaRedirect(redirectUrl) {
  // console.log(getCurrentUtus().toString() + ' refreshUserSessionViaRedirect -> initialized -> redirectUrl: ', redirectUrl);
  Cookies.remove('accessToken'); // extra/safety removal
  Cookies.remove('userSession'); // extra/safety removal

  Cookies.set('userSession', '-1', {
    domain: '.w3schools.com',
    path: '/',
    secure: true,
    sameSite: 'strict',
  });

  // return;

  window.location.href = 'https://profile.w3schools.com/refresh-session?redirect_url=' + encodeURIComponent(redirectUrl);
};

// < utils
function getMetaPreparedFromException(exc) {
  var output = {
    code: '1',
    description: 'Internal server error',
  };

  if (exc instanceof Error) {
    output.description = exc.message;
  } else if (typeof exc === 'string') {
    output.description = exc;
  }

  return output;
};

function parseJson(
  jsonStr,
  requiredFields,
) {
  var output = {
    error: {
      code: '0'
    },
    data: {},
  };

  try {
    output.data = JSON.parse(jsonStr);

    if (typeof requiredFields !== 'undefined') {
      for (var i = 0; i < requiredFields.length; i++) {
        var key = requiredFields[i];

        if (
          typeof output.data[key] === 'undefined'
        ) {
          output.error = {
            code: 'FINPID',
            description: 'Field is not present in data',
            meta: {
              key: key,
            }
          };

          return output;
        }
      }
    }
  } catch (exc) {
    output.error = getMetaPreparedFromException(exc);
  }

  return output;
};
// > utils
