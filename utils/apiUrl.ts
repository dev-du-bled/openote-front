/// Author: Firmin BORRACINO
///
/// Description: Used to define the API URL based on the environment

const apiUrl: string = `${process.env.NUXT_ENV_API_PROTOCOL || "http"}://${
  process.env.NUXT_ENV_API_HOST || "localhost"
}:${process.env.NUXT_ENV_API_PORT || "8000"}`;
export default apiUrl;
