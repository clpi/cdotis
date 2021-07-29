<script>
import { page } from '$app/stores';
  $: {
    if (typeof gtag !== "undefined"){
      gtag("config", "G-Y7J10NG6D1", {
        page_path: $page.path
      });
    }
  }
</script>
