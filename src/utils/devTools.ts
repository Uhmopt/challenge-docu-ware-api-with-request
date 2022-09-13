export const devLog = (...params) => {
  console.log(...params);
};

export const systemLog = (...params) => {
  console.log(new Date(), ...params);
};
