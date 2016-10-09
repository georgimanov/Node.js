$(document).ready(function() {
    $('.delete-btn').on('click', function () {
        var $this = $(this);

        $.ajax({
            url: '/videos',
            type: 'put',
            data: {
                video: $this.attr('video-data'),
                playlistId: $this.attr('playlist-data')
            },
            success: function() {
                window.location = "/";
            }
        });
    });
});
