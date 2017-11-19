import $ from 'jquery';

class UhlsportImageLoader {
  checkImage(articleid, callback) {
    articleid = articleid.replace(/[^A-Za-z0-9]/g, "");
    $.ajax({
      url: "php/uhlsport/checkimage.php",
      xhrFields: { withCredentials: true },
      data: {
        id: articleid
      },
      success: function(data, status, xhr) {
        var result = JSON.parse(data).result;
        callback(result, articleid);
      }
    });
  }
}

export default UhlsportImageLoader;
