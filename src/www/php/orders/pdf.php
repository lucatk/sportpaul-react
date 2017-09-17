<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

include('../database.php');
require('../lib/vendor/autoload.php');
use Spipu\Html2Pdf\Html2Pdf;

$db = new Database();

$stmt = $db->execute("SELECT id, clubname, firstname, lastname, address, postcode, town, phone, created FROM orders WHERE clubid=:clubid AND id=:orderid", ["clubid" => $_GET["clubid"],
                                                                                                                                                            "orderid" => $_GET["id"]]);
$order = $db->fetchAssoc($stmt, 1);
$cstmt = $db->execute("SELECT internalid, name, colour, flockingName, flockingLogo, size, price, flockingPriceName, flockingPriceLogo FROM items WHERE clubid=:clubid AND orderid=:orderid ORDER BY id ASC", ["clubid" => $_GET["clubid"],
                                                                                                                                                                                                              "orderid" => $_GET["id"]]);
$order["items"] = $db->fetchAll($cstmt);
$cstmt = $db->execute("SELECT logodata FROM clubs WHERE id=:clubid", ["clubid" => $_GET["clubid"]]);
$order["clublogo"] = $db->fetchAssoc($cstmt, 1)["logodata"];

$pdfCreator = new Html2Pdf("P", "A4", "de", true, "UTF-8", [15, 15, 10, 20]);

ob_start();
include "pdf_template.php";
$content = ob_get_clean();

$pdfCreator->writeHTML($content);
$pdfCreator->output($order["clubname"] . " - Bestellung vom " . date("d.m.Y", strtotime($order["created"])) . ".pdf", "I");

// class OrderSummaryPDF extends TCPDF {
//   public function Header() {
//     if($this->page == 1) {
//       $image_file = realpath("../../img/logo-sportpaul.jpg");
//       $this->Image($image_file, 15, 15, 60, '', 'JPG', '', 'T');
//       $this->SetFont('helvetica', 'B', 18);
//       $this->SetY(15);
//       $this->Cell(0, 25, 'Verein', 0, false, 'C', 0, '', 0, false, 'M', 'M');
//     }
//   }
//   public function Footer() {
//     $this->SetY(-15);
//     $this->SetFont('helvetica', 'I', 8);
//     $this->Cell(0, 10, 'Seite '.  $this->getAliasNumPage() . '/' . $this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
//   }
// }
//
// $pdf = new OrderSummaryPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
//
// // set document information
// $pdf->SetCreator(PDF_CREATOR);
// $pdf->SetAuthor('Sport Paul GmbH');
// $pdf->SetTitle('Rechnung ..');
//
// $pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
// $pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
//
// $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
//
// $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
// $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
// $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
// $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
//
// $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
//
// $pdf->SetFont('times', 'B', 12);
//
// $pdf->AddPage();
//
// $txt = <<<EOD
// abc
// EOD;
//
// $pdf->Write(0, $txt, '', 0, 'C', true, 0, false, false, 0);
// $pdf->Output('abc.pdf', 'I');

?>
