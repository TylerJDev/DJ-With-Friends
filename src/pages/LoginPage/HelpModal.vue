<template>
    <div id="helpModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">DJ With Friends</h5>
            </div>
            <div class="modal-body">
                 <p>
                    DJ With Friends utilizes the Spotify API to allow for group sessions.

                    This means that you'll have to approve <strong>DJ With Friends</strong> for access to your Spotify account.
                    This allows for the following:
                </p>
                <br/>
                <ol>
                    <li>Allows you to search and add songs to a queue-based system</li>
                    <li>Host via your account, even if you're not the current room owner</li>
                    <li>Join public rooms, and interact by adding your own songs to the room's queue</li>
                </ol>
                <br/>
                <p>
                    No data is held or stored.

                    The following scopes are requested for use:
                </p>
                <br/>
                <ol>
                    <li><strong>user-modify-playback-state</strong></li>
                    <li><strong>user-read-private</strong></li>
                    <li><strong>user-read-playback-state</strong></li>
                </ol>
                <br/>
                <a href="/about#contact" class="help_link">Need help or have questions?</a>
            </div>
            <div class="modal-footer">
               <button type="button" class="close btn btn-primary" data-dismiss="modal">
                    Close
                </button>
            </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @mixin help_link {
        text-decoration: underline;
        color: black;
        font-size: 0.8rem;
    }

    .modal-dialog {
        max-width: 590px;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: 'Roboto Condensed', sans-serif;
    }

    h5 {
        font-size: 1.4rem;
    }

    .close {
      background-color: black;
      color: white;
      border: none;
      font-size: 0.8rem;
      opacity: 1;
      padding: 10px !important;
      width: 100%;
    }

    .close:hover, .close:active {
        background-color: white !important;
        border: 1px solid black !important;
        color: black !important;
    }

    .modal-header, .modal-footer {
        border: none;
    }

    .modal-body {
        text-align: left;
    }

    .help_link {
        @include help_link;
    }

    ol {
        list-style: initial;
        font-size: 1rem;
        padding-left: 20px;
        li {
            margin-top: 5px;
            margin-bottom: 5px;
        }
    }
</style>