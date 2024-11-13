export const userProfilePicture = ref<string | null>(null);
export const setProfilePicture = (picture: string) => {
  userProfilePicture.value = picture;
};
