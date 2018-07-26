<?php
if(!file_exists('clublogos')) {
  mkdir('clublogos', 0777, true);
}
if(!file_exists('productpics')) {
  mkdir('productpics', 0777, true);
}
?>
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    <title>Sport-Paul Vereinsbekleidung</title>
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link href="css/wrapper.css" rel="stylesheet">
  </head>
  <body>
    <div id="header-wrapper">
      <div class="container">
        <a href="/">
          <img src="img/header-logo.png">
          <h1>Vereinsbekleidung</h1>
        </a>
      </div>
    </div>
    <div id="root"></div>

    <script type="text/javascript" src="dist/manifest.js?q=<?php echo time(); ?>"></script>
    <script type="text/javascript" src="dist/vendor.js?q=<?php echo time(); ?>"></script>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <script type="text/javascript" src="dist/app.js?q=<?php echo time(); ?>"></script>
  </body>
</html>
