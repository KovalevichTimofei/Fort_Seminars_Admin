export function encrypt(str, mask) {
  let encryptedString = '';// alert("d");
  const notEncryptedString = str;
  const Mask = mask;
  let i = 0; let j = 0;

  for (i = 0; i < notEncryptedString.length; i++) {
    let char = notEncryptedString.charAt(i);
    const com = char.charCodeAt(0) ^ Mask.charCodeAt(j);
    char = String.fromCharCode(com);
    // if(c=='\\') fri+='\\';
    encryptedString += char;

    if (j === Mask.length - 1) j = 0;
    else j++;
  }

  return encryptedString;
}

export function decrypt(str, mask) {
  const encryptedString = str;
  let dencryptedString = '';

  let i = 0; let j = 0;
  const Mask = mask;

  for (i = 0; i < encryptedString.length - 2; i++) {
    let char = encryptedString.charAt(i);
    const com = char.charCodeAt(0) ^ Mask.charCodeAt(j);
    char = String.fromCharCode(com);
    dencryptedString += char;
    if (j === Mask.length - 1) j = 0;
    else j++;
  }

  return dencryptedString;
}

export function replaceSlashs(str) {
  const strArr = str.split('');

  const newStrArr = strArr.map(el => (el === '/' ? '*' : el));

  return newStrArr.join('');
}

export function generateId() {
  return `_${Math.random().toString(36).substr(2, 9)}`;
}
