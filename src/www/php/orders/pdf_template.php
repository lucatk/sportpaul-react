<style type="text/css">
  * {
    box-sizing: border-box;
  }
  .header {
    padding: 20px 0 0 20px;
  }
  .header #logo {
    max-width: 80mm;
    height: 25mm;
    margin-right: 40px;
    float: left;
    vertical-align: bottom;
  }
  .header #heading {
    display: inline-block;
    margin: 25px;
  }
  .header #clublogo {
    position: absolute;
    top: 20mm;
    right: 0;
    height: 25mm;
    float: right;
  }
  .customer-info {
    margin-top: 35mm;
    padding: 3mm 12mm;
  }
  .customer-info h2, .customer-info p {
    margin: 1px 0;
    font-size: 14px;
  }
  #items-table {
    margin-top: 30px;
    padding-left: 20px;
    table-layout: fixed;
    border-collapse: collapse;
  }
  #items-table th, #items-table td {
    vertical-align: middle;
    text-overflow: ellipsis;
    white-space: normal;
    overflow: hidden;
  }
  #items-table, #items-table th, #items-table td {
    border: 1px solid black;
  }
  #flocking-warning {
    position: absolute;
    bottom: 15mm;
    left: 0;
    text-align: center;
    font-weight: bold;
  }
  .signature-area {
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .signature-area table {
    font-size: 16px;
  }
  .signature-area table th {
    padding: 5px 10px 5px;
  }
  .signature-area table td {
    border-bottom: 1px solid black;
  }
</style>
<?php
$printHeader = true;
// $toPrint = count($orders);
$toPrint = 1;
?>
<page backtop="0" backbottom="0" footer="date;time;page" hideheader="<?php echo implode(",", range(2, $toPrint>2?$toPrint:2)); ?>">
  <page_header>
    <div class="header">
      <img id="logo" src="../../img/logo-sportpaul.jpg">
      <h1 id="heading">Bestellung</h1>

      <img id="clublogo" src="../../clublogos/<?php echo $order["clublogo"]; ?>">
    </div>
  </page_header>
  <div class="customer-info">
    <h2><?php echo $order["clubname"]; ?></h2>
    <p><?php echo $order["firstname"] . " " . $order["lastname"]; ?></p>
    <p><?php echo $order["address"]; ?></p>
    <p><?php echo $order["postcode"] . " " . $order["town"]; ?></p>
  </div>
  <!-- <div class="contents"> -->
    <table id="items-table" style="table-layout:fixed;width:100%;">
      <thead>
        <tr>
          <th style="width:5%;padding:0 10px;">Art. Nr.</th>
          <th style="width:15%;padding:0 10px;">Farbe</th>
          <th style="width:25%;padding:0 10px;">Bezeichnung</th>
          <th style="width:25%;padding:0 10px;">Beflockung(en)</th>
          <th style="width:10%;padding:0 10px;">Größe</th>
          <th style="width:10%;padding:0 10px;">Preis</th>
        </tr>
      </thead>
      <tbody>
        <?php
        $total = 0;
        $totalThisPage = 0;
        foreach($order["items"] as $item) {
          $colour = json_decode($item["colour"]);
          $flockings = json_decode($item["flockings"]);
          $flockingPrices = 0;
          foreach($flockings as $flocking) {
            $flockingPrices += $flocking->price;
          }
          $price = floatval($item["price"]) + floatval($flockingPrices);
          $total += $price;
          $totalThisPage += $price;
          // if(strlen($item["flockingName"]) > 10) {
          //   $item["flockingName"] = substr($item["flockingName"], 0, 7) . "...";
          // }
          ?>
          <tr>
            <td style="width:5%;padding:0 10px;"><?php echo $item["internalid"]; ?></td>
            <td style="width:15%;padding:0 10px;hyphens:auto;word-wrap:break-word;"><?php echo $colour->id . " " . $colour->name; ?></td>
            <td style="width:25%;padding:0 10px;"><?php echo $item["name"]; ?></td>
            <td style="width:25%;padding:0 10px 10px;hyphens:auto;word-wrap:break-word;">
              <?php
                foreach($flockings as $flocking) {
                  $str = $flocking->description . ($flocking->type == "0"?" (" . $flocking->value . ")":"");
                  // if(strlen($str) > 10) $str = substr($str, 0, 7) . "...";
                  if(strlen($str)>23) {
                    $splitEvery = (int)(strlen($str)/20);
                    for($i = 1; $i <= $splitEvery; $i++) {
                      $str = substr_replace($str, '- ', $i*20, 0);
                    }
                  }
              ?>
              <p><?php echo $str; ?></p>
              <?php } ?>
            </td>
            <td style="width:10%;padding:0 10px;"><?php echo $item["size"]; ?></td>
            <td style="width:10%;padding:15px 10px 0;"><?php echo number_format($price, 2, ",", ""); ?> €</td>
          </tr>
          <?php
        }
        ?>
        <tr>
          <th colspan="4" style="border-left:none;border-bottom:none;"></th>
          <th style="text-align:center;">Gesamt:</th>
          <th style="text-align:center;"><?php echo number_format($totalThisPage, 2, ",", ""); ?> €</th>
        </tr>
      </tbody>
    </table>
  <!-- </div> -->
  <!-- <page_footer>
    <div class="footer">

    </div>
  </page_footer> -->
  <p id="flocking-warning">Hinweis: Beflockte Artikel sind vom Umtausch ausgeschlossen!</p>
  <div class="signature-area">
    <table>
      <tr>
        <th>Datum:</th>
        <td style="width:30mm;"></td>
        <th style="padding-left:30px;">Unterschrift:</th>
        <td style="width:50mm;"></td>
      </tr>
    </table>
  </div>
</page>
