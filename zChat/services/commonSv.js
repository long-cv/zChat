export const isEmail = email => {
  return email.match(/^(?:\w+@\w+\.\w+)$/g);
};
export const isPhoneNumber = number => {
  return number.match(/^(?:\d+)$/g);
};
export const formatDate = strDate => {
  let date = new Date(strDate);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return [day, month, year].join('/');
};
