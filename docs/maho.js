// https://github.com/kasnder/youtube-embedding-consent
function unblockVideos() {
    document.querySelectorAll('.video_wrapper .video_trigger').forEach(function(_trigger) {
        _trigger.style.display = 'none';

        // seek video_layer element
        for (var i = 0; i < _trigger.parentNode.childNodes.length; i++) {
            var video_layer = _trigger.parentNode.childNodes[i];
            if (video_layer.className == "video_layer") {
                video_layer.style.display = 'block';

                // seek iframe element
                for (var j = 0; j < video_layer.childNodes.length; j++) {
                    var iframe = video_layer.childNodes[j];
                    if (iframe.tagName.toLowerCase() == 'iframe') {
                        var videoId = _trigger.getAttribute('data-source');
                        iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?controls=1&showinfo=0&autoplay=1&mute=0';
                    }
                }
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelectorAll('.video_wrapper .video_trigger .video-btn').forEach(function(node) {
        node.addEventListener("click", function(event) {
            unblockVideos();
        });
    });
});
