<template>
  <v-snackbar
    color="error"
    timer="#730800"
    :text="errorSnackbar"
    v-model="isErrorSnackbarVisible"
  ></v-snackbar>
</template>

<script setup lang="ts">
const session = useCookie<SessionContent>("session");

const config = useRuntimeConfig();
const errorSnackbar = useState<string>("errorSnackbar", () => "");
const isErrorSnackbarVisible = computed({
  get: () => errorSnackbar.value.length > 0,
  set: (value) => {
    if (!value) errorSnackbar.value = "";
  },
});

const classList = useState("classList", () => []);

const fetchClassList = async () => {
  await $fetch(`${config.public.apiBaseUrl}/collection/class`, {
    headers: {
      Authorization: session.value.session_token,
      "Content-Type": "application/json",
    },
  })
    .then((res: any) => {
      classList.value = res;
      console.log(classList.value);
    })
    .catch((err) => {
      errorSnackbar.value = "Error fetching class list";
    });
};

onMounted(() => {
  fetchClassList();
});

useHead({
  title: "Homeworks",
});
</script>
