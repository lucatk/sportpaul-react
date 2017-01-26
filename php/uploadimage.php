<?php

  $filetype = $_POST["filetype"];
  $savename = $_POST["name"];
  $extension = pathinfo($path, PATHINFO_EXTENSION);

  $target_file = "../public/uploads/$filetype/$savename.$extension";


?>
